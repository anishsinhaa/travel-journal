import { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import PhotoCarousel from "../components/PhotoCarousel";
import CommentItem from "../components/CommentItem";
import LocationMap from "../components/LocationMap";
import ReportButton from "../components/ReportButton";
import { TripDetailSkeleton } from "../components/LoadingSkeleton";
import styles from "../styles/pages/TripDetail.module.scss";

export default function TripDetail() {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [carouselOpen, setCarouselOpen] = useState(false);

  useEffect(() => {
    api.post(`/trips/${tripId}/view`).catch(() => {});

    Promise.all([
      api.get(`/trips/${tripId}`),
      api.get(`/trips/${tripId}/comments`),
      api.get(`/trips/${tripId}/photos`),
    ])
      .then(([tripRes, commentsRes, photosRes]) => {
        setTrip(tripRes.trip);
        setComments(commentsRes.comments);
        setPhotos(photosRes.photos);
      })
      .finally(() => setLoading(false));
  }, [tripId]);

  const toggleLike = async () => {
    if (!user) return;
    const { liked } = await api.post(`/trips/${tripId}/like`);
    setTrip((prev) => ({
      ...prev,
      liked,
      likesCount: (prev.likesCount || 0) + (liked ? 1 : -1),
    }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    const { comment } = await api.post(`/trips/${tripId}/comments`, {
      text: commentText,
    });
    setComments((prev) => [...prev, comment]);
    setCommentText("");
    setTrip((prev) => ({
      ...prev,
      commentsCount: (prev.commentsCount || 0) + 1,
    }));
  };

  const editComment = async (commentId, text) => {
    const { comment } = await api.put(`/trips/${tripId}/comments/${commentId}`, { text });
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, ...comment } : c))
    );
  };

  const deleteComment = async (commentId) => {
    await api.delete(`/trips/${tripId}/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    setTrip((prev) => ({
      ...prev,
      commentsCount: Math.max(0, (prev.commentsCount || 0) - 1),
    }));
  };

  if (loading) {
    return (
      <div className="page-container">
        <TripDetailSkeleton />
      </div>
    );
  }
  if (!trip) return <p className="page-error">Trip not found</p>;

  const isOwner = user?.uid === trip.authorId;

  return (
    <div className="page-container">
      {photos.length > 0 ? (
        <section className={styles.photosSection}>
          <div className={styles.photosHeader}>
          <h2 className={styles.photosTitle}>Photos from {trip.location}</h2>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setCarouselOpen(true)}
            >
              View in Carousel
            </button>
          </div>
          <PhotoCarousel
            photos={photos}
            title={`Photos from ${trip.location}`}
            navigateOnPhotoClick
            lightboxOpen={carouselOpen}
            onLightboxOpenChange={setCarouselOpen}
          />
        </section>
      ) : (
        <div className={styles.emptyPhotos}>
          <p>No photos in this trip yet.</p>
          {isOwner && (
            <NavLink to={`/create-photo?tripId=${tripId}`} className="btn-primary btn-sm">
              + Add Photo
            </NavLink>
          )}
        </div>
      )}
      <div className={styles.body}>
        <div className="trip-owner-bar">
          {isOwner ? (
            <>
              <NavLink
                to={`/trip/${tripId}/edit`}
                state={{ returnTo: `/trip/${tripId}` }}
                className="btn-secondary btn-sm"
              >
                Edit Trip
              </NavLink>
              <NavLink to={`/create-photo?tripId=${tripId}`} className="btn-secondary btn-sm">
                + Add Photo
              </NavLink>
            </>
          ) : (
            user && <ReportButton targetType="trip" targetId={tripId} />
          )}
        </div>
        <div className={styles.main}>
          <div className={styles.desc}>
            <h2 className={styles.title}>{trip.location}</h2>
            <h6 className={styles.date}>
              <strong>{trip.date}</strong>
            </h6>
            <p className={styles.text}>{trip.description}</p>
          </div>

          <div className={styles.side}>
            <div className={styles.meta}>
              <div className={`trip-stats ${styles.detailStats}`}>
                <span>{trip.viewCount || 0} views</span>
                <span>{trip.commentsCount || 0} comments</span>
              </div>
              <div className={`trip-actions ${styles.detailActions}`}>
                <button
                  type="button"
                  className={`like-btn ${trip.liked ? "liked" : ""}`}
                  onClick={toggleLike}
                  disabled={!user}
                >
                  {trip.liked ? "♥" : "♡"} {trip.likesCount || 0}
                </button>
                <Link to={`/profile/${trip.authorId}`} className="author-link">
                  by {trip.authorName}
                </Link>
              </div>
            </div>
            <LocationMap
              maplink={trip.maplink}
              location={trip.location}
              className={styles.tripMap}
            />
          </div>
        </div>

        <section className={`comments-section ${styles.commentsSection}`}>
          <h3>Comments</h3>
          {user ? (
            <form onSubmit={submitComment} className="comment-form">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
              />
              <button type="submit">Post</button>
            </form>
          ) : (
            <p>
              <Link to="/signin">Sign in</Link> to comment
            </p>
          )}
          <div className="comments-list">
            {comments.map((c) => (
              <CommentItem
                key={c.commentId}
                comment={c}
                currentUserId={user?.uid}
                isPostOwner={isOwner}
                onEdit={editComment}
                onDelete={deleteComment}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
