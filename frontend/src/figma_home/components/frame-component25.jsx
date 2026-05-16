import { useEffect, useRef } from "react";
import { useLang } from "../../i18n";
import BUTTON1 from "./b-u-t-t-o-n1";
import AnimatedHeading from "../../components/AnimatedHeading";
import styles from "./frame-component25.module.css";

const T = {
  en: {
    ourServices: "our Services",
    import: "Import",
    importDesc:
      "We help you find the right car based on your budget, style, and needs - handling the inspection, purchase, and delivery from the USA to Bulgaria.",
    euAdaptation: "Adaptation to European Standards",
    euAdaptationDesc:
      "We adapt the vehicle to EU standards and ensure it’s ready for smooth registration.",
    registration: "Registration and Certification",
    registrationDesc:
      "We handle full registration in Bulgaria, including KAT, documents, and transit plates - supporting you every step.",
    financing: "Financing",
    financingDesc:
      "We connect you with TBI Bank and UniCredit Bulbank and guide you through the financing process.",
    partsSourcing: "Parts Sourcing and Delivery",
    partsSourcingDesc:
      "We source and order quality parts from the USA, helping you save without compromise.",
    autoService: "Auto Service",
    autoServiceDesc:
      "We handle all repairs and technical work through a trusted partner service.",
    detailing: "Detailing and Cleaning",
    detailingDesc:
      "We provide professional cleaning and restoration of both exterior and interior. We make your car look and feel like new.",
    homeDelivery: "Home Delivery",
    homeDeliveryDesc:
      "We arrange delivery of your vehicle to any city in Bulgaria. You receive a ready-to-drive car right at your doorstep — no hassle, no extra trips.",
    findACar: "find a car",
  },
  bg: {
    ourServices: "нашите услуги",
    import: "Внос",
    importDesc:
      "Помагаме ви да намерите правилния автомобил според бюджета, стила и нуждите ви – извършваме инспекция, покупка и доставка от САЩ до България.",
    euAdaptation: "Адаптация към европейските стандарти",
    euAdaptationDesc:
      "Адаптираме автомобила към стандартите на ЕС и гарантираме готовност за безпроблемна регистрация.",
    registration: "Регистрация и сертификация",
    registrationDesc:
      "Извършваме пълна регистрация в България, включително КАТ, документи и транзитни табели – на ваше разположение на всяка крачка.",
    financing: "Финансиране",
    financingDesc:
      "Свързваме ви с TBI Bank и UniCredit Bulbank и ви водим през процеса на финансиране.",
    partsSourcing: "Намиране и доставка на части",
    partsSourcingDesc:
      "Намираме и поръчваме качествени части от САЩ, помагайки ви да спестите без компромиси.",
    autoService: "Авто сервиз",
    autoServiceDesc:
      "Извършваме всички ремонти и техническа работа чрез доверен партньорски сервиз.",
    detailing: "Детайлинг и почистване",
    detailingDesc:
      "Предоставяме професионално почистване и възстановяване на екстериора и интериора. Правим колата ви да изглежда и се чувства като нова.",
    homeDelivery: "Доставка до дома",
    homeDeliveryDesc:
      "Организираме доставка на автомобила до всеки град в България. Получавате готов за шофиране автомобил пред вратата си – без главоболия и излишни пътувания.",
    findACar: "намери автомобил",
  },
};

