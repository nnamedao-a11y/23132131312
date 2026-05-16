/**
 * FrameComponent20 — "Top vehicles deals" filter row.
 *
 *   [🏍][🚗][🚙][🛻][🚐]   |  [10-15K] [15-25K] [30-50K]              PROPOSALS - 46
 *
 * Two segmented controls (vehicle type and price tier) and a
 * right-aligned proposals counter.  Active state is filled amber.
 * Icons reuse the EXACT same 5 PNG assets as the Calculator page
 * (motorbike/sedan/SUV/pick-up/van) so users get a consistent
 * vehicle-type taxonomy across Welcome, Calculator and Catalog.
 */
import { useState } from "react";
import styles from "./frame-component20.module.css";

/**
 * Vehicle types — kept 1:1 in sync with /pages/public/CalculatorPage.js
 * `VEHICLES`.  When the user clicks a type here, the SAME apiType is
 * later forwarded to the backend (catalog & top-deals filtering)
 * so the result-set across Welcome / Calculator / Catalog matches.
 */
const VEHICLE_TYPES = [
  { id: "motorbike", icon: "/figma/calc/veh-motorbike.png", alt: "Motorbike", apiType: "motorcycle" },
  { id: "sedan",     icon: "/figma/calc/veh-sedan.png",     alt: "Sedan",     apiType: "sedan" },
  { id: "suv",       icon: "/figma/calc/veh-suv.png",       alt: "SUV",       apiType: "suv" },
  { id: "pickup",    icon: "/figma/calc/veh-pickup.png",    alt: "Pick-up",   apiType: "pickup" },
  { id: "van",       icon: "/figma/calc/veh-van.png",       alt: "Van",       apiType: "bigSUV" },
];
const PRICE_TIERS = ["10-15K", "15-25K", "30-50K"];

const FrameComponent20 = ({ className = "", onChange }) => {
  const [vehicle, setVehicle] = useState("sedan");
  const [tier, setTier] = useState("10-15K");

  const selectVehicle = (id) => {
    setVehicle(id);
    const apiType = VEHICLE_TYPES.find((v) => v.id === id)?.apiType;
    if (typeof onChange === "function") onChange({ vehicleId: id, apiType, tier });
  };

  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          {/* Vehicle type segmented control — 5 PNG icons (calculator parity) */}
          <div className={styles.segment} role="tablist" aria-label="Vehicle type">
            {VEHICLE_TYPES.map(({ id, icon, alt }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={vehicle === id}
                aria-label={alt}
                data-testid={`top-deals-type-${id}`}
                className={`${styles.segmentBtn} ${vehicle === id ? styles.segmentBtnActive : ""}`}
                onClick={() => selectVehicle(id)}
              >
                {/* Recolour the silhouette via CSS mask so the same PNG can
                 *  appear white on dark bg and black on the amber active bg. */}
                <span
                  aria-hidden="true"
                  className={styles.segmentIcon}
                  style={{
                    WebkitMaskImage: `url(${icon})`,
                    maskImage: `url(${icon})`,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Price tier segmented control */}
          <div className={styles.segment} role="tablist" aria-label="Price range">
            {PRICE_TIERS.map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={tier === p}
                className={`${styles.tierBtn} ${tier === p ? styles.tierBtnActive : ""}`}
                onClick={() => {
                  setTier(p);
                  const apiType = VEHICLE_TYPES.find((v) => v.id === vehicle)?.apiType;
                  if (typeof onChange === "function") onChange({ vehicleId: vehicle, apiType, tier: p });
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.proposalsBlock}>
          <div className={styles.proposals}>proposals - 46</div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent20;
