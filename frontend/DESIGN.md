---
name: Eco-Minimalist Intelligence
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4944'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6f7973'
  outline-variant: '#bec9c2'
  surface-tint: '#1b6b51'
  primary: '#004532'
  on-primary: '#ffffff'
  primary-container: '#065f46'
  on-primary-container: '#8bd6b7'
  inverse-primary: '#8bd6b6'
  secondary: '#006d3e'
  on-secondary: '#ffffff'
  secondary-container: '#8cf5b2'
  on-secondary-container: '#007241'
  tertiary: '#333f39'
  on-tertiary: '#ffffff'
  tertiary-container: '#4a564f'
  on-tertiary-container: '#becac2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f2d1'
  primary-fixed-dim: '#8bd6b6'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#8ff8b4'
  secondary-fixed-dim: '#73db9a'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522d'
  tertiary-fixed: '#d9e6dd'
  tertiary-fixed-dim: '#bdcac1'
  on-tertiary-fixed: '#131e19'
  on-tertiary-fixed-variant: '#3e4943'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is rooted in the intersection of environmental stewardship and high-performance technology. It is designed for eco-conscious professionals and organizations who require sophisticated data analysis without the visual clutter typical of enterprise software.

The aesthetic follows a **Modern Minimalist** approach with **High-Contrast** accents. It prioritizes clarity and breathability, utilizing expansive white space to reduce cognitive load. The emotional response should be one of calm authority—positioning the product as a reliable guide in the complex landscape of sustainability. Elements are rendered with surgical precision, utilizing soft environmental cues to ground the digital experience in the physical world.

## Colors

The palette is anchored by "Emerald Carbon," a deep, authoritative green used for primary actions and brand presence. This is balanced by "Living Sage," a vibrant mid-tone green used for success states and secondary highlights.

- **Primary (Emerald Carbon):** Used for primary buttons, active navigation states, and key data visualizations.
- **Secondary (Living Sage):** Used for supportive elements, progress bars, and positive trend indicators.
- **Surface (Clean White):** The primary background color to ensure maximum readability and a sense of "air."
- **Text (Slate Shadow):** A near-black blue-gray that provides high contrast while remaining softer on the eyes than pure black.
- **Background (Pale Mint):** An extremely light green tint used to differentiate content sections without breaking the minimalist flow.

## Typography

This design system utilizes a tiered typographic approach to separate brand expression from functional utility.

1.  **Manrope (Headlines):** A modern, geometric sans-serif that balances technological precision with organic warmth. It is used for all major headings to establish a confident, contemporary voice.
2.  **Inter (Body):** Selected for its exceptional legibility and neutral tone. It handles the bulk of the information density, ensuring that complex environmental data is easily digestible.
3.  **JetBrains Mono (Data & Labels):** A monospaced font used sparingly for data points, metric labels, and technical identifiers to emphasize the "AI" and "Step" (precision/tracking) aspects of the brand.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop and a **Fluid Grid** for mobile. 

- **Desktop:** A 12-column grid centered within a 1280px container. Large "air pockets" (48px - 80px) are used between major sections to emphasize the minimalist aesthetic.
- **Mobile:** A 4-column fluid grid with 16px side margins.
- **Vertical Rhythm:** Built on a 4px baseline. All components should have heights and internal padding that are multiples of 4.

Spacing is used intentionally to group related data. High-density information (like data tables) uses `sm` spacing, while high-level overview cards use `lg` padding to feel more premium and accessible.

## Elevation & Depth

The design system avoids heavy shadows in favor of **Tonal Layers** and **Ambient Depth**. 

- **Level 0 (Base):** The primary background (`#FFFFFF` or `#F0FDF4`).
- **Level 1 (Cards):** Subtly raised using a very soft, diffused shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a "hovering" effect without looking heavy.
- **Level 2 (Modals/Popovers):** Higher elevation with a slightly more pronounced shadow and a 1px border in a pale green-gray to define edges against the white background.
- **Active States:** Instead of deep shadows, active states are often indicated by a slight shift in background tone or a 2px solid stroke in the primary color.

## Shapes

The shape language is defined by **Soft Geometric** forms. 

Standard components (buttons, input fields) use a 0.5rem (8px) corner radius. This is large enough to feel approachable and "natural," but small enough to maintain a professional, structured appearance. Cards and larger containers scale up to a 1rem (16px) radius to emphasize their role as distinct content "buckets."

Interactive elements should never be sharp-edged, but should avoid becoming fully circular unless they are true circular icons or status pips.

## Components

- **Buttons:** Primary buttons are solid "Emerald Carbon" with white text. Secondary buttons use a ghost style with a 1px "Emerald Carbon" border. Tertiary buttons are text-only with a subtle underline on hover.
- **Input Fields:** Use a subtle light-gray background with no border in their default state. Upon focus, they transition to a white background with a 2px "Emerald Carbon" border.
- **Chips:** Used for category tags (e.g., "Renewable," "Offset"). They use the "Tertiary" light green background with "Primary" green text. Corners are fully rounded (pill-shaped).
- **Cards:** Cards are the primary container. They must have 24px internal padding and a subtle Level 1 shadow.
- **Progress Indicators:** Linear bars use the "Secondary" Living Sage for the fill and a very pale version of the same hue for the track, avoiding gray to keep the "eco" theme consistent.
- **Data Visualization:** Charts should use a palette of greens, teals, and slate-blues. Avoid red for anything other than critical errors; use shades of amber for warnings to maintain the earthy, calm tone.