/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from 'vitest'
import {
  healthCheckUrl,
  resolveAiServiceBaseUrl,
  resolveAiServiceStartScript,
  resolveServicesRoot,
  shouldAutoStartAiService,
  checkAiServiceHealth
} from '../../main/ensure-ai-service'

describe('ensure-ai-service', () => {
  it('resolveAiServiceBaseUrl usa default sin env', () => {
    const prev = process.env.AI_SERVICE_URL
    delete process.env.AI_SERVICE_URL
    expect(resolveAiServiceBaseUrl()).toBe('http://127.0.0.1:8100')
    process.env.AI_SERVICE_URL = prev
  })

  it('resolveAiServiceBaseUrl quita barra final', () => {
    const prev = process.env.AI_SERVICE_URL
    process.env.AI_SERVICE_URL = 'http://localhost:8100/'
    expect(resolveAiServiceBaseUrl()).toBe('http://localhost:8100')
    process.env.AI_SERVICE_URL = prev
  })

  it('healthCheckUrl', () => {
    expect(healthCheckUrl('http://127.0.0.1:8100')).toBe('http://127.0.0.1:8100/health')
  })

  it('shouldAutoStartAiService respeta 0 y false', () => {
    const prev = process.env.AUTO_START_AI_SERVICE
    process.env.AUTO_START_AI_SERVICE = '0'
    expect(shouldAutoStartAiService()).toBe(false)
    process.env.AUTO_START_AI_SERVICE = 'false'
    expect(shouldAutoStartAiService()).toBe(false)
    process.env.AUTO_START_AI_SERVICE = prev
  })

  it('resolveServicesRoot en win32 por defecto', () => {
    const prev = process.env.SERVICES_ROOT
    delete process.env.SERVICES_ROOT
    const orig = process.platform
    Object.defineProperty(process, 'platform', { value: 'win32' })
    expect(resolveServicesRoot()).toMatch(/services$/i)
    Object.defineProperty(process, 'platform', { value: orig })
    process.env.SERVICES_ROOT = prev
  })

  it('resolveAiServiceStartScript en Windows', () => {
    const p = resolveAiServiceStartScript('D:\\services')
    expect(p).toContain('ai-service')
    expect(p).toMatch(/start\.bat$/i)
  })

  it('checkAiServiceHealth true si fetch ok', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true })
    const ok = await checkAiServiceHealth('http://x.test', fetchFn as unknown as typeof fetch, 1000)
    expect(ok).toBe(true)
    expect(fetchFn).toHaveBeenCalledWith(
      'http://x.test/health',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('checkAiServiceHealth false si fetch falla', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('network'))
    const ok = await checkAiServiceHealth('http://x.test', fetchFn as unknown as typeof fetch, 1000)
    expect(ok).toBe(false)
  })
})
