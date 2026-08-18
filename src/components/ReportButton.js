import { useState } from "react";
import { api } from "../api/client";

export default function ReportButton({ targetType, targetId, label = "Report" }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reports", { targetType, targetId, reason });
      setStatus("Thanks — your report was submitted.");
      setOpen(false);
      setReason("");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" className="btn-text btn-sm" onClick={() => setOpen(true)}>
        {label}
      </button>
      {status && <span className="report-status">{status}</span>}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)} role="presentation">
          <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog">
            <h2 className="page-title">Report content</h2>
            <form onSubmit={submit}>
              <label className="report-label">
                Reason (optional)
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Why are you reporting this?"
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-primary btn-sm" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit report"}
                </button>
                <button type="button" className="btn-secondary btn-sm" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
