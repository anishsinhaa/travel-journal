import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { exitFlow } from "../utils/navigation";
import formStyles from "../styles/Forms.module.scss";
import styles from "../styles/pages/EditTrip.module.scss";
import { FormPageSkeleton } from "../components/LoadingSkeleton";

export default function EditTrip() {
  const { tripId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get(`/trips/${tripId}`), api.get(`/trips/${tripId}/photos`)])
      .then(([tripRes, photosRes]) => {
        const trip = tripRes.trip;
        if (user && trip.authorId !== user.uid) {
          navigate(`/trip/${tripId}`, { replace: true });
          return;
        }
        setForm({
          location: trip.location || "",
          state: trip.state || "",
          date: trip.date || "",
          description: trip.description || "",
          maplink: trip.maplink || "",
          isPublic: trip.isPublic !== false,
        });
        setPhotos(photosRes.photos);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tripId, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveMetadata = async () => {
    await api.put(`/trips/${tripId}`, form);
  };

  const savePhotoOrder = async (orderedPhotos) => {
    const photoIds = orderedPhotos.map((p) => p.photoId);
    await api.put(`/trips/${tripId}`, { photoIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveMetadata();
      exitFlow(navigate, `/trip/${tripId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const movePhoto = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setPhotos(reordered);

    try {
      await savePhotoOrder(reordered);
    } catch (err) {
      setError(err.message);
    }
  };

  const removePhotoFromTrip = async (photo) => {
    if (!window.confirm("Remove this photo from the trip? The photo will become standalone.")) return;

    try {
      await api.put(`/photos/${photo.photoId}`, { tripId: null });
      setPhotos((prev) => prev.filter((p) => p.photoId !== photo.photoId));
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePhoto = async (photo) => {
    if (!window.confirm("Permanently delete this photo? This cannot be undone.")) return;

    try {
      await api.delete(`/photos/${photo.photoId}`);
      setPhotos((prev) => prev.filter((p) => p.photoId !== photo.photoId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !user) return;

    setUploading(true);
    setError(null);

    try {
      const newPhotos = [];
      for (const file of files) {
        const photoKey = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const path = `${user.uid}/${photoKey}/${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const { photo } = await api.post("/photos", {
          url,
          storagePath: path,
          caption: "",
          tripId,
          isPublic: form.isPublic,
        });
        newPhotos.push(photo);
      }

      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteTrip = async () => {
    if (
      !window.confirm(
        "Delete this entire trip? Photos will be kept as standalone — they won't be deleted."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/trips/${tripId}`);
      navigate("/my-travels", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || !form) {
    return (
      <div className={`page-container ${styles.root}`}>
        <FormPageSkeleton />
      </div>
    );
  }

  return (
    <div className={`page-container ${styles.root}`}>
      <h2 className="page-title">Edit Trip</h2>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Location *
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          State / Region
          <input name="state" value={form.state} onChange={handleChange} />
        </label>
        <label>
          Date
          <input name="date" value={form.date} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>
        <label>
          Google Maps link
          <input name="maplink" value={form.maplink} onChange={handleChange} />
        </label>
        <label className={formStyles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          Make this trip public
        </label>

        <section className={styles.photosSection}>
          <div className={styles.photosHeader}>
            <h3>Photos</h3>
            <label className={`btn-secondary btn-sm ${styles.addPhotosBtn}`}>
              {uploading ? "Uploading..." : "+ Add Photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploading}
                onChange={handleAddPhotos}
              />
            </label>
          </div>

          {photos.length === 0 ? (
            <p className={formStyles.hint}>No photos yet. Add some above.</p>
          ) : (
            <ul className={styles.photoList}>
              {photos.map((photo, index) => (
                <li key={photo.photoId} className={styles.photoItem}>
                  <img src={photo.url} alt={photo.caption || "Trip photo"} />
                  <div className={styles.photoInfo}>
                    <span className={styles.photoCaption}>
                      {photo.caption || <em>No caption</em>}
                    </span>
                    <div className={styles.photoActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        disabled={index === 0}
                        onClick={() => movePhoto(index, -1)}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        disabled={index === photos.length - 1}
                        onClick={() => movePhoto(index, 1)}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() =>
                          navigate(`/photo/${photo.photoId}/edit`, {
                            replace: true,
                            state: { returnTo: `/trip/${tripId}` },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => removePhotoFromTrip(photo)}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => deletePhoto(photo)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && <p className="page-error">{error}</p>}

        <div className={styles.formActions}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exitFlow(navigate, `/trip/${tripId}`)}
          >
            Cancel
          </button>
        </div>
      </form>

      <section className={styles.dangerZone}>
        <h3>Danger zone</h3>
        <p>Deleting a trip removes the folder but keeps your photos as standalone.</p>
        <button type="button" className="btn-danger" onClick={handleDeleteTrip}>
          Delete Trip
        </button>
      </section>
    </div>
  );
}
