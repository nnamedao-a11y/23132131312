import { useEffect } from "react";
import "./TiltParallax.css";

/**
 * useTiltParallax — reusable hook that attaches the standard BIBI "hover/press
 * 3D tilt" parallax effect to a list of cards.
 *
 * Mirrors the behaviour of the OUR SERVICES section:
 *   • Static by default — cards do not move until the user interacts.
 *   • On desktop: cursor entering a card triggers a 3D tilt + Z lift +
 *     subtle scale, neighbouring cards stay put.
 *   • On mobile / coarse pointer: the same effect fires on touch /
 *     pointerdown and releases on touchend.
 *   • First time the cards enter the viewport, they cascade in with a
 *     70 ms stagger via IntersectionObserver.
 *   • Honours `prefers-reduced-motion`.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useTiltParallax(ref, { cardsSelector: ':scope > article' });
 *
 * Params:
 *   rootRef         React ref to the container that wraps the cards.
 *   options:
 *     cardsSelector CSS selector (relative to the root) for each card.
 *                   Defaults to ':scope > [data-tilt-card]'.
 *     enableMobile  When true (default) attaches touch / pointer listeners.
 *     deps          Optional dependency array \u2014 pass values like fetched
 *                   data here so the hook re-attaches when async-rendered
 *                   cards appear in the DOM.
 */
export const useTiltParallax = (rootRef, options = {}) => {
  const {
    cardsSelector = ":scope > [data-tilt-card]",
    enableMobile = true,
    deps = [],
  } = options;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isCoarsePointer = window.matchMedia?.(
      "(hover: none), (pointer: coarse)",
    ).matches;
    const isMobile = window.innerWidth < 768;

    const cards = Array.from(root.querySelectorAll(cardsSelector));
    if (cards.length === 0) return undefined;

    cards.forEach((card, i) => {
      card.classList.add("tilt-card");
      card.style.setProperty("--tilt-stagger", String(i));
    });

    // ── Stagger fade-in ──────────────────────────────────────────────
    let io = null;
    if (!reduceMotion && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("tilt-entered");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      cards.forEach((c) => io.observe(c));
    } else {
      cards.forEach((c) => c.classList.add("tilt-entered"));
    }

    if (reduceMotion) {
      return () => io?.disconnect();
    }

    // ── Live tilt drivers ────────────────────────────────────────────
    const cardHandlers = [];
    const useTouch = enableMobile && (isCoarsePointer || isMobile);

    cards.forEach((card) => {
      let raf = 0;
      let cx = 0;
      let cy = 0;
      const apply = () => {
        raf = 0;
        card.style.setProperty("--tilt-ctx", cx.toFixed(4));
        card.style.setProperty("--tilt-cty", cy.toFixed(4));
      };
      const updateCoords = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        cx = (clientX - rect.left) / rect.width - 0.5;
        cy = (clientY - rect.top) / rect.height - 0.5;
        if (!raf) raf = requestAnimationFrame(apply);
      };

      // Desktop hover
      const onEnter = (e) => {
        card.classList.add("tilt-hover");
        updateCoords(e.clientX, e.clientY);
      };
      const onMove = (e) => updateCoords(e.clientX, e.clientY);
      const onLeave = () => {
        card.classList.remove("tilt-hover");
        cx = 0;
        cy = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      };

      // Touch / press
      const onPress = (e) => {
        const point = e.touches?.[0] ?? e;
        card.classList.add("tilt-pressed");
        updateCoords(point.clientX, point.clientY);
      };
      const onPressMove = (e) => {
        const point = e.touches?.[0] ?? e;
        updateCoords(point.clientX, point.clientY);
      };
      const onRelease = () => {
        card.classList.remove("tilt-pressed");
        cx = 0;
        cy = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      };

      if (!isCoarsePointer && !isMobile) {
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      }
      if (useTouch) {
        card.addEventListener("touchstart", onPress, { passive: true });
        card.addEventListener("touchmove", onPressMove, { passive: true });
        card.addEventListener("touchend", onRelease, { passive: true });
        card.addEventListener("touchcancel", onRelease, { passive: true });
      }

      cardHandlers.push({
        card,
        onEnter,
        onMove,
        onLeave,
        onPress,
        onPressMove,
        onRelease,
      });
    });

    return () => {
      io?.disconnect();
      cardHandlers.forEach(
        ({ card, onEnter, onMove, onLeave, onPress, onPressMove, onRelease }) => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("touchstart", onPress);
          card.removeEventListener("touchmove", onPressMove);
          card.removeEventListener("touchend", onRelease);
          card.removeEventListener("touchcancel", onRelease);
        },
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsSelector, enableMobile, ...deps]);
};

export default useTiltParallax;
