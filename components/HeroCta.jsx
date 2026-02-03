/**
 * HeroCta Component
 * 
 * A reusable hero/CTA banner component with gradient background, heading, subtitle, and action buttons.
 * 
 * Usage:
 * ```jsx
 * import HeroCta from './HeroCta';
 * 
 * function App() {
 *   return <HeroCta />;
 * }
 * ```
 * 
 * Recommended fonts: Inter or Poppins from Google Fonts
 * Add to your layout.tsx or _app.js:
 * ```jsx
 * import { Inter } from 'next/font/google';
 * const inter = Inter({ subsets: ['latin'] });
 * ```
 */

import styles from './HeroCta.module.css';
import Link from 'next/link';

export default function HeroCta({
  variant = "default",
  showPill = true,
  pillText = "Enquire Now",
  title = "Turn GenAI From Cost Center to Value Engine",
  subtitle = "Whether you're a CDO, CIO, or a Product Owner — if you're done with endless pilots and need real outcomes. Let's make it happen.",
  primaryHref = "/contact",
  primaryText = "Talk to us",
  secondaryHref = "/agents",
  secondaryText = "Start with a pilot",
} = {}) {
  return (
    <section className={`${styles.hero} ${variant === "striped" ? styles.stripedHero : ""}`}>
      <div className={styles.patternBackground} />
      <div className={styles.outerContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          {/* Top Pill Badge */}
          {showPill && (
            <div className={styles.pillContainer}>
              <div className={styles.pill}>{pillText}</div>
            </div>
          )}

          {/* Main Heading */}
          <h1 className={styles.title}>
            {title}
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        </div>

        {/* Button Group */}
        <div className={styles.btnGroup}>
          <div className={styles.btnPrimaryWrapper}>
            <Link
              href={primaryHref}
              className={styles.btnPrimary}
              aria-label={primaryText}
            >
              {primaryText}
            </Link>
          </div>
          <Link
            href={secondaryHref}
            className={styles.btnSecondary}
            aria-label={secondaryText}
          >
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}

