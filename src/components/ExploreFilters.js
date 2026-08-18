import { useEffect, useState } from "react";
import styles from "../styles/components/ExploreFilters.module.scss";

export default function ExploreSearchBar({ value, onChange }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 350);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className={styles.searchWrap}>
      <input
        type="search"
        className={styles.searchInput}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Search location, author, or date..."
        aria-label="Search explore"
      />
      {draft && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            setDraft("");
            onChange("");
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function ExploreViewToggle({ view, onChange }) {
  return (
    <div className={styles.toggle} role="tablist" aria-label="Explore view">
      <button
        type="button"
        role="tab"
        aria-selected={view === "photos"}
        className={`${styles.toggleBtn} ${view === "photos" ? styles.active : ""}`}
        onClick={() => onChange("photos")}
      >
        Photos
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === "trips"}
        className={`${styles.toggleBtn} ${view === "trips" ? styles.active : ""}`}
        onClick={() => onChange("trips")}
      >
        Trips
      </button>
    </div>
  );
}
