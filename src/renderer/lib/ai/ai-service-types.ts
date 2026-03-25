/** Contrato alineado con D:\services\ai-service\main.py (Pydantic). */

export interface ChatMessage {
  role: string
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  system_prompt?: string | null
}

export interface ChatResponse {
  response: string
  model: string
  provider: string
}

export interface HealthResponse {
  status: string
  provider: string
  model: string
}

export interface AiServiceClientOptions {
  /** Para tests: anula import.meta.env.VITE_AI_SERVICE_URL */
  baseUrl?: string
  chatTimeoutMs?: number
  healthTimeoutMs?: number
}
