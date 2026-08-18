import { useState } from "react";
import { Icon } from "@iconify/react";
import CommentAuthor from "./CommentAuthor";

export default function CommentItem({
  comment,
  currentUserId,
  isPostOwner,
  onEdit,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [busy, setBusy] = useState(false);

  const isAuthor = currentUserId && comment.authorId === currentUserId;
  const canEdit = isAuthor;
  const canDelete = isAuthor || isPostOwner;
  const showActions = canEdit || canDelete;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editText.trim() || busy) return;
    setBusy(true);
    try {
      await onEdit(comment.commentId, editText.trim());
      setEditing(false);
    } catch {
      // parent may surface error
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy || !window.confirm("Delete this comment?")) return;
    setBusy(true);
    try {
      await onDelete(comment.commentId);
    } catch {
      // parent may surface error
    } finally {
      setBusy(false);
    }
  };

  const cancelEdit = () => {
    setEditText(comment.text);
    setEditing(false);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <CommentAuthor authorId={comment.authorId} authorName={comment.authorName} />
        {showActions && !editing && (
          <div className="comment-actions">
            {canEdit && (
              <button
                type="button"
                className="comment-action-btn"
                onClick={() => setEditing(true)}
                disabled={busy}
                title="Edit comment"
                aria-label="Edit comment"
              >
                <Icon icon="material-symbols:edit-outline" width={18} height={18} />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="comment-action-btn comment-action-delete"
                onClick={handleDelete}
                disabled={busy}
                title="Delete comment"
                aria-label="Delete comment"
              >
                <Icon icon="material-symbols:delete-outline" width={18} height={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="comment-edit-form">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            disabled={busy}
            autoFocus
          />
          <div className="comment-edit-actions">
            <button type="submit" disabled={busy || !editText.trim()}>
              Save
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={cancelEdit} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p>{comment.text}</p>
      )}
    </div>
  );
}
