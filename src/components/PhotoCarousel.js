import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhotoLightbox, { normalizeCarouselPhoto } from "./PhotoLightbox";
import SmartImage from "./SmartImage";
import { CardGridSkeleton } from "./LoadingSkeleton";
import styles from "../styles/components/PhotoCarousel.module.scss";

export default function PhotoCarousel({
  photos = [],
  title,
  navigateOnPhotoClick = false,
  lightboxOpen: controlledOpen,
  onLightboxOpenChange,
  lightboxStartIndex = 0,
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const [index, setIndex] = useState(lightboxStartIndex);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value) => {
    if (!isControlled) setInternalOpen(value);
    onLightboxOpenChange?.(value);
  };

  useEffect(() => {
    if (open) setIndex(lightboxStartIndex);
  }, [open, lightboxStartIndex]);

  const items = photos.map(normalizeCarouselPhoto).filter((p) => p.url);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handlePhotoClick = (photo, i) => {
    if (navigateOnPhotoClick && photo.photoId) {
      navigate(`/photo/${photo.photoId}`);
      return;
    }
    setIndex(i);
    setOpen(true);
  };

  const handleLightboxPhotoClick = (photoId) => {
    setOpen(false);
    navigate(`/photo/${photoId}`);
  };

  if (!items.length) return <CardGridSkeleton count={3} fullWidth={false} />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className={styles.track} ref={scrollRef}>
          {items.map((photo, i) => (
            <figure key={photo.photoId || `${photo.url}-${i}`} className={styles.slide}>
              <SmartImage
                className={styles.photo}
                src={photo.url}
                alt={photo.caption || `${title || "Trip"} ${i + 1}`}
                onClick={() => handlePhotoClick(photo, i)}
              />
              <figcaption
                className={`${styles.caption} ${!photo.caption ? styles.captionEmpty : ""}`}
              >
                {photo.caption || "No caption"}
              </figcaption>
            </figure>
          ))}
        </div>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
      <PhotoLightbox
        photos={items}
        open={open}
        index={index}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
        onPhotoClick={navigateOnPhotoClick ? handleLightboxPhotoClick : undefined}
      />
    </div>
  );
}
