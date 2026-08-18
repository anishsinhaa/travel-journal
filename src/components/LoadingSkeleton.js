import styles from "../styles/components/LoadingSkeleton.module.scss";

function Bone({ className = "" }) {
  return <div className={`${styles.bone} ${className}`.trim()} aria-hidden="true" />;
}

export function CardGridSkeleton({ count = 6, fullWidth = true }) {
  return (
    <div
      className={`${styles.cardGrid} ${fullWidth ? styles.fullWidth : ""}`.trim()}
      aria-busy="true"
      aria-label="Loading content"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card}>
          <Bone className={styles.cardImage} />
          <Bone className={styles.cardLine} />
          <Bone className={`${styles.cardLine} ${styles.short}`} />
          <Bone className={`${styles.cardLine} ${styles.meta}`} />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton({ showSections = true }) {
  return (
    <div aria-busy="true" aria-label="Loading profile">
      <div className={styles.profile}>
        <Bone className={styles.avatar} />
        <div className={styles.profileLines}>
          <Bone className={styles.line} />
          <Bone className={`${styles.line} ${styles.sm}`} />
          <Bone className={`${styles.line} ${styles.xs}`} />
        </div>
      </div>
      {showSections && <CardGridSkeleton count={4} />}
    </div>
  );
}

export function PhotoDetailSkeleton() {
  return (
    <div className={styles.photoDetail} aria-busy="true" aria-label="Loading photo">
      <Bone className={styles.detailImage} />
      <div className={styles.profileLines}>
        <Bone className={styles.line} />
        <Bone className={`${styles.line} ${styles.sm}`} />
        <Bone className={`${styles.line} ${styles.sm}`} />
        <Bone className={`${styles.line} ${styles.xs}`} />
        <Bone className={styles.formArea} />
      </div>
    </div>
  );
}

export function TripDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading trip">
      <Bone className={styles.tripHero} />
      <div className={styles.tripBody}>
        <div className={styles.profileLines}>
          <Bone className={styles.line} />
          <Bone className={`${styles.line} ${styles.sm}`} />
          <Bone className={styles.formArea} />
        </div>
        <div className={styles.profileLines}>
          <Bone className={`${styles.line} ${styles.xs}`} />
          <Bone className={`${styles.line} ${styles.xs}`} />
          <Bone className={styles.detailImage} />
        </div>
      </div>
    </div>
  );
}

export function NotificationsSkeleton({ count = 5 }) {
  return (
    <ul className={styles.notifList} aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.notifItem}>
          <Bone className={styles.notifAvatar} />
          <div className={styles.profileLines}>
            <Bone className={`${styles.line} ${styles.sm}`} />
            <Bone className={`${styles.line} ${styles.xs}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function FormPageSkeleton() {
  return (
    <div className={styles.formBlock} aria-busy="true" aria-label="Loading form">
      <Bone className={styles.line} />
      <Bone className={styles.formField} />
      <Bone className={styles.formField} />
      <Bone className={styles.formField} />
      <Bone className={styles.formArea} />
      <Bone className={styles.formField} />
    </div>
  );
}

export function PageSpinner({ small = false }) {
  return (
    <div className={styles.spinnerWrap} role="status" aria-label="Loading">
      <div className={`${styles.spinner} ${small ? styles.spinnerSm : ""}`.trim()} />
    </div>
  );
}
