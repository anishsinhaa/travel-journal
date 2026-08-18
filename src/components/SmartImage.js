import { useState } from "react";

export default function SmartImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  imgStyle,
  onImageLoad,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  "aria-label": ariaLabel,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`smart-image-fallback ${className}`.trim()} role="img" aria-label={alt}>
        Image unavailable
      </div>
    );
  }

  return (
    <div className={`smart-image-wrap ${className}`.trim()}>
      {!loaded && <div className="smart-image-skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        style={imgStyle}
        className={`smart-image ${loaded ? "is-loaded" : ""}`}
        onLoad={(e) => {
          setLoaded(true);
          onImageLoad?.(e);
        }}
        onError={() => setFailed(true)}
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
      />
    </div>
  );
}
