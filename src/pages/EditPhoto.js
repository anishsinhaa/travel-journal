import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { exitFlow } from "../utils/navigation";
import formStyles from "../styles/Forms.module.scss";
import styles from "../styles/pages/EditTrip.module.scss";
import { FormPageSkeleton } from "../components/LoadingSkeleton";

export default function EditPhoto() {
  const { photoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    Promise.all([api.get(`/photos/${photoId}`), api.get(`/trips/user/${user.uid}`)])
      .then(([photoRes, tripsRes]) => {
        const p = photoRes.photo;
        if (p.authorId !== user.uid) {
          navigate(photoRes.trip ? `/trip/${photoRes.trip.tripId}` : `/photo/${photoId}`, {
            replace: true,
          });
          return;
        }
        setPhoto(p);
        setTrips(tripsRes.trips);
        setForm({
          caption: p.caption || "",
          location: p.location || "",
          date: p.date || "",
          tripId: p.tripId || "",
          isPublic: p.isPublic !== false,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [photoId, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        caption: form.caption,
        location: form.location,
        date: form.date,
        isPublic: form.isPublic,
        tripId: form.tripId || null,
      };
      await api.put(`/photos/${photoId}`, payload);

      const originalTripId = photo.tripId || "";
      const newTripId = form.tripId || "";
      if (originalTripId !== newTripId) {
        if (newTripId) navigate(`/trip/${newTripId}`, { replace: true });
        else navigate(`/photo/${photoId}`, { replace: true });
      } else {
        exitFlow(navigate, "/my-travels");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this photo? This cannot be undone.")) return;

    try {
      const tripId = form.tripId;
      await api.delete(`/photos/${photoId}`);
      if (tripId) exitFlow(navigate, `/trip/${tripId}`);
      else navigate("/my-travels", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || !form || !photo) {
    return (
      <div className={`page-container ${styles.root}`}>
        <FormPageSkeleton />
      </div>
    );
  }

  return (
    <div className={`page-container ${styles.root}`}>
      <h2 className="page-title">Edit Photo</h2>

      <img className={styles.preview} src={photo.url} alt={photo.caption || "Photo"} />

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Add to trip
          <select name="tripId" value={form.tripId} onChange={handleChange}>
            <option value="">No trip (standalone photo)</option>
            {trips.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.location}
                {trip.date ? ` — ${trip.date}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Caption
          <textarea name="caption" value={form.caption} onChange={handleChange} rows={3} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>
          Date
          <input name="date" value={form.date} onChange={handleChange} />
        </label>
        <label className={formStyles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          Make this photo public (visible on Explore)
        </label>

        {error && <p className="page-error">{error}</p>}

        <div className={styles.formActions}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exitFlow(navigate, "/my-travels")}
          >
            Cancel
          </button>
        </div>
      </form>

      <section className={styles.dangerZone}>
        <h3>Danger zone</h3>
        <p>Permanently delete this photo from your journal.</p>
        <button type="button" className="btn-danger" onClick={handleDelete}>
          Delete Photo
        </button>
      </section>
    </div>
  );
}
