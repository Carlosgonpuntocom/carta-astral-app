import { describe, it, expect } from 'vitest'
import { getInterpretation } from '../../../renderer/lib/astrology/interpretations'

describe('getInterpretation', () => {
  it('añade capa «Día a día» a entradas del diccionario', () => {
    const s = getInterpretation('Mercurio', 'square', 'Mercurio')
    expect(s).toContain('Malentendidos')
    expect(s).toMatch(/día a día|dia a dia/i)
    expect(s).toContain('mensajes')
  })

  it('añade capa cotidiana al fallback genérico', () => {
    const s = getInterpretation('Neptuno', 'square', 'Júpiter')
    expect(s).toContain('Neptuno')
    expect(s).toMatch(/día a día|dia a dia/i)
  })

  it('no duplica si el texto ya menciona día a día', () => {
    const s = getInterpretation('Sol', 'trine', 'Sol')
    const count = (s.match(/día a día/gi) ?? []).length
    expect(count).toBeLessThanOrEqual(1)
  })
})
