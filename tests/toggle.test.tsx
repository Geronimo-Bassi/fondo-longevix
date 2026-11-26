import { expect, mock, test } from 'claude-code/testing'

test('/longevix turns the look off and back on, and remembers it', async ($, on) => {
  mock.store(on)
  // The log the theme calls write to, which the kit has no stand-in for.
  on('ui.log', () => ({ value: {} }) as never)

  const off = await $.command.run({ command: 'longevix', args: '' } as never)
  expect(JSON.stringify(off)).toContain('apagado')

  const back = await $.command.run({ command: 'longevix', args: '' } as never)
  expect(JSON.stringify(back)).toContain('prendido')
})
