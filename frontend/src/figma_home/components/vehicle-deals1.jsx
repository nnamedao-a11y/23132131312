/**
 * VehicleDeals1 — header for the "Top vehicles deals of the week".
 *
 * Pixel-aligned to the Figma reference shared by the user
 * (Figma → Dev Mode inspection):
 *
 *   ┌──────────────────────────── full width ────────────────────────┐
 *   │                                                                  │
 *   │                        TOP VEHICLES DEALS                       │  ← centered
 *   │                                                                  │     (gap-28
 *   │                            OF THE WEEK                          │      between lines)
 *   │                                                                  │
 *   │                                                                  │  ← big gap
 *   │                                                                  │
 *   │                                ⌜ THOUSANDS OF LISTINGS.  ⌝     │
 *   │                                │ ONLY THE BEST MAKE THE   │     │  ← right-edge,
 *   │                                │ UPDATED WEEKLY           │     │     aligned with
 *   │                                ⌞                          ⌟     │     card grid
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * Brackets: 3 px stroke, color **#555452** (Figma Vector layer),
 * 13 × 76 px native size; vertically stretched to wrap the tagline.
 */
import { useLang } from "../../i18n";
import AnimatedHeading from "../../components/AnimatedHeading";
import styles from "./vehicle-deals1.module.css";

const Bracket = ({ side = "left" }) => (
  <svg
    className={side === "left" ? styles.bracket : styles.bracketRight}
    viewBox="0 0 17 80"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    {/* "[" path — short top, long vertical, short bottom (Figma Vector.svg). */}
    <path
      d="M14.5264 1.5H1.5V77.5264H14.5264"
      stroke="#555452"
      strokeWidth="3"
      strokeLinecap="square"
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const T = {
  en: {
    titleOrange: "Top vehicles deals",
    titleWhite: "of the week",
    line1: "Thousands of listings.",
    line2: "Only the best make the cut.",
    line3: "Updated weekly",
  },
  bg: {
    titleOrange: "Топ автомобилни оферти",
    titleWhite: "на седмицата",
    line1: "Хиляди обяви.",
    line2: "Само най-добрите преминават.",
    line3: "Актуализирано седмично",
  },
};

const VehicleDeals1 = ({ className = "" }) => {
  const { lang } = useLang();
  const t = lang === "bg" ? T.bg : T.en;
  return (
    <section className={[styles.vehicleDeals, className].join(" ")}>
      {/* Centered title — both lines stacked with a tight 28 px gap.
          Both lines share the same scroll-trigger via AnimatedHeading;
          line 2's baseDelay continues the per-char cascade from line 1
          (≈ length-of-line-1 chars * 28 ms step) so the diagonal wave
          flows smoothly across both lines. */}
      <div className={styles.titleBlock}>
        <AnimatedHeading as="h2" className={styles.titleOrange} text={t.titleOrange} />
        <AnimatedHeading
          as="h2"
          className={styles.titleWhite}
          text={t.titleWhite}
          baseDelay={(t.titleOrange?.replace(/\s/g, "").length || 0) * 28}
        />
      </div>

      {/* Bracketed tagline — right-aligned with the cards grid below. */}
      <div className={styles.taglineWrap}>
        <div className={styles.tagline}>
          <Bracket side="left" />
          <p className={styles.taglineText}>
            <span className={`${styles.taglineLine} ${styles.taglineLine1}`}>{t.line1}</span>
            <span className={`${styles.taglineLine} ${styles.taglineLine2}`}>{t.line2}</span>
            <span className={`${styles.taglineLine} ${styles.taglineLine3}`}>{t.line3}</span>
          </p>
          <Bracket side="right" />
        </div>
      </div>
    </section>
  );
};

export default VehicleDeals1;
