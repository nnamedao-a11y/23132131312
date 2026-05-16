{
  "open_questions": [
    {
      "id": "oq-share-icon",
      "question": "На эталонном скриншоте в правом верхнем углу визуально читаются только 2 иконки (compare + favorite). В текущем JSX уже есть 3 (share + compare + favorite). Нужен вердикт: оставляем share (как сейчас в JSX) или удаляем из карточки для 1:1 со скриншотом?",
      "impact": "Если share убрать — потребуется minor правка JSX (удалить кнопку share и связанные обработчики/ShareModal вызов). Если оставить — нужно привести стили так, чтобы визуально совпадало с Фигмой (но это будет расходиться со скриншотом)."
    },
    {
      "id": "oq-card-bg",
      "question": "Точный hex фона карточки на скриншоте: сейчас в CSS стоит #1A1B19, а в public-theme токен card = #1D1D1B. Подтвердите, какой из них является эталоном Фигмы (или дайте точный hex).",
      "impact": "Фон карточки — ключевой surface; нельзя угадывать."
    },
    {
      "id": "oq-sold-overlay",
      "question": "Sold overlay: на скриншоте выглядит как затемнение + белый круг с галочкой и текстом. В текущем CSS реализовано затемнение + белая обводка круга (без белой заливки). Подтвердите: круг должен быть залит белым или только обводка?",
      "impact": "Нужно 1:1 совпадение Sold-бейджа."
    },
    {
      "id": "oq-sold-price-color",
      "question": "В Sold-варианте на скриншоте значения Sold Price/Sold Date выглядят серыми (muted). Подтвердите: должны ли они быть серыми (#B0B0B0) как сейчас в CSS (priceMuted/dateMuted), или оставаться жёлтыми как в active?",
      "impact": "Это влияет на визуальную иерархию Sold-состояния."
    }
  ],

  "design_intent": {
    "component": "VehicleCardRow",
    "scope": "Точное воспроизведение по эталонному скриншоту (active + sold) без редизайна.",
    "tech": {
      "framework": "React (JSX)",
      "styling": "CSS Modules (VehicleCardRow.module.css)",
      "no_media_queries": true,
      "fluid_scaling": "Только clamp()/относительные единицы для диапазона viewport 1280→1920.",
      "font": "Mazzard H (семейство Mazzard уже подключено в src/index.css)"
    }
  },

  "viewport_scaling": {
    "range": {
      "min_viewport_px": 1280,
      "max_viewport_px": 1920
    },
    "rule": "Все размеры, которые должны плавно масштабироваться, задаём через clamp(min, fluid, max). Для fluid используем vw-значения, подобранные так, чтобы при 1920 получалось max, а при 1280 — min.",
    "note": "Пользователь запретил @media. Поэтому даже 'desktop-only' делаем fluid в пределах 1280–1920."
  },

  "tokens": {
    "css_custom_properties": {
      "location": "/app/frontend/src/components/public/catalog/VehicleCardRow.module.css (вверху файла, :root не трогаем)",
      "naming": "--vcr-*",
      "colors": {
        "--vcr-card-bg": "#1A1B19",
        "--vcr-card-outline-hover": "#FEAE00",
        "--vcr-text-primary": "#FFFFFF",
        "--vcr-text-muted": "#B0B0B0",
        "--vcr-accent": "#FEAE00",
        "--vcr-cta-bg": "#FEAE00",
        "--vcr-cta-text": "#18181B",
        "--vcr-image-bg": "#0F0F0F",
        "--vcr-sold-overlay": "rgba(0,0,0,0.55)",
        "--vcr-sold-white": "#FFFFFF"
      },
      "radii": {
        "--vcr-card-radius": "0px",
        "--vcr-cta-radius": "4px",
        "--vcr-action-radius": "9999px"
      },
      "sizes_1920": {
        "--vcr-card-max-w": "1263px",
        "--vcr-card-h": "467px",
        "--vcr-pad-y": "40px",
        "--vcr-pad-x": "24px",
        "--vcr-gap-image-info": "24px",
        "--vcr-image-w": "518px",
        "--vcr-image-h": "387px",
        "--vcr-title-to-ids": "16px",
        "--vcr-lot-to-vin": "12px",
        "--vcr-ids-to-body": "24px",
        "--vcr-action-size": "32px",
        "--vcr-action-gap": "16px",
        "--vcr-copy-icon": "16px",
        "--vcr-cta-w": "327px",
        "--vcr-cta-h": "45px"
      },
      "typography": {
        "--vcr-font-family": "'Mazzard H', 'Mazzard', system-ui, -apple-system, sans-serif",
        "--vcr-title-size": "24px",
        "--vcr-title-weight": "700",
        "--vcr-meta-size": "14px",
        "--vcr-meta-weight": "400",
        "--vcr-label-size": "14px",
        "--vcr-label-weight": "500",
        "--vcr-value-size": "14px",
        "--vcr-value-weight": "700",
        "--vcr-price-size": "20px",
        "--vcr-price-weight": "700",
        "--vcr-cta-size": "14px",
        "--vcr-cta-weight": "500",
        "--vcr-letterspacing-cta": "0.02em"
      },
      "fluid_clamps": {
        "note": "min-значения ниже — технические, чтобы карточка адекватно сжималась на 1280. Если у вас есть точные min из Фигмы для 1280 — замените.",
        "--vcr-card-min-h": "330px",
        "--vcr-image-min-w": "280px",
        "--vcr-image-min-h": "210px",
        "--vcr-card-h-clamp": "clamp(var(--vcr-card-min-h), 24.3vw, var(--vcr-card-h))",
        "--vcr-image-w-clamp": "clamp(var(--vcr-image-min-w), 27vw, var(--vcr-image-w))",
        "--vcr-image-h-clamp": "clamp(var(--vcr-image-min-h), 20.16vw, var(--vcr-image-h))",
        "--vcr-spec-col-gap": "clamp(16px, 2vw, 40px)",
        "--vcr-price-col-gap": "clamp(12px, 1.04vw, 20px)"
      }
    }
  },

  "layout_blueprint": {
    "outer_card": {
      "element": "article.card",
      "display": "flex",
      "direction": "row",
      "align": "stretch",
      "gap": "var(--vcr-gap-image-info)",
      "padding": "var(--vcr-pad-y) var(--vcr-pad-x)",
      "width_behavior": "width:100%; max-width:1263px; min-height: clamp(...)",
      "radius": "0px",
      "hover": "outline 1px solid var(--vcr-card-outline-hover) (без transition: all)"
    },
    "left_image": {
      "element": "div.imageWrap > img.image",
      "size": "width: clamp(...518px); height: clamp(...387px)",
      "fit": "object-fit: cover",
      "overflow": "hidden",
      "sold_variant": {
        "overlay": "div.soldOverlay (position:absolute; inset:0; background rgba(0,0,0,0.55))",
        "badge": {
          "check_circle": {
            "element": "div.soldCheck",
            "size": "72×72",
            "shape": "circle",
            "style": "border:2px solid #fff; svg 32×32; color #fff"
          },
          "title": "div.soldTitle: 'SOLD' uppercase, 32px, weight 700, letter-spacing 0.05em",
          "subtitle": "div.soldSub: 'this vehicle has been sold', 14px, weight 400"
        }
      }
    },
    "right_info": {
      "element": "div.info",
      "display": "flex",
      "direction": "column",
      "vertical_distribution": "justify-content: space-between (чтобы CTA прижимался вниз без фиксированных 100px)"
    },
    "top_group": {
      "element": "div.topGroup",
      "contains": ["div.topRow", "div.identifiers"],
      "topRow": {
        "layout": "flex; justify-content: space-between; align-items:flex-start",
        "left": "h3.title",
        "right": "div.actionIcons"
      },
      "action_icons": {
        "button_size": "32×32",
        "gap": "16px",
        "icons": "img.actionIcon 32×32 from /single-car/*.svg",
        "states": {
          "active": "actionBtnActive adds drop-shadow amber",
          "disabled_sold": "opacity .35 + grayscale/brightness filter"
        }
      },
      "identifiers": {
        "margin_top": "16px (это и есть расстояние Title→LOT)",
        "gap": "12px (LOT→VIN)",
        "typography": "14px regular, color muted",
        "copy": "button.copy with /figma/catalog/icon-copy.svg 16×16"
      }
    },
    "body_specs_and_price": {
      "element": "div.body > div.dataRow",
      "body_padding": "24px 0 (это и есть VIN→характеристики)",
      "dataRow": "flex; justify-content: space-between; gap: clamp(16px,2vw,40px)",
      "specBlock": {
        "layout": "CSS grid 2 columns: label/value pairs stacked as rows",
        "grid": "grid-template-columns: max-content max-content; column-gap: clamp(16px,2vw,40px)",
        "rows": [
          "Mileage / value",
          "Engine / value",
          "Drive / value",
          "Damage / value",
          "Condition / value",
          "Auction / value"
        ],
        "label_style": "14px weight 500 white",
        "value_style": "14px weight 700 uppercase, color accent (#FEAE00)"
      },
      "priceBlock": {
        "layout": "CSS grid 2 columns: label/value for 2 rows",
        "grid": "grid-template-columns: max-content max-content; column-gap: clamp(12px,1.04vw,20px)",
        "row1": "Current Rate/Sold Price + value",
        "row2": "Auction Date/Sold Date + value",
        "value_styles": {
          "active": "priceValue 20px accent; dateValue 14px accent",
          "sold": "priceMuted/dateMuted => muted gray"
        }
      }
    },
    "cta": {
      "element": "div.ctaRow > button.cta",
      "size": "327×45",
      "radius": "4px",
      "typography": "14px weight 500 uppercase, letter-spacing 0.02em",
      "colors": "bg #FEAE00, text #18181B",
      "sold_variant": "По требованиям пользователя CTA отсутствует и заменяется правой колонкой Sold Price/Sold Date. В текущем JSX CTA рендерится всегда (меняется текст). Нужно: скрывать CTA при isSold (minor JSX change) — иначе не 1:1."
    }
  },

  "required_jsx_adjustments": {
    "allowed": "Только minor правки, не ломая существующую структуру/handlers.",
    "must_for_1to1": [
      {
        "change": "CTA: не рендерить .ctaRow вообще при isSold",
        "reason": "На скриншоте Sold-вариант без кнопки; справа только Sold Price/Sold Date."
      }
    ],
    "conditional": [
      {
        "change": "Share icon: удалить кнопку share (и ShareModal) если подтвердится, что на Фигме её нет",
        "reason": "Скриншот визуально показывает 2 иконки."
      }
    ]
  },

  "data_testid_requirements": {
    "already_present_in_jsx": [
      "article[data-testid=vehicle-card-*]",
      "button[data-testid=vehicle-share-*]",
      "button[data-testid=vehicle-compare-*]",
      "button[data-testid=vehicle-favorite-*]",
      "button[data-testid=vehicle-cta-*]"
    ],
    "missing_should_add": [
      {
        "element": "LOT copy button",
        "suggested": "data-testid=vehicle-lot-copy-button-<vin-or-id>"
      },
      {
        "element": "VIN copy button",
        "suggested": "data-testid=vehicle-vin-copy-button-<vin-or-id>"
      },
      {
        "element": "Price value",
        "suggested": "data-testid=vehicle-price-value-<vin-or-id>"
      },
      {
        "element": "Date value",
        "suggested": "data-testid=vehicle-date-value-<vin-or-id>"
      }
    ]
  },

  "component_path": {
    "jsx": "/app/frontend/src/components/public/catalog/VehicleCardRow.jsx",
    "css_module": "/app/frontend/src/components/public/catalog/VehicleCardRow.module.css",
    "icons": {
      "share": "/app/frontend/public/single-car/share-icon.svg",
      "compare": "/app/frontend/public/single-car/compare-icon.svg",
      "favorite": "/app/frontend/public/single-car/favorite-icon.svg",
      "copy": "/app/frontend/public/figma/catalog/icon-copy.svg"
    }
  },

  "instructions_to_main_agent": [
    "НЕ менять дизайн/логику произвольно. Только привести к 1:1 со скриншотом и числовыми ограничениями пользователя.",
    "Перевести все magic numbers в VehicleCardRow.module.css в CSS-переменные --vcr-* и использовать их в правилах.",
    "Соблюсти: card radius 0px, CTA radius 4px, padding 40/24, gaps 16/12/24, action icons 32px + gap 16.",
    "Сделать fluid scaling 1280→1920 без @media: размеры карточки/изображения/гепы/колон-гепы через clamp().",
    "Sold-вариант: затемнение изображения + бейдж SOLD; action-иконки в disabled gray; CTA не рендерить.",
    "Добавить недостающие data-testid на copy-кнопки и ключевые значения (price/date).",
    "НЕ использовать transition: all. Только точечные transition (opacity/outline/background-color/transform)."
  ],

  "appendix_general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
