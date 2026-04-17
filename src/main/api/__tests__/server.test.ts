/**
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

vi.mock('electron', () => ({
  app: {
    getPath: () => '/tmp/carta-astral-test-userdata',
    isPackaged: false,
  },
}))

const { getMyChartMock } = vi.hoisted(() => ({
  getMyChartMock: vi.fn<() => null | Record<string, unknown>>(() => null),
}))

vi.mock('../data-reader', () => ({
  readPeopleSync: () => [],
  getMyChart: () => getMyChartMock(),
}))

import { createApiApp } from '../server'

describe('Carta Astral API', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development'
  })

  it('GET /health devuelve data.status ok', async () => {
    const app = createApiApp()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.data?.status).toBe('ok')
    expect(res.body.data?.service).toBe('carta-astral-api')
  })

  it('GET /api/v1/daily-summary sin carta devuelve 404', async () => {
    const app = createApiApp()
    const res = await request(app).get('/api/v1/daily-summary')
    expect(res.status).toBe(404)
    expect(typeof res.body.detail).toBe('string')
    expect(res.body.detail).toMatch(/carta natal/i)
  })

  it('GET /api/v1/daily-summary con date inválido devuelve 422 (con carta)', async () => {
    getMyChartMock.mockReturnValue({
      id: 't1',
      isSelf: true,
      name: 'Test',
      birthData: {
        name: 'Test',
        date: '1990-01-01',
        time: '12:00',
        place: 'Palma',
        latitude: 39.57,
        longitude: 2.65,
      },
      relationship: 'otro',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    })
    const app = createApiApp()
    const res = await request(app).get('/api/v1/daily-summary').query({ date: 'no-es-fecha' })
    expect(res.status).toBe(422)
    expect(String(res.body.detail)).toMatch(/date/i)
  })
})