const FrameComponent25 = ({
  className = "",
})=> {
  const { lang } = useLang();
  const t = lang === "bg" ? T.bg : T.en;
  const rootRef = useRef(null);

  /* ─────────────────────────────────────────────────────────────────────
   * 3D-tilt orchestration for the 8 service cards.
   *
   * The grid stays statically aligned at all times — no card ever leaves
   * its slot during scroll or while idle. The parallax only fires while
   * a card is hovered:
   *
   *   • The hovered card tilts in 3D toward the cursor and lifts on Z.
   *   • Its icon, headings and body float at their own depths inside the
   *     card, creating real "layered glass" parallax INSIDE the card.
   *   • All neighbouring cards remain completely still.
   *
   * Initial entrance is a one-shot stagger fade-in driven by an
   * IntersectionObserver — once the section enters the viewport each
   * card eases up into place with a 70 ms cascade between siblings.
   *
   * All hover updates are batched via requestAnimationFrame so the
   * section never costs more than one composited paint per frame, and
   * the whole effect respects `prefers-reduced-motion`.
   * ─────────────────────────────────────────────────────────────────── */
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

    // Pick up the 8 service cards (4 in row 1 + 4 in row 2).
    const row1 = root.querySelector(`.${styles.frameParent}`);
    const row2 = root.querySelector(`.${styles.frameParent5}`);
    const cards = [
      ...(row1 ? Array.from(row1.querySelectorAll(":scope > section")) : []),
      ...(row2 ? Array.from(row2.querySelectorAll(":scope > section")) : []),
    ];
    if (cards.length === 0) return;

    // Depth pattern — checkerboard so neighbouring cards have their own
    // tilt personality on hover (some shift more aggressively than others).
    const DEPTHS = [0.85, 1.15, 0.95, 1.05, 1.05, 0.95, 1.15, 0.85];

    cards.forEach((card, i) => {
      card.classList.add(styles.parallaxCard);
      card.style.setProperty("--depth", String(DEPTHS[i % DEPTHS.length]));
      card.style.setProperty("--stagger", String(i));
    });

    // ── IntersectionObserver: stagger fade-in on enter ──────────────
    if (!reduceMotion && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(styles.cardEntered);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      cards.forEach((c) => io.observe(c));
      root.__parallaxIo = io;
    } else {
      cards.forEach((c) => c.classList.add(styles.cardEntered));
    }

    if (reduceMotion) return undefined;

    // ── Per-card 3D tilt — the only live animation in the section ───
    const cardHandlers = [];
    if (!isCoarsePointer && !isMobile) {
      cards.forEach((card) => {
        let cardRaf = 0;
        let cx = 0;
        let cy = 0;
        const apply = () => {
          cardRaf = 0;
          card.style.setProperty("--ctx", cx.toFixed(4));
          card.style.setProperty("--cty", cy.toFixed(4));
        };
        const enter = () => {
          card.classList.add(styles.cardHover);
        };
        const move = (e) => {
          const rect = card.getBoundingClientRect();
          cx = (e.clientX - rect.left) / rect.width - 0.5;
          cy = (e.clientY - rect.top) / rect.height - 0.5;
          if (!cardRaf) cardRaf = requestAnimationFrame(apply);
        };
        const leave = () => {
          card.classList.remove(styles.cardHover);
          cx = 0;
          cy = 0;
          if (!cardRaf) cardRaf = requestAnimationFrame(apply);
        };
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        cardHandlers.push({ card, enter, move, leave });
      });
    }

    return () => {
      cardHandlers.forEach(({ card, enter, move, leave }) => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
      if (root.__parallaxIo) {
        root.__parallaxIo.disconnect();
        delete root.__parallaxIo;
      }
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={[styles.servicesTitleWrapper, className].join(" ")}
      data-testid="our-services-section"
    >
      <div className={styles.servicesTitle}>
        <div className={styles.ourServicesWrapper}>
          <AnimatedHeading as="h2" className={styles.ourServices} text={t.ourServices} />
        </div>
        <div className={styles.servicesCards}>
          <div className={styles.serviceDetailsColumn}>
            <div className={styles.frameParent}>
              <section className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <div className={styles.frameGroup}>
                  <div className={styles.frameContainer}>
                    {/* IMPORT icon — single combined SVG (globe + arrow).
                        Replaces the previous 6-part composition (4 globe
                        pieces + 2 arrow pieces) that suffered from
                        aspect-ratio + stroke-shrinkage problems. The new
                        SVG is natively drawn at 70×54 with stroke-width 2
                        everywhere, so the globe stays circular and the
                        arrow is rendered as a single clean → mark. */}
                    <img
                      className={styles.importIcon}
                      width={70}
                      height={54}
                      sizes="100vw"
                      alt=""
                      src="/figma/import-icon.svg"
                    />
                  </div>
                  <div className={styles.importWrapper}>
                    <h3 className={styles.import}>{t.import}</h3>
                  </div>
                </div>
                <div className={styles.weHelpYouFindTheRightCarWrapper}>
                  <div className={styles.weHelpYou}>
                    {t.importDesc}
                  </div>
                </div>
              </section>
              <section className={styles.rectangleGroup}>
                <div className={styles.frameItem} />
                <div className={styles.eUAdaptation}>
                  <img                     className={styles.vectorIcon}
                    width={52}
                    height={52}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector2.svg"
                  />
                  <img                     className={styles.vectorIcon8}
                    width={5}
                    height={5}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector2-dot-5.svg"
                  />
                  <img                     className={styles.vectorIcon9}
                    width={5}
                    height={5}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector2-dot-5.svg"
                  />
                  <img                     className={styles.vectorIcon10}
                    width={5}
                    height={5}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector2-dot-5.svg"
                  />
                  <img                     className={styles.vectorIcon11}
                    width={5}
                    height={5}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector2-dot-5.svg"
                  />
                  <img                     className={styles.vectorIcon12}
                    width={29.6}
                    height={29.4}
                    sizes="100vw"
                    alt=""
                    src="/figma/Vector7.svg"
                  />
                </div>
                <div className={styles.adaptationToEuropeanStandarParent}>
                  <h2 className={styles.adaptationToEuropean}>
                    {t.euAdaptation}
                  </h2>
                  <div className={styles.weAdaptThe}>
                    {t.euAdaptationDesc}
                  </div>
                </div>
              </section>
              <section className={styles.rectangleContainer}>
                <div className={styles.frameItem} />
                <div className={styles.frameDiv}>
                  <div className={styles.vectorContainer}>
                    <img                       className={styles.vectorIcon}
                      width={44}
                      height={56}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector8.svg"
                    />
                    <img                       className={styles.vectorIcon14}
                      width={28}
                      height={2}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector3.svg"
                    />
                    <img                       className={styles.vectorIcon15}
                      width={28}
                      height={2}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector3.svg"
                    />
                    <img                       className={styles.vectorIcon16}
                      width={20}
                      height={13}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector9.svg"
                    />
                  </div>
                  <div className={styles.vectorParent2}>
                    <img                       className={styles.vectorIcon17}
                      width={28}
                      height={28}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector2.svg"
                    />
                    <img                       className={styles.vectorIcon18}
                      width={14}
                      height={11}
                      sizes="100vw"
                      alt=""
                      src="/figma/Vector10.svg"
                    />
                  </div>
                </div>
                <h2 className={styles.registrationAndCertification}>
                  {t.registration}
                </h2>
                <div className={styles.weHandleFullRegistrationInWrapper}>
                  <div className={styles.weHelpYou}>
                    {t.registrationDesc}
                  </div>
                </div>
              </section>
              <section className={styles.frameSection}>
                <div className={styles.rectangleDiv} />
                <div className={styles.frameParent2}>
                  <div className={styles.frameParent3}>
                    <div className={styles.frameParent4}>
                      <div className={styles.vectorParent3}>
                        <img                           className={styles.vectorIcon19}
                          width={68}
                          height={46}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector11.svg"
                        />
                        <img                           className={styles.vectorIcon20}
                          width={68}
                          height={2}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector3.svg"
                        />
                      </div>
                      <img                         className={styles.vectorIcon21}
                        width={16}
                        height={16}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector2.svg"
                      />
                    </div>
                    <div className={styles.vectorParent4}>
                      <img                         className={styles.vectorIcon22}
                        width={68}
                        height={2}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector3.svg"
                      />
                      <div className={styles.frameWrapper2}>
                        <div className={styles.vectorParent5}>
                          <img                             className={styles.vectorIcon23}
                            width={2}
                            height={8}
                            sizes="100vw"
                            alt=""
                            src="/figma/Vector12.svg"
                          />
                          <img                             className={styles.vectorIcon24}
                            width={2}
                            height={8}
                            sizes="100vw"
                            alt=""
                            src="/figma/Vector12.svg"
                          />
                          <img                             className={styles.vectorIcon25}
                            width={2}
                            height={8}
                            sizes="100vw"
                            alt=""
                            src="/figma/Vector12.svg"
                          />
                        </div>
                      </div>
                      <div className={styles.vectorWrapper}>
                        <img                           className={styles.vectorIcon26}
                          width={64}
                          height={2}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector3.svg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.financingWrapper}>
                    <h3 className={styles.financing}>{t.financing}</h3>
                  </div>
                </div>
                <div className={styles.weConnectYouWithTbiBankAWrapper}>
                  <div className={styles.weHelpYou}>
                    {t.financingDesc}
                  </div>
                </div>
              </section>
            </div>
            <div className={styles.frameParent5}>
              <section className={styles.frameWrapper3}>
                <div className={styles.rectangleParent2}>
                  <div className={styles.rectangleDiv} />
                  <div className={styles.frameParent6}>
                    <div className={styles.vectorParent6}>
                      <img                         className={styles.vectorIcon27}
                        width={24}
                        height={24}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector2.svg"
                      />
                      <img                         className={styles.vectorIcon17}
                        width={36}
                        height={36}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector13.svg"
                      />
                    </div>
                    <div className={styles.vectorParent7}>
                      <img                         className={styles.vectorIcon29}
                        width={24}
                        height={22}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector14.svg"
                      />
                      <img                         className={styles.vectorIcon30}
                        width={24}
                        height={2}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector3.svg"
                      />
                      <img                         className={styles.vectorIcon31}
                        width={2}
                        height={8}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector12.svg"
                      />
                    </div>
                  </div>
                  <div className={styles.partsDetail}>
                    <div className={styles.partsSourcingAndDeliveryWrapper}>
                      <h2 className={styles.partsSourcingAnd}>
                        {t.partsSourcing}
                      </h2>
                    </div>
                    <div className={styles.weAdaptThe}>
                      {t.partsSourcingDesc}
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.rectangleParent3}>
                <div className={styles.rectangleDiv} />
                <div className={styles.frameParent7}>
                  <img className={styles.geminiSvg11}
                    loading="lazy"
                    width={85}
                    height={85}
                    sizes="100vw"
                    alt=""
                    src="/figma/gemini-svg-1-1.svg"
                  />
                  <div className={styles.serviceTitle}>
                    <h3 className={styles.financing}>{t.autoService}</h3>
                  </div>
                </div>
                <div className={styles.serviceDetails}>
                  <div className={styles.weHandleAll}>
                    {t.autoServiceDesc}
                  </div>
                </div>
              </section>
              <section className={styles.rectangleParent4}>
                <div className={styles.rectangleDiv} />
                <img                   className={styles.geminiSvg1Icon}
                  loading="lazy"
                  width={85}
                  height={85}
                  sizes="100vw"
                  alt=""
                  src="/figma/gemini-svg-1.svg"
                />
                <div className={styles.frameParent8}>
                  <div className={styles.detailingAndCleaningWrapper}>
                    <h2 className={styles.partsSourcingAnd}>
                      {t.detailing}
                    </h2>
                  </div>
                  <div className={styles.weProvideProfessional}>
                    {t.detailingDesc}
                  </div>
                </div>
              </section>
              <section className={styles.rectangleParent5}>
                <div className={styles.rectangleDiv} />
                <div className={styles.frameParent9}>
                  <div className={styles.frameParent10}>
                    <div className={styles.frameParent11}>
                      <div className={styles.vectorParent8}>
                        <img                           className={styles.vectorIcon}
                          width={51.8}
                          height={46.6}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector15.svg"
                        />
                        <img                           className={styles.vectorIcon33}
                          width={2}
                          height={15.5}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector16.svg"
                        />
                        <img                           className={styles.vectorIcon34}
                          width={2}
                          height={15.5}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector16.svg"
                        />
                        <img                           className={styles.vectorIcon35}
                          width={18.1}
                          height={2}
                          sizes="100vw"
                          alt=""
                          src="/figma/Vector3.svg"
                        />
                      </div>
                      <img                         className={styles.vectorIcon36}
                        width={41.4}
                        height={20.7}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector17.svg"
                      />
                      <img                         className={styles.vectorIcon37}
                        width={7.8}
                        height={7.8}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector2.svg"
                      />
                      <img                         className={styles.vectorIcon38}
                        width={7.8}
                        height={7.8}
                        sizes="100vw"
                        alt=""
                        src="/figma/Vector2.svg"
                      />
                    </div>
                    <div className={styles.homeDeliveryWrapper}>
                      <h3 className={styles.financing}>{t.homeDelivery}</h3>
                    </div>
                  </div>
                  <div className={styles.frameChild6} />
                </div>
                <div className={styles.weConnectYouWithTbiBankAWrapper}>
                  <div className={styles.weHelpYou}>
                    {t.homeDeliveryDesc}
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className={styles.contactButtonService}>
            <BUTTON1
              property1="Default"
              cONTACTUS={t.findACar}
              showBUTTON
              bUTTONBackgroundColor="#000"
              bUTTONWidth="459px"
              bUTTONBorder="none"
              bUTTONAlignSelf="unset"
              cONTACTUSColor="#feae00"
              cONTACTUSTextTransform="uppercase"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent25;
