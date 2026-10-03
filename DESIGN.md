---
name: "ImageKit"
description: "A local image studio with photographic layers and precise export controls."
colors:
  accent: "#edf500"
  accent-ink: "#171b09"
  bg: "#17191b"
  panel: "#1b1e20"
  fg: "#f2f2e9"
  muted: "#b5b9bb"
  line: "#373c3e"
  field: "#191c1d"
  focus: "#e5f34c"
  error: "#ffb4ab"
  field-border: "#474d50"
  light-accent: "#d6e631"
  light-bg: "#f0f0e9"
  light-panel: "#e8e9e1"
  light-fg: "#1a1d1e"
  light-muted: "#535952"
  light-line: "#babfb5"
  light-field: "#f7f7f2"
  light-focus: "#566500"
  light-error: "#ad2525"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  brand:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  control:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  action:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 600
rounded:
  control: "8px"
  segment: "7px"
  toast: "10px"
  drop-target: "12px"
  dialog: "16px"
  round: "50%"
spacing:
  control-gap: "12px"
  compact: "8px"
  small: "16px"
  medium: "20px"
  mobile-inset: "22px"
  large: "24px"
  rail-inset: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    width: "100%"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.control}"
    padding: "8px 20px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "4px 12px"
  button-round:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.round}"
    width: "44px"
    height: "44px"
  field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.fg}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "49px"
    width: "100%"
  view-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.segment}"
    padding: "10px 20px"
  format-option:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "14px 4px"
  format-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "14px 4px"
  navigation:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    height: "58px"
  dialog:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    rounded: "{rounded.dialog}"
    padding: "26px"
    width: "calc(100% - 36px)"
---

# Design System: ImageKit

## Overview

**Creative North Star: "Layer studio"**

ImageKit is a quiet photographic workspace. Large, tangible image sheets give the work visual priority; compact, clearly labeled controls provide the precision. Graphite surfaces and warm-white type support the dark studio, while a warm paper theme retains the same hierarchy in bright surroundings.

Depth belongs chiefly to the image itself. The surrounding interface is flat, divided by fine rules, with softly rounded controls and restrained acid-yellow feedback. Space Grotesk and Manrope are the collection's established, self-hosted type pairing. Movement is a small, optional part of inspecting the layers, and the flat editor remains directly operable with pointer or keyboard.

**Key Characteristics:**
- Photographic layers with visible edges, crop geometry and clear captions.
- Quiet neutral surfaces with acid yellow reserved for action and selection.
- Broad display type paired with compact, readable interface text.
- A spacious image workspace beside a precise settings rail; a single editing sequence on small screens.
- Theme-aware focus treatment, native controls and optional layer motion.

## Colors

The palette combines near-neutral graphite or warm paper with a single electric yellow accent. The frontmatter records effective colors after the stylesheet cascade, rather than superseded declarations.

### Primary

- **Acid Yellow** (`accent`): download action, selected preview mode, selected export format, native slider and checkbox accents, and crop framing.
- **Acid Ink** (`accent-ink`): readable text and icons on the yellow action surface; shared by both themes.
- **Light Acid** (`light-accent`): the slightly subdued action and selection yellow in the paper theme.
- **Focus Yellow / Focus Olive** (`focus`, `light-focus`): keyboard outlines and link hover color. The dark focus yellow intentionally differs from the final action yellow. The 3D canvas crop uses `accent` in both themes.

### Neutral

- **Graphite Ground / Warm Paper** (`bg`, `light-bg`): page, studio and dialog backgrounds.
- **Graphite Panel / Paper Panel** (`panel`, `light-panel`): unselected export-format surfaces.
- **Warm White / Graphite Ink** (`fg`, `light-fg`): headings, input contents and primary interface text.
- **Quiet Gray / Olive Gray** (`muted`, `light-muted`): labels, supporting copy, metadata and secondary actions.
- **Graphite Rule / Paper Rule** (`line`, `light-line`): the header, rail, footer and control separators.
- **Recessed Field / Paper Field** (`field`, `light-field`): input and select backgrounds. `field-border` is the shared field stroke in both themes.
- **Error Salmon / Error Red** (`error`, `light-error`): actionable validation text.

**The Functional Accent Rule.** Use yellow to identify a current choice, crop boundary or actionable control; keep large interface surfaces neutral.

## Typography

**Display Font:** Space Grotesk, with sans-serif fallback. The bundled variable face supports weights 300–700.

