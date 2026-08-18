import { Link } from "react-router-dom";

export default function CommentAuthor({ authorId, authorName, className = "" }) {
  if (!authorId) {
    return <strong className={className}>{authorName}</strong>;
  }

  return (
    <Link
      to={`/profile/${authorId}`}
      className={`author-link comment-author-link ${className}`.trim()}
      onClick={(e) => e.stopPropagation()}
    >
      {authorName}
    </Link>
  );
}
