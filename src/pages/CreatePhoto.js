import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import formStyles from "../styles/Forms.module.scss";

export default function CreatePhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    caption: "",
    location: "",
    date: "",
    tripId: searchParams.get("tripId") || "",
    isPublic: true,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get(`/trips/user/${user.uid}`).then(({ trips: userTrips }) => {
      setTrips(userTrips);
    });
  }, [user]);

  useEffect(() => {
    if (!form.tripId) return;
    const trip = trips.find((t) => t.tripId === form.tripId);
    if (trip) {
      setForm((prev) => ({
        ...prev,
        location: prev.location || trip.location || "",
        date: prev.date || trip.date || "",
      }));
    }
  }, [form.tripId, trips]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a photo");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const photoKey = `photo-${Date.now()}`;
      const path = `${user.uid}/${photoKey}/${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const payload = {
        url,
        storagePath: path,
        caption: form.caption,
        location: form.location,
        date: form.date,
        isPublic: form.isPublic,
      };

      if (form.tripId) {
        payload.tripId = form.tripId;
      }

      const { photo } = await api.post("/photos", payload);

      if (form.tripId) {
        navigate(`/trip/${form.tripId}`, { replace: true });
      } else {
        navigate(`/photo/${photo.photoId}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`page-container ${formStyles.root}`}>
      <h2 className="page-title">Post a Photo</h2>
      <form onSubmit={handleSubmit} className={formStyles.form}>
        <label>
          Photo *
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
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
          <input name="date" value={form.date} onChange={handleChange} placeholder="JULY 30, 2021" />
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
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Post Photo"}
        </button>
      </form>
    </div>
  );
}
