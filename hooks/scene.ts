// Longevix: the person's own company mark on a quiet gray, light and dark.
// The infinity mark and a small lockup (mark over the wordmark) repeat as a
// muted wallpaper over a fine dot grid, so whole ones show in whatever gutter
// Desktop leaves visible. Redrawn by hand as strokes from the person's logo.
// Nothing animates.

import { scene, wallpaper } from './kit.ts'
import type { Motif } from './kit.ts'

// The mark, one stroke in a 270 x 130 box: two rounded loops joined by
// diagonals, with the two gaps of the original.
const MARK_PATH =
  'M120 85 L80 125 H20 Q5 125 5 110 V20 Q5 5 20 5 H75 L195 125 H250 Q265 125 265 110 V20 Q265 5 250 5 H195 L155 45'

// The wordmark's letters, each in a 110 x 130 box.
const LETTERS: readonly string[] = [
  'M10 0 V110 Q10 125 25 125 H105', // L
  'M48 130 V117 A56 56 0 1 1 72 117 V130', // O, open at the foot
  'M10 130 V8 L100 122 V0', // N
  'M105 5 H25 Q10 5 10 20 V110 Q10 125 25 125 H90 Q105 125 105 110 V72', // G
  'M105 5 H25 Q10 5 10 20 V110 Q10 125 25 125 H105 M42 65 H92', // E
  'M5 0 L55 125 L105 0', // V
  'M55 0 V130', // I
  'M5 0 L105 130 M105 0 L66 50 M44 78 L5 130', // X, its second stroke broken
]

const ADVANCE = 150
const WORD_W = (LETTERS.length - 1) * ADVANCE + 110

const word = (): string =>
  LETTERS.map((d, i) => `<path transform="translate(${i * ADVANCE} 0)" d="${d}"/>`).join('')

// The mark alone, 90 px wide.
const MARK: Motif = {
  w: 90,
  svg: `<g class="m" transform="scale(${(90 / 270).toFixed(4)})"><path d="${MARK_PATH}"/></g>`,
}

// The mark over the wordmark, 96 px wide.
const LOCKUP: Motif = (() => {
  const w = 96
  const markW = 44
  const markS = markW / 270
  const wordS = w / WORD_W
  const markH = 130 * markS
  return {
    w,
    svg: [
      `<g class="m" transform="translate(${((w - markW) / 2).toFixed(1)} 0) scale(${markS.toFixed(4)})"><path d="${MARK_PATH}"/></g>`,
      `<g class="m wm" transform="translate(0 ${(markH + 10).toFixed(1)}) scale(${wordS.toFixed(4)})">${word()}</g>`,
    ].join(''),
  }
})()

const STYLE = `
.bg { fill: #eceef1 }
.dot { fill: #dde1e6 }
.m { fill: none; stroke: #cdd2d8; stroke-width: 14; stroke-linejoin: round; shape-rendering: geometricPrecision }
.wm { stroke-width: 20 }
@media (prefers-color-scheme: dark) {
  .bg { fill: #141619 }
  .dot { fill: #1f2226 }
  .m { stroke: #2b2f34 }
}`

export const sceneSvg = (size?: string): string =>
  scene(
    STYLE,
    [
      '<rect class="bg" width="100%" height="100%"/>',
      '<defs><pattern id="longevix-dots" width="24" height="24" patternUnits="userSpaceOnUse"><rect class="dot" x="11" y="11" width="2" height="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#longevix-dots)"/>',
      wallpaper('longevix-marks', [MARK, LOCKUP], { column: 220, row: 200 }),
    ],
    size,
  )

export const SCENE = sceneSvg()
