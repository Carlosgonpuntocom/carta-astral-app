import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getAiServiceBaseUrl,
  checkAiServiceHealth,
  postChat,
  requestChartSummary,
  AI_CHART_SYSTEM_PROMPT
} from '../../../renderer/lib/ai/ai-service-client'

describe('ai-service-client', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('getAiServiceBaseUrl recorta barra final', () => {
    expect(getAiServiceBaseUrl({ baseUrl: 'http://127.0.0.1:8100/' })).toBe('http://127.0.0.1:8100')
  })

  it('checkAiServiceHealth devuelve ok cuando /health responde 200', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', provider: 'ollama', model: 'llama3' })
    }) as unknown as typeof fetch

    const r = await checkAiServiceHealth({ baseUrl: 'http://test.local:9999' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.model).toBe('llama3')
    }
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://test.local:9999/health',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
  })

  it('postChat envía POST /chat con JSON y devuelve respuesta', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 'Hola',
        model: 'm',
        provider: 'ollama'
      })
    }) as unknown as typeof fetch

    const out = await postChat(
      { messages: [{ role: 'user', content: 'x' }] },
      { baseUrl: 'http://api.test', chatTimeoutMs: 30_000 }
    )
    expect(out.response).toBe('Hola')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://api.test/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'x' }] })
      })
    )
  })

  it('postChat lanza error claro en 503', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({ detail: 'sin modelo' })
    }) as unknown as typeof fetch

    await expect(
      postChat({ messages: [{ role: 'user', content: 'a' }] }, { baseUrl: 'http://h' })
    ).rejects.toThrow(/no está disponible/)
  })

  it('postChat en timeout lanza mensaje en español', async () => {
    vi.useFakeTimers()
    globalThis.fetch = vi.fn().mockImplementation(
      (_url, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          const s = init?.signal
          if (s) {
            s.addEventListener('abort', () => {
              const err = new Error('Aborted')
              err.name = 'AbortError'
              reject(err)
            })
          }
        })
    ) as unknown as typeof fetch

    const p = postChat({ messages: [{ role: 'user', content: 'a' }] }, {
      baseUrl: 'http://h',
      chatTimeoutMs: 100
    })
    vi.advanceTimersByTime(200)
    try {
      await p
      expect.fail('debía rechazar por timeout')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect((e as Error).message).toMatch(/superó el tiempo de espera/)
    }
    vi.useRealTimers()
  })

  it('requestChartSummary incluye pregunta en el cuerpo del mensaje', async () => {
    const calls: string[] = []
    globalThis.fetch = vi.fn().mockImplementation((_url, init?: RequestInit) => {
      calls.push((init?.body as string) ?? '')
      return Promise.resolve({
        ok: true,
        json: async () => ({ response: 'r', model: 'm', provider: 'p' })
      })
    }) as unknown as typeof fetch

    await requestChartSummary('{"a":1}', '¿Sol?', { baseUrl: 'http://x' })
    const body = JSON.parse(calls[0]!) as {
      messages: { content: string }[]
      system_prompt: string
    }
    expect(body.system_prompt).toBe(AI_CHART_SYSTEM_PROMPT)
    expect(body.messages[0].content).toContain('¿Sol?')
    expect(body.messages[0].content).toContain('{"a":1}')
  })
})