**Body Font:** Manrope, with sans-serif fallback. The bundled variable face supports weights 200–800.

**Character:** Wide, compactly tracked display lettering gives the studio a confident identity. Manrope keeps small labels and values calm and legible. Both fonts are pinned collection choices.

### Hierarchy

- **Display:** `display` is the main studio heading. It steps down at narrower viewport widths; see Layout.
- **Headline:** `headline` is the settings title. `title` is the lighter dialog heading.
- **Brand:** `brand` is the compact wordmark.
- **Lead:** `lead` is the single-line introduction beneath the desktop heading.
- **Body:** `body` describes help-dialog prose; it uses generous line height inside the bounded dialog, rather than setting every interface element to this size.
- **Label / Control:** `label` describes field and section labels; `control` covers navigation, format choices, preview/reset actions and image metadata.
- **Action:** `action` provides the download button's stronger weight.

Supporting details use 11–13px text where space is constrained. Dimensions, quality and file metadata use tabular numerals. Interface labels use normal sentence case; format acronyms remain uppercase where appropriate.

**The Two Voices Rule.** Use Space Grotesk for identity and headings, and Manrope for controls, values and explanatory text.

## Layout

The desktop studio fills the available width and has a minimum height of the small viewport height minus its 58px header. At widths of at least 1400px, the workspace and settings rail occupy 72.135% and 27.865%. The rail has a thin left separator. Its default content inset is 35px top, 32px horizontally and 22px bottom.

The workspace uses four rows: introduction (128px), image stage (at least 500px), controls (96px) and metadata (78px). At viewport heights of at least 950px and widths of at least 1100px, the stage minimum becomes 664px, subject to the narrower-width overrides below. The image stage has asymmetric horizontal breathing room. Desktop live rendering ends 40px above the stage bottom, leaving clear ground for captions. The captions follow Original, Crop, Export in that order.

### Responsive behavior

| Range | Implemented behavior |
| --- | --- |
| 1100–1399px | A flexible workspace beside a fixed 350px rail; heading 46px, lead 17px, settings title 29px; rail horizontal inset 26px. Workspace rows: 124px / at least 480px / 96px / 78px. |
| 900–1099px | Heading 40px and lead 15px; preview switch moves below the introduction at the upper right. Workspace rows: 150px / at least 440px / 100px / 78px. |
| Up to 899px | Single column: introduction, image editor, crop controls, metadata, then export settings. Header 64px; heading 40px, lead 14px, settings title 28px. Workspace rows: 140px / 400px / 104px / 62px. Content inset 22px; dimension fields retain two columns with a 16px gap. Inputs become 48px tall with 16px text. |
| Up to 389px | Heading 35px, lead 13px, image stage 340px and controls row 108px. Header inset tightens to 14px; attribution can wrap without a divider. |

The body supports a minimum width of 320px. On initial load below 900px, the editor opens in 2D; users can explicitly choose 3D. Opening a new local image also selects 2D. The desktop header centers its navigation, while mobile retains the help action and uses an icon-only open-image button. The viewport threshold controls layout; resizing does not itself reset an already chosen editing mode.

Spacing is practical rather than a rigid mathematical scale: recurring 8px, 12px, 16px, 20px and 24px gaps organize controls, with larger rail and page insets. Keep labels attached to their controls and preserve the reading order when stacking regions.

## Elevation & Depth

The interface is flat at rest: fields and separators create structure without card shadows. Image layers provide the main depth through perspective, thin translucent backs, pale edges and bounded soft ground shadows. The crop plane face is partially transparent (opacity 0.86). The live renderer fits both image dimensions proportionally; perspective can foreshorten the image, but the underlying plane must retain its aspect ratio.

### Shadow Vocabulary

- **Notification lift:** `0 8px 30px #0003`, reserved for the floating status toast.
- **Dialog lift:** `0 25px 100px #0007`, with a `#0009` backdrop and 5px backdrop blur.
- **Crop exclusion:** `0 0 0 100vmax #0007`, clipped by the flat image wrapper to darken the area outside the crop.
- **Photographic ground shadow:** a Canvas radial texture from `rgba(0,0,0,.4)` to transparent, bounded under each sheet; shadow material opacity is 0.65 in dark mode and 0.32 in light mode.

**The Image Depth Rule.** Keep everyday controls flat; use spatial depth for the image sheets and temporary overlays.

## Shapes

