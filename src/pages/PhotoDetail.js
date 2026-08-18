import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { api } from "../api/client";
import CommentItem from "../components/CommentItem";
import PhotoLightbox from "../components/PhotoLightbox";
import ReportButton from "../components/ReportButton";
import SmartImage from "../components/SmartImage";
import { PhotoDetailSkeleton } from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/pages/PhotoDetail.module.scss";

export default function PhotoDetail() {
  const { photoId } = useParams();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [trip, setTrip] = useState(null);
  const [tripPhotos, setTripPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imgSize, setImgSize] = useState(null);
  const mediaRef = useRef(null);

  const fitImage = useCallback(() => {
    const container = mediaRef.current;
    if (!container) return;
    const img = container.querySelector("img.smart-image");
    if (!img?.naturalWidth) return;

    const maxH = window.innerHeight - 145;
    const maxW = container.clientWidth;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);

    setImgSize({
      width: Math.round(img.naturalWidth * scale),
      height: Math.round(img.naturalHeight * scale),
    });
  }, []);

  useEffect(() => {
    setImgSize(null);
  }, [photo?.url]);

  useEffect(() => {
    const container = mediaRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(() => fitImage());
    observer.observe(container);

    window.addEventListener("resize", fitImage);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitImage);
    };
  }, [fitImage, photo?.url]);

  useEffect(() => {
    api.post(`/photos/${photoId}/view`).catch(() => {});

    Promise.all([api.get(`/photos/${photoId}`), api.get(`/photos/${photoId}/comments`)])
      .then(async ([photoRes, commentsRes]) => {
        setPhoto(photoRes.photo);
        setTrip(photoRes.trip);
        setComments(commentsRes.comments);

        if (photoRes.trip?.tripId) {
          const { photos } = await api.get(`/trips/${photoRes.trip.tripId}/photos`);
          setTripPhotos(photos);
        } else {
          setTripPhotos([photoRes.photo]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [photoId]);

  const toggleLike = async () => {
    if (!user) return;
    const { liked } = await api.post(`/photos/${photoId}/like`);
    setPhoto((prev) => ({
      ...prev,
      liked,
      likesCount: (prev.likesCount || 0) + (liked ? 1 : -1),
    }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    const { comment } = await api.post(`/photos/${photoId}/comments`, {
      text: commentText,
    });
    setComments((prev) => [...prev, comment]);
    setCommentText("");
    setPhoto((prev) => ({
      ...prev,
      commentsCount: (prev.commentsCount || 0) + 1,
    }));
  };

  const editComment = async (commentId, text) => {
    const { comment } = await api.put(`/photos/${photoId}/comments/${commentId}`, { text });
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, ...comment } : c))
    );
  };

  const deleteComment = async (commentId) => {
    await api.delete(`/photos/${photoId}/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    setPhoto((prev) => ({
      ...prev,
      commentsCount: Math.max(0, (prev.commentsCount || 0) - 1),
    }));
  };

  const openLightbox = () => {
    const carouselPhotos = tripPhotos.length ? tripPhotos : photo ? [photo] : [];
    const idx = carouselPhotos.findIndex((p) => p.photoId === photoId);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className={`page-container ${styles.root}`}>
        <PhotoDetailSkeleton />
      </div>
    );
  }
  if (error) return <p className="page-error">{error}</p>;
  if (!photo) return <p className="page-error">Photo not found</p>;

  const isOwner = user?.uid === photo.authorId;
  const carouselPhotos = tripPhotos.length ? tripPhotos : [photo];

  return (
    <div className={`page-container ${styles.root}`}>
      <div className={styles.layout}>
        <div className={styles.media} ref={mediaRef}>
          <SmartImage
            className={styles.image}
            src={photo.url}
            alt={photo.caption || photo.location || "Travel photo"}
            loading="eager"
            imgStyle={imgSize ?? undefined}
            onImageLoad={fitImage}
            onClick={openLightbox}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox();
              }
            }}
            aria-label="Open photo in carousel viewer"
          />
        </div>

        <div className={styles.side}>
          <div className={styles.header}>
            {photo.location && <h2 className={styles.title}>{photo.location}</h2>}
            <div className="detail-header-actions">
              {!isOwner && user && (
                <ReportButton targetType="photo" targetId={photoId} />
              )}
              {isOwner && (
                <NavLink to={`/photo/${photoId}/edit`} className="btn-secondary btn-sm">
                  Edit Photo
                </NavLink>
              )}
            </div>
          </div>

          <p className={styles.caption}>
            {photo.caption || <span className={styles.noCaption}>No caption</span>}
          </p>

          {photo.date && (
            <p className={styles.date}>
              <strong>{photo.date}</strong>
            </p>
          )}

          <p className={styles.author}>
            by{" "}
            <Link to={`/profile/${photo.authorId}`} className="author-link">
              {photo.authorName}
            </Link>
          </p>

          {trip && (
            <Link to={`/trip/${trip.tripId}`} className={styles.tripLink}>
              View trip: {trip.location}
            </Link>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={`like-btn ${photo.liked ? "liked" : ""}`}
              onClick={toggleLike}
              disabled={!user}
            >
              {photo.liked ? "♥" : "♡"} {photo.likesCount || 0}
            </button>
            <div className={`trip-stats ${styles.stats}`}>
              <span>{photo.viewCount || 0} views</span>
              <span>{photo.commentsCount || 0} comments</span>
            </div>
          </div>

          <section className={`comments-section ${styles.comments}`}>
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
              {comments.length === 0 ? (
                <p className={styles.noComments}>No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <CommentItem
                    key={c.commentId}
                    comment={c}
                    currentUserId={user?.uid}
                    isPostOwner={isOwner}
                    onEdit={editComment}
                    onDelete={deleteComment}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <PhotoLightbox
        photos={carouselPhotos}
        open={lightboxOpen}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
