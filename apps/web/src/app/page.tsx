import Link from "next/link";
import styles from "./hero.module.css";

export default function Home() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.gradientBg} />
      <div className={styles.orb + " " + styles.orb1} />
      <div className={styles.orb + " " + styles.orb2} />
      <div className={styles.orb + " " + styles.orb3} />
      <div className={styles.gridPattern} />

      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <svg
            className={styles.badgeIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Event Management Platform
        </div>

        <h1 className={styles.headline}>
          Create Memorable
          <span className={styles.headlineAccent}>Events, Effortlessly</span>
        </h1>

        <p className={styles.subheadline}>
          Plan, organize, and manage your events with a beautiful, intuitive
          platform. From intimate gatherings to large conferences — we&apos;ve
          got you covered.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/events" className={styles.ctaPrimary}>
            Browse Events
            <svg
              className={styles.ctaIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/login" className={styles.ctaSecondary}>
            Sign In
          </Link>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>500+</div>
            <div className={styles.statLabel}>Events Created</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>10K+</div>
            <div className={styles.statLabel}>Attendees</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>99%</div>
            <div className={styles.statLabel}>Satisfaction</div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <svg
          className={styles.scrollIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
}
