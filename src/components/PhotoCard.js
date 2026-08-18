import { useNavigate, Link } from "react-router-dom";
import CommentAuthor from "./CommentAuthor";
import SmartImage from "./SmartImage";
import styles from "../styles/components/PhotoCard.module.scss";

export default function PhotoCard({ photo }) {
  const navigate = useNavigate();

  return (
    <main className="main-card">
      <div className="card" onClick={() => navigate(`/photo/${photo.photoId}`)}>
        {photo.fromFollowing && <span className="trip-badge">Following</span>}
        <SmartImage
          className="photo"
          src={photo.url}
          alt={photo.caption || photo.location || "Travel photo"}
        />
        <section className="info">
          <p className={styles.caption}>
            {photo.caption || <span className={styles.noCaption}>No caption</span>}
          </p>
          <p className={styles.by}>
            <Link
              to={`/profile/${photo.authorId}`}
              className="author-link"
              onClick={(e) => e.stopPropagation()}
            >
              by {photo.authorName}
            </Link>
          </p>
          {photo.date && (
            <h6 className={styles.date}>
              <strong>{photo.date}</strong>
            </h6>
          )}
          {photo.trip && (
            <p className={styles.trip}>
              <Link
                to={`/trip/${photo.trip.tripId}`}
                className="author-link"
                onClick={(e) => e.stopPropagation()}
              >
                {photo.trip.location}
              </Link>
            </p>
          )}
          {photo.latestComment && (
            <div className={styles.comment}>
              <CommentAuthor
                authorId={photo.latestComment.authorId}
                authorName={photo.latestComment.authorName}
              />
              <span>{photo.latestComment.text}</span>
            </div>
          )}
          <div className="trip-meta">
            <span>{photo.likesCount || 0} likes</span>
            <span>{photo.viewCount || 0} views</span>
            {photo.commentsCount > 0 && <span>{photo.commentsCount} comments</span>}
          </div>
        </section>
      </div>
    </main>
  );
}
