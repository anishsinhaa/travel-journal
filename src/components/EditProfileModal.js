import { useState } from "react";
import { api } from "../api/client";
import formStyles from "../styles/Forms.module.scss";

export default function EditProfileModal({ profile, open, onClose, onSaved }) {
  const [bio, setBio] = useState(profile?.bio || "");
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!open || !profile) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { user } = await api.put("/users/me", { bio, displayName });
      onSaved(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="edit-profile-title">
        <h2 id="edit-profile-title" className="page-title">Edit Profile</h2>
        <form onSubmit={handleSubmit} className={formStyles.form}>
          <label>
            Display name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              required
            />
          </label>
          <label>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Tell travelers about yourself..."
            />
          </label>
          {error && <p className="page-error">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
