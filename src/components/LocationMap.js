import { getMapEmbedUrl, getMapOpenUrl } from "../utils/mapUtils";
import styles from "../styles/components/LocationMap.module.scss";

export default function LocationMap({ maplink, location, className = "" }) {
  const embedUrl = getMapEmbedUrl(maplink, location);
  const openUrl = getMapOpenUrl(maplink, location);

  if (!embedUrl || !openUrl) return null;

  const openMaps = () => window.open(openUrl, "_blank", "noopener,noreferrer");

  return (
    <button
      type="button"
      className={`${styles.map} ${className}`.trim()}
      onClick={openMaps}
      aria-label={`Open ${location} in Google Maps`}
    >
      <iframe
        title={`Map of ${location}`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
      />
      <span className={styles.overlay}>Open in Google Maps</span>
    </button>
  );
}
