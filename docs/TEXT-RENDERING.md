# Consistent text rendering

Montserrat is loaded through `useBrandFont` in the registered root. Every render worker waits for the bundled variable font before capturing frames; a font loading error fails the render rather than using fallback glyphs.

The shared text and information layer no longer has a continuous fractional scale transform. Background camera movement and engineering animations remain. The collection-channel panel now accommodates its complete heading.

Dialogue subtitle overlays are removed from Scenes 1–6. The composition remains 1920 × 1080, 25 fps, 2250 frames, without voiceover.

Validation: TypeScript check, six-scene checkpoint rendering, cold-browser engineering-label checks, and a fresh complete film render.

The left-hand sidebars now use the corresponding passages from the revised voiceover script. Previous sidebar progress descriptions, travel-time bars, load formula panel and sustainability assessment table have been removed. Engineering overlays and the approved takeoff remain.

Structural engineering callouts now use a single clipped HTML panel for text and background, inside the same engineering camera container. SVG carries only the engineering paths, preventing SVG text from separating from its panel. The closing tagline uses normal spacing and Montserrat weights 700 / 500 / 400 for Engineering / Sustainable / Futures.
