import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
      </div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBadge}></div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonActions}>
        <div className={styles.skeletonButton}></div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