Most buttons, inputs and selects use the `control` radius; the inset view-switch segments use `segment`. Circular 44px buttons control layer motion. The toast, drop target and dialog each have their own progressively softer radius. Thin one-pixel borders define controls and structural divisions.

Photographic sheets and crop frames remain rectangular. The flat crop has four solid square handles (9px) and a thirds grid. The 3D crop uses a fine frame plus four stronger corner brackets and a thirds grid. In the 768 × 1024 texture, the frame is 3px, bracket stroke 8px, and bracket arms are capped at 30px or one fifth of the available crop dimensions. These are texture-space values, not fixed on-screen CSS sizes.

## Components

### Buttons

Clear hierarchy keeps the image workflow easy to scan. The primary download button spans its container, has a minimum height of 54px, uses the action typography and pairs a download icon with text. The secondary open-image button has a fine neutral outline, a 40px minimum height and compact padding. Preview and reset actions use muted text on transparent backgrounds. Motion buttons are circular; the theme control is a transparent 40px square.

Enabled buttons brighten on hover with `brightness(1.12)`. Disabled buttons have opacity 0.48 and a not-allowed cursor. Buttons, links, inputs and selects transition background, border and text colors over 180ms with `ease`. There is no added press animation. Keyboard focus uses a 2px theme focus outline, normally offset by 4px; fields use a 3px offset.

### Segmented choices

The 2D/3D switch is a single outlined enclosure with an acid-yellow active segment. Its desktop width is 144px, becoming 116px on compact desktop and 104px on mobile. The selected view has weight 600. Export-format choices are separate equal-width buttons with 7px gaps; selection uses the same accent/ink pairing. Both communicate state with `aria-pressed`. These are choices, rather than decorative tags.

### Inputs / Fields

Labels sit above full-width recessed fields. Name and crop-ratio fields span the rail; width and height form a two-column row. Number values use tabular numerals. The proportion checkbox uses the native accent-colored control at 22px square. Sliders retain native browser tracks and accent-colored thumbs; quality includes a separate right-aligned numeric output. PNG disables quality and labels it Lossless. Errors appear inline in the theme error color with `role="alert"`.

### Navigation

The wordmark anchors the left of the header. Desktop Studio and How it works sit centrally; the active Studio item has a 2px accent underline. Theme and file actions align right. Navigation is muted at rest, and the current item uses foreground ink. Keep icon-only actions named for assistive technology. A skip link appears on keyboard focus and leads directly to export settings.

### Containers and overlays

The settings rail is an open bordered region, without a raised card shell. Dialogs use the page surface, a neutral border, the dialog radius, 26px padding, a maximum width of 680px and a maximum height of 90svh. Preview imagery fits within 50svh. Native modal behavior and focus restoration keep the workflow anchored. Status toasts invert foreground and background colors and provide a named dismiss button. The file-drop overlay uses a dashed 2px accent border.

### Image workspace

Three live sheets show the original, its crop and the current export. All derive from the same image; the crop and output reflect the actual settings. Captions occupy clear ground below the images. The flat editor fits the source without stretching, exposes crop handles and a thirds grid, and supports dragging plus keyboard arrows; Shift increases the movement step. Crop zoom and horizontal/vertical controls remain visible below the image.

Layer movement is a restrained oscillation around the vertical axis, with an amplitude of 0.014 radians and a 0.004 phase increment per render step. The renderer throttles normal updates at a 34ms interval and avoids drawing when hidden or outside the viewport. Rotate advances through five 0.06-radian positions. Pause is explicit. Reduced-motion preference initializes the scene paused and disables CSS transitions; a user may choose to play. A 650ms desktop delay defers live 3D initialization, and unavailable 3D falls back to the flat editor.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned Space Grotesk and Manrope pairing.
- **Do** use theme variables for interface surfaces, ink, actions and focus states.
- **Do** keep crop geometry and export proportions faithful to the current image.
- **Do** leave clear ground below image planes for their captions.
- **Do** keep the primary export action visually distinct from secondary controls.
- **Do** preserve visible keyboard focus, native control semantics and the reduced-motion pause default.
- **Do** reflow the workspace and settings into a readable editing sequence on small screens.

### Don't:

- **Don't** stretch image previews to fill a predetermined plane shape.
- **Don't** place plane captions over the photograph.
- **Don't** turn flat settings controls into raised decorative cards.
- **Don't** replace functional crop marks with a baked photographic imitation.
- **Don't** make motion a prerequisite for editing an image.
