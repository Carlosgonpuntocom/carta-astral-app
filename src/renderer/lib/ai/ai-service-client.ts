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
/** Resumen del día a partir de tránsitos ya calculados (TodayDashboard). */
export const AI_TRANSIT_SYSTEM_PROMPT = `Eres un astrólogo práctico. Genera resumen breve (3-4 frases) del día. Tono: directo, útil. Qué aprovechar y qué evitar.

Reglas obligatorias:
- Usa ÚNICAMENTE el JSON del usuario (transitos_activos, resumen_dia, energias_del_dia, intensidad). No inventes planetas, aspectos ni cifras que no aparezcan ahí.
- No des consejos médicos, legales, financieros ni de seguridad.
- No afirmes certezas absolutas sobre el futuro; habla en términos de tendencias simbólicas del día.
- Responde siempre en español.`

export const AI_CHART_SYSTEM_PROMPT = `Eres un asistente de astrología natal occidental en español, tono divulgativo y respetuoso.

Reglas obligatorias (máxima prioridad):
- Usa ÚNICAMENTE el JSON del usuario: claves nacimiento, ascendente, medio_cielo, planetas, aspectos. No inventes cuerpos, signos, grados ni casas que no aparezcan ahí.
- Por cada planeta o punto que menciones, el signo y la casa deben coincidir exactamente con su entrada en el array "planetas" (campos signo y casa; si no hay casa, di que no viene en los datos). Prohibido atribuir el signo de un cuerpo a otro o agrupar dos planetas en un mismo signo salvo que el JSON muestre ese signo para cada uno.
- ascendente y medio_cielo son ángulos del JSON: úsalos solo con esos valores, no los confundas con planetas.
- Aspectos: comenta solo combinaciones que existan en el array "aspectos" (entre, tipo, orbe). No inventes aspectos ni añadas un tercer cuerpo a un aspecto que en el JSON solo une dos.
- Si falta información en el JSON, dilo; no rellenes por suposición.
- No des consejos médicos, legales, financieros ni de seguridad.
- No afirmes certezas absolutas sobre personalidad o futuro; habla en términos de tendencias simbólicas.
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
      // 502: ai-service ya incluye "Error del proveedor de IA: …" en detail — no duplicar prefijo
      if (res.status === 502) {
        throw new Error(
          detail.trim() ||
            'El proveedor de IA no respondió correctamente (502). Comprueba Ollama y OLLAMA_MODEL en ai-service.'
        )
      }
      throw new Error(
        res.status === 503
          ? `El servicio de IA no está disponible: ${detail}. Arranca ai-service y el proveedor (p. ej. Ollama) en D:\\services.`
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

/** Recordatorio en el mensaje de usuario (refuerzo del system prompt). */
const USER_CHART_VERIFICATION_TAIL =
  '\n\nAntes de redactar: contrasta cada afirmación sobre planetas o ángulos con los campos del JSON; no atribuyas el signo de un cuerpo a otro. Los aspectos solo si constan en "aspectos".'

export async function requestChartSummary(
  chartContextText: string,
  userQuestion: string | undefined,
  options?: AiServiceClientOptions
): Promise<ChatResponse> {
  const block = `Datos de la carta (JSON):\n${chartContextText}${USER_CHART_VERIFICATION_TAIL}`
  const userContent = userQuestion?.trim()
    ? `${block}\n\nPregunta del usuario: ${userQuestion.trim()}`
    : `${block}\n\nGenera un resumen divulgativo coherente con esos datos.`

  return postChat(
    {
      messages: [{ role: 'user', content: userContent }],
      system_prompt: AI_CHART_SYSTEM_PROMPT
    },
    options
  )
}

const USER_TRANSIT_VERIFICATION_TAIL =
  '\n\nAntes de redactar: contrasta cada tránsito mencionado con el array "transitos_activos"; no atribuyas aspectos o planetas que no consten en el JSON.'

export async function requestTransitDaySummary(
  transitContextText: string,
  options?: AiServiceClientOptions
): Promise<ChatResponse> {
  const userContent = `Tránsitos y contexto del día (JSON):\n${transitContextText}${USER_TRANSIT_VERIFICATION_TAIL}\n\nRedacta el resumen breve pedido en el system prompt.`

  return postChat(
    {
      messages: [{ role: 'user', content: userContent }],
      system_prompt: AI_TRANSIT_SYSTEM_PROMPT
    },
    options
  )
}
