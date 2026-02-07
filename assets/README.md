# HabitCue Logo Assets

This folder contains SVG logo files for the HabitCue app, based on the design specifications from the `Logo.tsx` component.

## Logo Files

### 1. logo-icon-only.svg
- **Size**: 512x512px (high quality for app icons)
- **Usage**: App icon, favicon, social media profile pictures
- **Features**:
  - Rounded square container (28% border radius)
  - Purple-to-darker-purple gradient background (#7c3aed to #6d28d9)
  - Pink overlay with 30% opacity (#ec4899) rotated 45°
  - White track-changes icon (circular target with curved arrows)
  - Purple glow shadow effect

### 2. logo-with-text.svg
- **Size**: 600x160px (proper aspect ratio for horizontal layouts)
- **Usage**: Website header, splash screens, promotional materials
- **Features**:
  - Icon (120x120px) on the left with same styling as icon-only version
  - "HabitCue" text on the right with 24px gap
  - "Habit" in dark gray (#1a1a1a)
  - "Cue" in purple (#7c3aed)
  - Bold font (800 weight) with -1.6px letter spacing

### 3. logo-text-only.svg
- **Size**: 400x100px
- **Usage**: Situations where only text is needed (small spaces, text-heavy layouts)
- **Features**:
  - "Habit" in dark gray/black (#1a1a1a)
  - "Cue" in purple (#7c3aed)
  - Bold font (Inter, 800 weight)
  - 80px font size with -2px letter spacing

## Design Specifications

### Colors
- **Primary Purple**: #7c3aed
- **Darker Purple**: #6d28d9 (for gradient)
- **Pink Accent**: #ec4899 (30% opacity overlay)
- **Pink Darker**: #db2777 (for gradient)
- **Dark Text**: #1a1a1a
- **White**: #ffffff (for icon)

### Typography
- **Font**: Inter (fallback: system sans-serif)
- **Weight**: 800 (Extra Bold)
- **Letter Spacing**: Negative (-0.5 to -2px for tight, modern look)

### Icon Design
The track-changes icon represents:
- Circular target with concentric circles
- Curved arrows indicating change and progress
- Rotation arrows showing continuous improvement
- Clean, modern aesthetic matching Material Icons design

## Usage Guidelines

1. **Scaling**: All SVGs use viewBox for perfect scaling at any size
2. **Colors**: Can be easily modified by changing the hex values in the SVG
3. **Backgrounds**: Test on both light and dark backgrounds
4. **Formats**: These SVGs can be converted to PNG/JPG using any SVG converter if raster formats are needed

## Technical Details

- **Format**: SVG (Scalable Vector Graphics)
- **Encoding**: UTF-8
- **Gradients**: Linear gradients defined in `<defs>` section
- **Filters**: SVG filters for shadow effects
- **Text**: Web fonts (Inter) with fallbacks to system fonts

## Attribution

Designed based on the HabitCue app's visual identity as defined in `src/components/Logo.tsx`.
