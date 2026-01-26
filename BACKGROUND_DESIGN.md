# Ancient Forest Ceremonial Site - Background Design Document

## Overview
This document describes the layered background system for a 2D retro pixel-art platformer game. The background represents an ancient forest ceremonial site that once maintained balance between opposing forces.

**Resolution:** 1280x720 (16:9 aspect ratio)  
**Art Style:** 16-bit / SNES-era pixel art  
**Theme:** Ancient civilization, sacred purpose, nature reclaiming architecture, balance vs influence

---

## LAYER 1 — FAR BACKGROUND (Sky & Atmosphere)
**Depth:** -1000 to -800  
**Scroll Factor:** 0 (static)  
**Purpose:** Depth and mood only

### Visual Description
- **Sky Gradient:**
  - Top: Dark blue-green (#1a3d2e) - represents deep forest canopy
  - Middle: Medium blue-green (#2d5016) - atmospheric transition
  - Horizon: Lighter blue-green (#3d6b1f) - misty ground level
  - Smooth vertical gradient transition

- **Fog/Mist Effect:**
  - Subtle horizontal bands of semi-transparent white/green near ground (y: 400-500)
  - Alpha: 0.15-0.25
  - Creates depth without obscuring gameplay

- **Spiritual Motes/Fireflies:**
  - 15-20 small glowing particles scattered across sky
  - Colors: Pale yellow (#FFE5B4), pale green (#B8E6B8), pale cyan (#B8E6E6)
  - Size: 2-3 pixels
  - Alpha: 0.4-0.6
  - Position: Random distribution, more concentrated near horizon
  - Animation hook: Gentle floating motion (vertical oscillation)

### Technical Specifications
- Full width: 1280px
- Height: ~300px (top portion of screen)
- No hard edges or sharp contrast
- Very low saturation
- Must not interfere with gameplay readability

---

## LAYER 2 — MID-BACKGROUND (Ancient Temple Ruins — PRIMARY VISUAL)
**Depth:** -200 to -50  
**Scroll Factor:** 0.1 (subtle parallax)  
**Purpose:** Most important visual element - tells the story

### Temple Structure Overview
- **Position:** Centered horizontally (x: 640), base at y: 400 (ground level)
- **Dimensions:** ~600px wide, ~380px tall
- **Style:** Monumental but faded, partially obscured by nature

### Architectural Elements

#### Base Platform (Bottom Section)
- **Height:** ~60px
- **Color:** Weathered stone gray with green tint (#6B5B4D base, #5A4B3D shadows)
- **Features:**
  - Large cracked stone blocks (visible seams)
  - Some blocks shifted/sunken
  - Moss growing in cracks (#2d5016, #1a3d0a)
  - Small plants emerging from gaps

#### Main Temple Body (Middle Section)
- **Height:** ~200px
- **Structure:**
  - Central stepped pyramid structure (3-4 tiers)
  - Symmetrical design (balance theme)
  - Each tier narrower than the one below
  - Visible wear: cracks, missing sections, collapsed corners

- **Stone Blocks:**
  - Base color: #6B5B4D (weathered gray-green)
  - Shadow: #4A3E35 (darker)
  - Highlight: #8B7A6B (lighter, very subtle)
  - Individual blocks: 40-60px wide, visible mortar lines

- **Carvings & Symbols:**
  - **Geometric Patterns:**
    - Triangles (pointing up/down) - balance symbol
    - Circles with inner patterns - unity symbol
    - Parallel lines - connection symbol
    - Interlocking shapes - harmony symbol
  - **Color:** Faded gold (#D4AF37) with very low opacity (0.3-0.4)
  - **Style:** Abstract, ritualistic, no literal depictions
  - **Placement:** On temple tiers, pillars, and base blocks

#### Pillars (Left & Right Sides)
- **Count:** 2-3 on each side
- **Height:** ~150-200px
- **Width:** ~30-40px
- **Condition:**
  - Some intact, some broken (top third missing)
  - Visible cracks
  - Vines wrapping around (#1a3d0a, #2d5016)
  - Moss patches

#### Temple Top/Peak
- **Height:** ~120px
- **Structure:**
  - Partially collapsed
  - Missing roof sections
  - Broken stone blocks visible
  - Tree growing through one side

### Nature Reclaiming Elements

#### Vines
- **Color:** Dark green (#1a3d0a) with lighter highlights (#2d5016)
- **Pattern:**
  - Thick vines wrapping pillars (2-3 per pillar)
  - Vines climbing temple walls
  - Some hanging down from broken sections
- **Style:** Pixel-art, 4-6px wide, organic curves

#### Moss
- **Color:** Various greens (#2d5016, #1a3d0a, #3d6b1f)
- **Placement:**
  - In stone cracks
  - On horizontal surfaces
  - At base of pillars
- **Pattern:** Small irregular patches, 8-16px clusters

#### Tree Roots
- **Color:** Dark brown (#4A2E1A) with green tint
- **Placement:**
  - Breaking through masonry at base
  - Visible through cracks
  - Lifting some stone blocks
- **Style:** Thick, organic, 6-10px wide

#### Small Plants
- **Types:**
  - Ferns near base (#2d5016, #3d6b1f)
  - Small bushes (#1a3d0a)
  - Grass tufts (#3d6b1f)
- **Placement:** On ledges, in cracks, at temple base
- **Size:** 8-20px tall

### Color Palette Summary
- **Stone Base:** #6B5B4D (weathered gray-green)
- **Stone Shadow:** #4A3E35 (dark)
- **Stone Highlight:** #8B7A6B (subtle light)
- **Moss Green:** #2d5016, #1a3d0a, #3d6b1f
- **Vine Green:** #1a3d0a, #2d5016
- **Faded Gold (carvings):** #D4AF37 (low opacity)
- **Root Brown:** #4A2E1A

### Animation Hooks
- Subtle glow on carvings (pulse effect, very slow)
- Vine sway (gentle, 2-3px horizontal movement)
- Moss particles (tiny green specks, very subtle)

---

## LAYER 3 — NEAR BACKGROUND (Framing Elements)
**Depth:** -30 to -10  
**Scroll Factor:** 0.3 (more noticeable parallax)  
**Purpose:** Enclose the arena, create sacred space feeling

### Left Side Elements
- **Hanging Vines:**
  - 3-4 long vines hanging from top
  - Position: x: 50-150
  - Length: 200-300px
  - Color: #1a3d0a, #2d5016
  - Style: Thick, pixel-art, with leaves

- **Tree Trunk (Partial):**
  - Visible on far left edge
  - Width: ~80-100px
  - Height: ~400px (extends beyond screen)
  - Color: Dark brown (#4A2E1A) with bark texture
  - Visible roots at bottom

- **Broken Stone Slab:**
  - Embedded in ground near left edge
  - Size: ~60x40px
  - Tilted/fallen appearance
  - Moss and small plants on it

### Right Side Elements
- **Hanging Vines:**
  - Mirror of left side
  - Position: x: 1130-1230
  - Same style and color

- **Tree Trunk (Partial):**
  - Visible on far right edge
  - Same specifications as left

- **Broken Stone Slab:**
  - Embedded in ground near right edge
  - Similar to left side

### Bottom Framing
- **Ferns & Bushes:**
  - Position: Near ground level (y: 380-420)
  - Scattered across bottom
  - More dense on edges, sparse in center
  - Colors: #2d5016, #1a3d0a, #3d6b1f
  - Size: 20-40px tall

- **Jungle Foliage:**
  - Large leaves overlapping
  - Position: Bottom 100px
  - Creates depth without blocking gameplay
  - Colors: Various dark greens

### Top Framing
- **Canopy Leaves:**
  - Sparse, hanging from top
  - Position: Top 50px
  - Creates overhead enclosure feeling
  - Very subtle, doesn't block sky

### Visual Rules
- **No Center Clutter:** Keep center play area (x: 400-880) relatively clear
- **Edge Focus:** Most framing elements on outer 200px of screen
- **Low Contrast:** Elements blend with background, don't compete with gameplay
- **Organic Shapes:** All elements feel natural, not geometric

---

## PARALLAX SCROLLING SPECIFICATIONS

### Scroll Factors
- **Layer 1 (Far Background):** 0 (static)
- **Layer 2 (Temple):** 0.1 (very subtle movement)
- **Layer 3 (Framing):** 0.3 (noticeable but not distracting)

### Implementation Notes
- Parallax creates depth when camera moves
- All layers move slower than foreground gameplay elements
- Maintains sense of ancient, stable structure

---

## COLOR PALETTE REFERENCE

### Sky & Atmosphere
- Deep Canopy: #1a3d2e
- Atmospheric: #2d5016
- Misty Horizon: #3d6b1f

### Stone & Architecture
- Weathered Stone: #6B5B4D
- Stone Shadow: #4A3E35
- Stone Highlight: #8B7A6B
- Faded Gold: #D4AF37 (low opacity)

### Nature Elements
- Dark Green (vines/moss): #1a3d0a
- Medium Green (moss/plants): #2d5016
- Light Green (highlights): #3d6b1f
- Brown (roots/wood): #4A2E1A

### Particles & Effects
- Firefly Yellow: #FFE5B4
- Firefly Green: #B8E6B8
- Firefly Cyan: #B8E6E6

---

## ANIMATION SPECIFICATIONS

### Layer 1 (Sky)
- **Fireflies/Motes:**
  - Vertical oscillation: ±5px
  - Speed: 0.5-1.0 pixels per second
  - Alpha pulse: 0.4-0.6
  - Duration: 3-5 seconds per cycle

### Layer 2 (Temple)
- **Carvings Glow:**
  - Very subtle pulse
  - Alpha: 0.3-0.5
  - Duration: 4-6 seconds per cycle
  - Only on gold carvings

- **Vine Sway:**
  - Horizontal movement: ±2-3px
  - Speed: 0.3-0.5 pixels per second
  - Organic, wave-like motion

### Layer 3 (Framing)
- **Hanging Vines:**
  - Gentle sway: ±3-5px
  - Speed: 0.4-0.6 pixels per second
  - Independent timing per vine

---

## NARRATIVE FUNCTION

### Visual Storytelling
1. **Ancient Civilization:** Temple structure shows past grandeur
2. **Sacred Purpose:** Geometric carvings suggest ritual significance
3. **Nature Reclaiming:** Vines, moss, roots show time passing
4. **Balance Theme:** Symmetrical design, opposing elements
5. **Unstable Energy:** Broken sections, partial collapse suggest fragility

### Player Influence
- Background should subtly respond to player actions
- Temple carvings could glow brighter when balance is achieved
- Nature elements could shift based on influence levels
- Maintains sense that player actions affect the sacred site

---

## TECHNICAL IMPLEMENTATION NOTES

### Pixel Art Guidelines
- All elements use pixel-perfect rendering
- No anti-aliasing
- Nearest-neighbor filtering
- Hard edges, no gradients (except sky)
- Color palette limited to specified colors

### Performance Considerations
- Background layers are static textures (pre-rendered)
- Animation handled via Phaser tweens
- Parallax via scroll factors (GPU-accelerated)
- Particle effects kept minimal

### Gameplay Integration
- Background never obscures interactive elements
- Contrast maintained for readability
- Center area kept clear for gameplay
- Framing elements guide player attention

---

## ASSET CREATION GUIDELINES

### Texture Sizes
- **Layer 1 (Sky):** 1280x300px
- **Layer 2 (Temple):** 600x380px (centered)
- **Layer 3 (Framing):** Multiple smaller textures (vines: 32x200px, etc.)

### Pixel Density
- Maintain 1:1 pixel ratio
- No scaling artifacts
- Crisp, clean edges

### Export Format
- Canvas-based textures (Phaser.Textures.createCanvas)
- Refresh after drawing
- Set filter to NEAREST

---

## SUMMARY

This background design creates a layered, atmospheric environment that:
- ✅ Supports gameplay visually and technically
- ✅ Communicates ancient, sacred, forgotten themes
- ✅ Shows nature reclaiming civilization
- ✅ Maintains balance and instability themes
- ✅ Uses authentic 16-bit pixel art style
- ✅ Provides depth through parallax
- ✅ Never interferes with gameplay readability

The three-layer system creates depth, the temple tells the story, and the framing elements create a sacred, enclosed space perfect for a ceremonial site where balance is contested.
