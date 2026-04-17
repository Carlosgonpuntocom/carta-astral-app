/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  postChat,
  AI_CHART_SYSTEM_PROMPT,
  AI_TRANSIT_SYSTEM_PROMPT,
  requestTransitDaySummary
} from '../../../renderer/lib/ai/ai-service-client'

describe('AI_CHART_SYSTEM_PROMPT', () => {
  it('exige ceñirse al JSON y no mezclar planetas ni inventar aspectos', () => {
    expect(AI_CHART_SYSTEM_PROMPT).toMatch(/ÚNICAMENTE el JSON/)
    expect(AI_CHART_SYSTEM_PROMPT).toMatch(/array "planetas"/)
    expect(AI_CHART_SYSTEM_PROMPT).toMatch(/array "aspectos"/)
    expect(AI_CHART_SYSTEM_PROMPT).toMatch(/Prohibido atribuir el signo/)
  })
})

describe('AI_TRANSIT_SYSTEM_PROMPT', () => {
  it('define tono práctico y límites sobre el JSON', () => {
    expect(AI_TRANSIT_SYSTEM_PROMPT).toMatch(/astrólogo práctico/)
    expect(AI_TRANSIT_SYSTEM_PROMPT).toMatch(/3-4 frases/)
    expect(AI_TRANSIT_SYSTEM_PROMPT).toMatch(/transitos_activos/)
    expect(AI_TRANSIT_SYSTEM_PROMPT).toMatch(/médicos, legales, financieros/)
  })
})

describe('requestTransitDaySummary', () => {
  const origFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = origFetch
    vi.restoreAllMocks()
  })

  it('POST /chat con system_prompt de tránsitos y cuerpo que incluye transitos_activos', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'ok',
        model: 'm',
        provider: 'ollama'
      })
    }) as unknown as typeof fetch

    const ctx = JSON.stringify({ transitos_activos: [], intensidad: { valor: 0 } })
    const out = await requestTransitDaySummary(ctx, { baseUrl: 'http://127.0.0.1:8100' })
    expect(out.response).toBe('ok')

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    const [, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit
    ]
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body as string) as {
      system_prompt: string
      messages: { role: string; content: string }[]
    }
    expect(body.system_prompt).toBe(AI_TRANSIT_SYSTEM_PROMPT)
    expect(body.messages[0].content).toContain('transitos_activos')
    expect(body.messages[0].content).toContain('Tránsitos y contexto del día')
  })
})

describe('postChat', () => {
  const origFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = origFetch
    vi.restoreAllMocks()
  })

  it('502: muestra el detail de ai-service sin anteponer otro "Error del proveedor de IA"', async () => {
    const detail = 'Error del proveedor de IA: HTTP Error 404: Not Found'
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ detail })
    }) as unknown as typeof fetch

    await expect(
      postChat({ messages: [{ role: 'user', content: 'hola' }] }, { baseUrl: 'http://127.0.0.1:8100' })
    ).rejects.toThrow(detail)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8100/chat',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('502 con detail vacío: mensaje genérico en español', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ detail: '   ' })
    }) as unknown as typeof fetch

    await expect(
      postChat({ messages: [{ role: 'user', content: 'hola' }] }, { baseUrl: 'http://127.0.0.1:8100' })
    ).rejects.toThrow(/proveedor de IA no respondió correctamente/)
  })
})
