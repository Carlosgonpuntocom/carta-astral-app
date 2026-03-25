import type {
  AiServiceClientOptions,
  ChatRequest,
  ChatResponse,
  HealthResponse
} from './ai-service-types'

const DEFAULT_BASE = 'http://127.0.0.1:8100'
const DEFAULT_CHAT_TIMEOUT_MS = 55_000
const DEFAULT_HEALTH_TIMEOUT_MS = 8_000

/** Instrucciones fijas; el modelo solo elabora sobre el contexto numérico. */
export const AI_CHART_SYSTEM_PROMPT = `Eres un asistente de astrología natal occidental en español, tono divulgativo y respetuoso.
Reglas obligatorias:
- Basa el texto únicamente en los datos JSON que recibas del usuario. No inventes posiciones, signos ni grados.
- Si faltan datos, dilo con claridad en lugar de suponer.
- No des consejos médicos, legales, financieros ni de seguridad.
- No afirmes certezas absolutas sobre la personalidad o el futuro; habla en términos de tendencias simbólicas propias de la astrología.
- Responde siempre en español.`

function resolveBaseUrl(options?: AiServiceClientOptions): string {
  const raw = options?.baseUrl ?? import.meta.env.VITE_AI_SERVICE_URL
  const s = typeof raw === 'string' && raw.trim() ? raw.trim() : DEFAULT_BASE
  return s.replace(/\/$/, '')
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const j: unknown = await res.json()
    if (j && typeof j === 'object' && 'detail' in j) {
      const d = (j as { detail: unknown }).detail
      if (typeof d === 'string') return d
      if (Array.isArray(d)) return JSON.stringify(d)
    }
  } catch {
    /* cuerpo no JSON */
  }
  return res.statusText || `HTTP ${res.status}`
}

export function getAiServiceBaseUrl(options?: AiServiceClientOptions): string {
  return resolveBaseUrl(options)
}

export async function checkAiServiceHealth(
  options?: AiServiceClientOptions
): Promise<{ ok: true; data: HealthResponse } | { ok: false; message: string }> {
  const base = resolveBaseUrl(options)
  const timeoutMs = options?.healthTimeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${base}/health`, { signal: controller.signal })
    if (!res.ok) {
      const detail = await readErrorDetail(res)
      return {
        ok: false,
        message: `ai-service respondió con error (${res.status}): ${detail}`
      }
    }
    const data = (await res.json()) as HealthResponse
    return { ok: true, data }
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === 'AbortError'
          ? `ai-service no respondió en ${timeoutMs / 1000} s (${base})`
          : e.message
        : String(e)
    return { ok: false, message: msg }
  } finally {
    clearTimeout(t)
  }
}

export async function postChat(
  body: ChatRequest,
  options?: AiServiceClientOptions
): Promise<ChatResponse> {
  const base = resolveBaseUrl(options)
  const timeoutMs = options?.chatTimeoutMs ?? DEFAULT_CHAT_TIMEOUT_MS
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${base}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    if (!res.ok) {
      const detail = await readErrorDetail(res)
      throw new Error(
        res.status === 503
          ? `El servicio de IA no está disponible: ${detail}. Arranca ai-service y el proveedor (p. ej. Ollama) en D:\\services.`
          : res.status === 502
            ? `Error del proveedor de IA: ${detail}`
            : `Error al hablar con ai-service (${res.status}): ${detail}`
      )
    }
    return (await res.json()) as ChatResponse
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error(
        `La petición a ai-service superó el tiempo de espera (${timeoutMs / 1000} s). Comprueba que Ollama responde y que el modelo no está sobrecargado.`
      )
    }
    if (e instanceof TypeError && e.message.includes('fetch')) {
      throw new Error(
        `No se pudo conectar con ai-service en ${base}. ¿Está arrancado el servicio en el puerto 8100?`
      )
    }
    throw e
  } finally {
    clearTimeout(t)
  }
}

export async function requestChartSummary(
  chartContextText: string,
  userQuestion: string | undefined,
  options?: AiServiceClientOptions
): Promise<ChatResponse> {
  const userContent = userQuestion?.trim()
    ? `Datos de la carta (JSON):\n${chartContextText}\n\nPregunta del usuario: ${userQuestion.trim()}`
    : `Datos de la carta (JSON):\n${chartContextText}\n\nGenera un resumen divulgativo coherente con esos datos.`

  return postChat(
    {
      messages: [{ role: 'user', content: userContent }],
      system_prompt: AI_CHART_SYSTEM_PROMPT
    },
    options
  )
}
