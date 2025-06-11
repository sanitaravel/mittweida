# Low-Fidelity Wireframes: Mittweida Classic Explorer (65+)

- [Low-Fidelity Wireframes: Mittweida Classic Explorer (65+)](#low-fidelity-wireframes-mittweida-classic-explorer-65)
  - [Wireframes](#wireframes)
    - [1. Welcome \& Onboarding Screen](#1-welcome--onboarding-screen)
    - [2. Route Selection Screen](#2-route-selection-screen)
    - [3. Guided Tour Screen](#3-guided-tour-screen)
      - [3a. Attraction Detail (Story View)](#3a-attraction-detail-story-view)
    - [4. Completion \& Travel Journal Screen](#4-completion--travel-journal-screen)
    - [5. Create Your Own Tour Screen](#5-create-your-own-tour-screen)
    - [6. Settings Screen](#6-settings-screen)
  - [🎨 Moodboard Concept](#-moodboard-concept)
    - [🎯 Visual Identity Goal](#-visual-identity-goal)
    - [🎨 Color Palette](#-color-palette)
    - [🖋 Typography](#-typography)
    - [🖼 Imagery Style](#-imagery-style)
    - [🧩 UI Elements](#-ui-elements)
    - [🎧 Sound](#-sound)

## Wireframes

### 1. Welcome & Onboarding Screen

```text
+-----------------------------------------+
| [Logo] Mittweida Classic Explorer       | <- Top center, 20% of screen height
| [Icon: Settings]                        | <- Top right corner
|                                         |
| Welcome to Mittweida.                   | <- Center screen, large text
| Let's explore at your pace.             | <- Below welcome, slightly smaller
|                                         |
| What would you like to do?              | <- 60% down the screen
|                                         |
| [Button: Select a Suggested Route]      | <- Bottom third, full width
| [Button: Create Your Own Tour]          | <- Bottom of screen, full width
+-----------------------------------------+
```

**Key elements:**

- Large title and subtitle
- Settings icon
- Two clear options: suggested or custom tour

**Placement Notes:**

- Logo and title at top 20% of screen for immediate brand recognition
- Main buttons in bottom third for easy thumb reach
- 24pt minimum font size for readability
- Buttons should be at least 60px tall for easy tapping

### 2. Route Selection Screen

```text
+-----------------------------------------+
| [Map View with Highlighted Routes]      | <- Occupies top 60% of screen
| [Button: Filter]                        | <- Top right corner of map
|  • Your Location (blue dot)             |
|  • Route A (green line)                 |
|     • Stop points marked 1–5            |
|  • Route B (orange line)                |
|     • Stop points marked A–D            |
|-----------------------------------------|
| • Tap on a route line to see details:   | <- Bottom 40% of screen
|   Short Historical Walk (30 min)        | <- Card view with 20px padding
|   • 5 stops, benches along the way      |
|                                         |
| • Tap on other route to see:            |
|   Church & Park Stroll (45 min)         |
|   • 4 stops, cafés nearby               |
|                                         |
| [Button: Continue]                      | <- Bottom of screen, full width
| [Button: Back]                          | <- Bottom of screen, full width
+-----------------------------------------+
```

**Key elements:**

- Interactive map with overlays
- Tap-enabled routes showing names, durations, features
- Clear call to action button
- Filter button for customizing routes

**Placement Notes:**

- Map view dominates top portion for spatial orientation
- Information cards slide up from bottom when routes are selected
- Continue button fixed at bottom with 80px height for prominence
- Filter button positioned in upper right for quick access

### 3. Guided Tour Screen

```text
+-----------------------------------------+
| [Map View – Fullscreen]                 | <- Covers 100% of screen area
| [Button: Filter]                        | <- Top right corner
|  • Blue dot: you                        | <- Dynamic positioning based on GPS
|  • Numbered pins for each stop          | <- Distributed across map
|                                         |
| --> When arriving at a stop:            |
|     [Popup Card Appears]                | <- Slides up from bottom, covers 30% of screen
|     ----------------------------------  |
|     | St. Afra Church                   | <- Card title, left-aligned
|     | [Photo Thumbnail]                 | <- Right side of card, 40% of card width
|     | [Button: Explore This Stop]       | <- Bottom of card, full card width
|     ----------------------------------  |
|                                         |
+-----------------------------------------+
```

**Key elements:**

- Always fullscreen map view
- Location-aware pins
- Popup cards when near a stop with photo and CTA
- "Explore This Stop" opens...

**Placement Notes:**

- Map always remains visible for context
- Pop-up notification cards slide up from bottom, not obscuring current position
- Button placement at bottom of card for easy thumb access
- Cards should have 16px minimum padding on all sides

#### 3a. Attraction Detail (Story View)

```text
+-----------------------------------------+
| [Story Carousel Mode]                   | <- Fullscreen takeover
|-----------------------------------------|
| [Photo 1: Exterior view]                | <- Top 60% of screen
| Text: "Built in the 14th century..."    | <- Bottom 30% of screen
| [Audio Narration ON/OFF]                | <- Bottom right corner
|                                         |
| [Next] [Back]                           | <- Sides of screen, centered vertically
|-----------------------------------------|
| [Exit Story]                            | <- Bottom center of screen
+-----------------------------------------+
```

**Key elements:**

- Instagram Story-style fullscreen carousel
- Photo + short text captions per slide
- Optional narration
- Easy nav and exit

**Placement Notes:**

- Photos positioned in top portion for easy viewing
- Text in lower third with high contrast background for readability
- Exit button always visible at bottom center
- Navigation arrows on sides at comfortable thumb height (center vertical)
- Audio controls in corner but large enough (min 48px) for easy targeting

```text
+---------------------------------------------+
| \[Map View]                                 | <- Top 50% of screen
| \[Button: Filter]                           | <- Top right corner
|  • Blue dot: you                            |
| • Numbered pins for each stop               |
| ------------------------------------------- |
| Stop 1: St. Afra Church                     | <- Bottom 50% of screen
| • Description text (large font)             | <- Card view with scrollable content
| • \[Play Audio] \[Photo]                    | <- Side by side buttons
| • Accessibility: bench nearby               | <- Bottom of information card
|                                             |
| \[Button: Next Stop] \[Button: Pause Tour]  | <- Fixed at bottom of screen
| +-----------------------------------------+ |
```

**Key elements:**

- Map + current location
- Stop info card with text, audio, image, rest info
- Navigation buttons: Next, Pause
- Filter access for preferences

**Placement Notes:**

- Split screen design with map on top half and information below
- Information card has fixed header but scrollable content area
- Action buttons fixed at bottom of screen for consistent placement
- Media control buttons positioned side-by-side in the middle of the card

### 4. Completion & Travel Journal Screen

```text
+-----------------------------------------+
| Congratulations!                        | <- Top third of screen, centered
| You completed the tour:                 |
| • 5 stops, 30 min                       |
|                                         |
| \[Your Travel Journal]                  | <- Middle third, full width section
|  • PDF icon  • Email icon  • Print icon | <- Evenly spaced icons in a row
|                                         |
| \[Button: Restart Tour] \[Button: Exit] | <- Bottom third, side by side
+-----------------------------------------+
```

**Key elements:**

- Summary message
- Access to saved journal (download/email/print)
- Options to restart or exit

**Placement Notes:**

- Celebratory message at top with ample white space
- Action icons centered in middle section with equal spacing
- Bottom buttons positioned for easy access, side by side with equal width
- All elements center-aligned for formal, balanced appearance

---

### 5. Create Your Own Tour Screen

```text
+--------------------------------------- +
| Create Your Own Tour                   | <- Top header, full width
| \[Button: Filter]                      | <- Top right under header
| -------------------------------------- |
| \[Map View]                            | <- Top 40% of screen
| • Tap to add locations                 |
| • Your Location (blue dot)             |
| • Available spots marked with pins     |
|                                        |
| \[List of Attractions with Checkboxes] | <- Bottom 60% of screen, scrollable
| \[ ] St. Afra Church                   | <- List items with left-aligned checkboxes
| \[ ] Mittweida Castle                  |
| \[ ] Town Park                         |
| \[ ] Local Café "Kaffeestube"          |
| \[ ] Textile Museum                    |
|                                        |
| \[Button: Preview Route]               | <- Bottom left, 45% width
| \[Button: Start Tour]                  | <- Bottom right, 45% width
+----------------------------------------+
```

**Key elements:**

- Interactive map with tap-to-select functionality
- Checklist of attractions
- Ability to preview custom route
- Filter button for category-based choices

**Placement Notes:**

- Map contained in top portion for context while selecting
- Scrollable list dominates screen for easy selection
- Checkboxes positioned on left for traditional form experience
- Action buttons fixed at bottom with equal prominence
- 16px minimum spacing between list items for easy selection

---

### 6. Settings Screen

```text
+---------------------------------------------+
| Settings                                    | <- Top header, full width
| ------------------------------------------- |
| Text Size:                                  | <- Each section takes ~20% of screen height
| • \[Small]  \[Medium]  \[Large]             | <- Button group, evenly spaced
|                                             |
| Enable Audio Narration:                     |
| • \[Toggle ON/OFF]                          | <- Right-aligned toggle
|                                             |
| High Contrast Mode:                         |
| • \[Toggle ON/OFF]                          | <- Right-aligned toggle
|                                             |
| Language:                                   |
| • \[Dropdown: English, German, etc.]        | <- Full width dropdown
|                                             |
| \[Button: Save Settings]                    | <- Bottom of screen, full width
| \[Button: Back]                             | <- Above Save button, full width
+---------------------------------------------+ 
```

**Key elements:**

- Adjustable text size
- Audio narration toggle
- High contrast mode for visibility
- Language selection
- Save and return options

**Placement Notes:**

- Settings organized in clearly separated vertical sections
- Labels on left, controls on right for traditional settings layout
- Back button positioned above Save to prevent accidental data loss
- Each interactive element has minimum 60px touch target height
- 24px spacing between settings groups for clear visual separation

---

## 🎨 Moodboard Concept

### 🎯 Visual Identity Goal

Create a mood that feels:

- **Timeless** (to match historical depth)
- **Comforting & Clear** (to serve older users)
- **Subtly Elegant** (for credibility and trust)

### 🎨 Color Palette

- **Warm Neutrals**: sandstone, beige, soft cream (backgrounds)
- **Muted Accents**: sage green, dusty blue, terracotta (highlights)
- **High Contrast Text**: charcoal/dark brown on light backgrounds

### 🖋 Typography

- **Headings**: Classic serif (e.g. Playfair Display, Cormorant Garamond)
- **Body text**: Clean sans-serif (e.g. Noto Sans, Inter, or Open Sans)
- Large, well-spaced text; WCAG-compliant contrast

### 🖼 Imagery Style

- **Historical photo overlays** (sepia tone or faded edges)
- **Illustrated line drawings** of architecture or landmarks
- **Clean map visuals** (like hand-drawn maps or subtle textures)

### 🧩 UI Elements

- Rounded, soft-corner buttons
- Large, friendly icons (with text labels)
- Smooth fade-in transitions, no fast animations
- Card-style layouts for each section (e.g. info cards at tour stops)

### 🎧 Sound

- Optional soft ambient background sound at start (birds, town square ambience)
- Calm voiceover for audio narration
