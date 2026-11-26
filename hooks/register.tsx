import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.ts'

// The Longevix look: a cool gray, monochrome like the logo, in both modes.
const COLORS = makeColors({
  label: 'Longevix',
  roles: { accent: '#2b2f36', danger: '#c8413a', success: '#3f8a5c', warning: '#b7791f', pro: '#5b5bd6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eceef1',
        'surface-1': '#f4f5f7',
        'surface-2': '#fafbfc',
        'text-primary': '#111315',
        'text-secondary': '#3b4046',
        'text-muted': '#5b6168',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#121416',
        'surface-1': '#181a1d',
        'surface-2': '#1d2023',
        'surface-3': '#222528',
        'text-primary': '#f3f4f6',
        'text-secondary': '#c9cdd2',
        'text-muted': '#9aa0a7',
      },
    },
  },
})

const SCENE_NAME = 'longevix'

const LOOK: ThemeSetArgs = {
  colors: COLORS.theme,
  backdrop: { scene: SCENE_NAME, glass: { blur: 10, opacity: 0.6 } },
}

// Mirrors the stored on/off switch, kept between sessions in $.store.
const isOff = atom({ plugin: 'fondo-longevix', key: 'isOff' } as const, false)

// Themes are drawn by the desktop and mobile apps only; elsewhere, or on an
// older Claude Code without $.theme (a TypeError), the plugin stays quiet.
async function applyLook($: EngineInterface): Promise<void> {
  try {
    const unpainted = COLORS.problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await $.theme.set(LOOK)
  } catch (error) {
    if (!(error instanceof TypeError)) {
      $.ui.log(`fondo-longevix: no se pudo poner el fondo (${String(error)})`)
    }
  }
}

async function clearLook($: EngineInterface): Promise<void> {
  try {
    await $.theme.clear()
  } catch (error) {
    if (!(error instanceof TypeError)) {
      $.ui.log(`fondo-longevix: no se pudo sacar el fondo (${String(error)})`)
    }
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'longevix',
      description: 'Prende o apaga el fondo de Longevix',
    })

    const off = (await $.store.get('isOff')) === true
    await update($, isOff, () => off)
    if (!off) {
      await applyLook($)
    }

    return next(e)
  })

  // /longevix toggles the look and remembers the choice.
  on('command.run', { command: 'longevix' }, async $ => {
    const off = !(await read($, isOff))
    await $.store.set('isOff', off)
    await update($, isOff, () => off)

    if (off) {
      await clearLook($)
      return { text: 'Fondo de Longevix apagado. Escribí /longevix para volver a prenderlo.' }
    }

    await applyLook($)
    return { text: 'Fondo de Longevix prendido ∞' }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_NAME) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Logo de Longevix repetido en gris suave sobre una grilla de puntos" />
  })
}
