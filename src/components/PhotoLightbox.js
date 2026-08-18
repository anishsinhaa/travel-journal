import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export function normalizeCarouselPhoto(photo) {
  if (typeof photo === "string") {
    return { photoId: null, url: photo, caption: "" };
  }
  return {
    photoId: photo.photoId || null,
    url: photo.url,
    caption: photo.caption || "",
  };
}

export default function PhotoLightbox({
  photos = [],
  open,
  index = 0,
  onClose,
  onIndexChange,
  onPhotoClick,
}) {
  const items = photos.map(normalizeCarouselPhoto).filter((p) => p.url);

  if (!items.length) return null;

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={items.map((photo) => ({
        src: photo.url,
        title: photo.caption || undefined,
      }))}
      plugins={[Zoom, Captions]}
      on={{
        view: ({ index: i }) => onIndexChange?.(i),
        click: onPhotoClick
          ? ({ index: i }) => {
              const photo = items[i];
              if (photo?.photoId) onPhotoClick(photo.photoId);
            }
          : undefined,
      }}
    />
  );
}
