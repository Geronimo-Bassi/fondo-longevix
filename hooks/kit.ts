// Pixel-art kit for the fondos scenes.
//
// Desktop draws the backdrop under the whole window, and then covers it with
// the session list (left, ~280 px), any side panel (right, ~460 px) and the
// chat column (~770 px, centred between them). What is left in the worst case
// is two gutters about 200 px wide whose position moves with the panels, and a
// scene cannot know where they are. So a scene is built only from layers that
// look right however they are cropped:
//
//   bands     full-height colour bands (sky, paper)            crop-safe
//   wallpaper small motifs repeated on a staggered grid         crop-safe
//   strip     a band repeated sideways, pinned to top or bottom crop-safe
//
// and never from one big object placed at a fixed spot.

/** One cell of pixel art, in the scene's units. */
export type Cells = readonly string[]

/** Draws a map of letters as cells; '.' is empty and each letter is a CSS class. */
export const pixels = (map: Cells, x: number, y: number, size: number): string =>
  map
    .flatMap((row, r) =>
      [...row].map((c, k) =>
        c === '.' ? '' : `<rect class="${c}" x="${x + k * size}" y="${y + r * size}" width="${size}" height="${size}"/>`,
      ),
    )
    .join('')

/** The width and height a map takes at a cell size. */
export const sizeOf = (map: Cells, size: number): { w: number; h: number } => ({
  w: Math.max(...map.map(row => row.length)) * size,
  h: map.length * size,
})

/** A repeatable random source, so a scene comes out the same every time. */
export const random = (seed: number): (() => number) => {
  let s = seed
  return () => (s = (s * 9301 + 49297) % 233280) / 233280
}

/** Full-width horizontal bands, top to bottom, each a CSS class. */
export const bands = (classes: readonly string[]): string =>
  classes
    .map(
      (c, i) =>
        `<rect class="${c}" x="0" y="${((i * 100) / classes.length).toFixed(3)}%" width="100%" height="${(100 / classes.length + 0.4).toFixed(3)}%"/>`,
    )
    .join('')

/** The widest motif that always shows whole in a 200 px gutter on the default grid. */
export const MAX_MOTIF = 96

export type Motif = { svg: string; w: number }

/**
 * Small motifs repeated over the whole backdrop. Two rows per tile, the second
 * shifted half a column, so any gutter at least `column - MAX_MOTIF + 96`
 * wide shows at least one whole motif. Motifs over MAX_MOTIF wide throw, so a
 * scene that would be cut fails while it is being written.
 */
export const wallpaper = (
  id: string,
  motifs: readonly Motif[],
  { column = 240, row = 260, opacity = 1 }: { column?: number; row?: number; opacity?: number } = {},
): string => {
  for (const m of motifs) {
    if (m.w > MAX_MOTIF) {
      throw new Error(`wallpaper ${id}: a motif is ${m.w} px wide; keep it at ${MAX_MOTIF} or less`)
    }
  }
  const perRow = Math.max(1, Math.ceil(motifs.length / 2))
  const w = column * perRow
  const h = row * 2
  let tile = ''
  motifs.forEach((m, i) => {
    const second = i >= perRow
    const k = second ? i - perRow : i
    const x = k * column + (second ? column / 2 : 0) + (column / 2 - m.w) / 2
    const y = (second ? row : 0) + 24
    tile += `<g transform="translate(${x.toFixed(1)} ${y})">${m.svg}</g>`
  })
  return `<defs><pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${tile}</pattern></defs><rect width="100%" height="100%" fill="url(#${id})" opacity="${opacity}"/>`
}

/**
 * A band `height` px tall pinned to the top or bottom edge, its `tile`
 * repeated sideways forever (mountains, a horizon, a shelf). The tile is drawn
 * with y from 0 (the band's top) to `height`.
 */
export const strip = (id: string, edge: 'top' | 'bottom', height: number, width: number, tile: string): string => {
  const y = edge === 'top' ? 0 : -height
  return `<svg x="0" y="${edge === 'top' ? '0' : '100%'}" width="100%" height="1" overflow="visible"><defs><pattern id="${id}" width="${width}" height="${height}" y="${y}" patternUnits="userSpaceOnUse">${tile}</pattern></defs><rect x="0" y="${y}" width="100%" height="${height}" fill="url(#${id})"/></svg>`
}

/** The root of a scene: sized to the backdrop, crisp pixels, its own style. */
export const scene = (style: string, layers: readonly string[], size = 'width="100%" height="100%"'): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${size} shape-rendering="crispEdges">\n<style>\n${style}\n</style>\n${layers.join('\n')}\n</svg>`
