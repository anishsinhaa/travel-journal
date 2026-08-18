import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import formStyles from "../styles/Forms.module.scss";

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    state: "",
    date: "",
    description: "",
    maplink: "",
    isPublic: true,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    setError(null);

    try {
      const { trip } = await api.post("/trips", {
        ...form,
        photos: [],
      });

      navigate(`/trip/${trip.tripId}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`page-container ${formStyles.root}`}>
      <h2 className="page-title">Create New Trip</h2>
      <p className={formStyles.hint}>
        A trip is a folder for your journey. Add photos to it later via Post Photo.
      </p>
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
          <input name="date" value={form.date} onChange={handleChange} placeholder="JULY 30, 2021" />
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
        {error && <p className="page-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}
