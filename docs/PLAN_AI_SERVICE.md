> Estado: ACTIVO | Creado: 2026-03-26 | Última revisión: 2026-03-27

# Plan: integración Carta Astral con ai-service

Copia canónica en el repo del plan acordado (la versión en `.cursor/plans/` no se versiona). Actualizar **Última revisión** al modificar este archivo.

**Modelo:** Carta Astral es una **app** (Electron) que **consume** **ai-service** en `D:\services\` (puerto 8100); no se añade un servicio HTTP nuevo en el monorepo de services.

## Objetivo

Integrar la app Electron con **ai-service** (`localhost:8100`) mediante un cliente HTTP con **timeout explícito**, un flujo de **resumen asistido** de la carta actual (y opcionalmente una pregunta corta), documentación y ecosistema alineados con las reglas (mensajes de sistema fijados en código, sin fallbacks silenciosos).

## Tareas

| Tarea | Prioridad | Esfuerzo | Dependencias |
|-------|-----------|----------|--------------|
| Cliente `ai-service-client.ts` + `chartDataToPromptContext` + timeout y errores en español | Alta | Medio | Ninguna |
| Tests Vitest (fetch mockeado: health, chat 200, 503, timeout; asserts sobre URL/cuerpo) | Alta | Medio | Cliente |
| Componente `ChartAiAssistant` + integración en `ChartView` (UX carga/error, a11y) | Alta | Medio | Cliente |
| `.env.example` + README (Ollama, ai-service, `VITE_AI_SERVICE_URL`) | Media | Bajo | Ninguna |
| Actualizar `D:\services\docs\projects\CARTA_ASTRAL.md` + `sync-services.ps1` | Media | Bajo | Ninguna |
| Cierre: checklist auditoría reglas (sección más abajo) | Alta | Bajo | Todo lo anterior |

## Riesgos y regresiones

- **ai-service u Ollama apagados:** la carta debe seguir funcionando; solo el bloque IA muestra error claro.
- **Latencia alta:** timeout acotado (p. ej. 45–60 s) y estado de carga visible.
- **Datos personales en el prompt:** por defecto flujo local (Ollama); documentar si en el futuro se usa OpenAI.
- **Regresión en tests existentes:** ejecutar `npm test -- --run` antes de cerrar (0 failed, 0 skipped, 0 warnings).

## Aprobación

No implementar hasta **OK explícito** del responsable del proyecto (regla de fases del ecosistema).

## Referencias

- Contrato: `POST /chat`, `GET /health` en `D:\services\ai-service\main.py`
- Vista carta: `src/renderer/components/ChartView.tsx`, `App.tsx`
- Ficha ecosistema: `D:\services\docs\projects\CARTA_ASTRAL.md`
- Reglas: `.cursor/rules/global-rules.mdc` (fuente `D:\services\docs\REGLAS_DESARROLLO.md`)

---

## Contexto técnico

- **Contrato:** `POST /chat` con `{ messages: [{role, content}], system_prompt?: string }` y respuesta `{ response, model, provider }`. CORS en ai-service permite orígenes amplios; el **renderer** puede usar `fetch` como en `src/renderer/lib/utils/geocoding.ts`.
- **Punto de UI:** `ChartView` cuando `currentView === 'chart'` en `App.tsx`.

```mermaid
sequenceDiagram
  participant UI as ChartView
  participant Client as aiServiceClient
  participant AI as ai_service_8100
  participant LLM as Ollama_or_OpenAI
  UI->>Client: resumen o pregunta y ChartData
  Client->>AI: GET health opcional
  Client->>AI: POST chat con timeout
  AI->>LLM: providers.chat
  LLM-->>AI: texto
  AI-->>Client: ChatResponse
  Client-->>UI: texto o error en español
```

## Alcance MVP

1. Botón **Generar resumen con IA** con contexto estructurado desde `ChartData` (`birthData`, `planets`, `ascendant`, `midheaven`, `aspects` si existen) y **system prompt fijo en código** (español, divulgativo, no contradecir cifras, sin médico/legal/financiero).
2. Opcional: campo **Pregunta sobre esta carta** (misma llamada `POST /chat`).
3. Si `GET /health` falla o `POST /chat` devuelve 503/502/timeout: mensaje en español y guía para arrancar ai-service/Ollama. Sin `catch` vacío.

## Implementación (resumen)

| Área | Acción |
|------|--------|
| Config | `VITE_AI_SERVICE_URL` default `http://127.0.0.1:8100` en `.env.example` y README |
| Cliente | `src/renderer/lib/ai/ai-service-client.ts`: `AbortSignal.timeout` o `AbortController`, `GET /health`, `POST /chat`, tipos alineados con FastAPI |
| Contexto | Función pura `chartDataToPromptContext(chart)` solo con datos ya calculados |
| UI | `ChartAiAssistant.tsx` en `ChartView` con `CollapsibleSection`, `aria-label`, resultado scrollable |
| Tests | Vitest con mocks que validen comportamiento real del cliente |
| Ecosistema | `CARTA_ASTRAL.md` + `D:\services\scripts\claude-context\sync-services.ps1` |

## Fuera de alcance (fases futuras)

- Auth hacia ai-service; historial multi-turno persistente; sustituir todas las interpretaciones por IA; logging-service (plan aparte: `docs/PLAN_LOGGING_SERVICE.md`).

## Auditoría — reglas repo y Cursor (obligatoria antes de cerrar)

**Fuentes de verdad:**

| Ámbito | Ubicación |
|--------|-----------|
| Reglas ecosistema (67) | `d:\projects\carta-astral-app\.cursor\rules\global-rules.mdc` → `D:\services\docs\REGLAS_DESARROLLO.md` |
| Cursor en este repo | Solo `global-rules.mdc` |
| Docs en `D:\services` | `D:\services\.cursor\rules\documentation-sync.mdc`, `ecosystem-context.mdc` |
| Plan versionado | Este archivo `docs/PLAN_AI_SERVICE.md` |

**Checklist por sector (aplicable a esta feature):**

1. **Calidad y testing** — `npm test -- --run`: 0 failed, 0 skipped, 0 warnings. Mocks que verifiquen **URL** (`/health`, `/chat`), **cuerpo** (mensajes, `system_prompt` si aplica) y **timeout**, no mocks vacíos 🐛. Si no hay prueba E2E con ai-service + proveedor real: **pedir prueba manual** antes de cerrar.
2. **Errores y HTTP** — Timeout explícito en **cada** llamada a ai-service. Sin `catch` vacío; errores de red y 502/503 visibles para el usuario en **español** en la UI del bloque IA (sin bloquear el resto de la app).
3. **TypeScript** — Tipos estrictos para request/response (`ChatRequest` / `ChatResponse` alineados con FastAPI); sin `any` innecesario.
4. **IA y producto (⭐⭐⭐)** — **System prompt y límites del rol fijados en código**; el modelo elabora sobre datos ya calculados; no sustituye la lógica de negocio ni posiciones. Ningún mensaje crítico al usuario depende solo del LLM sin control del código.
5. **UX / frontend** — Estados **carga, error y vacío** en el bloque IA; **accesibilidad** (`aria-label`, teclado donde aplique); **responsive** coherente con `ChartView`.
6. **Seguridad** — No subir `.env`; actualizar `.env.example` con `VITE_AI_SERVICE_URL`. No **loguear** el prompt completo con datos personales en producción; no hardcodear API keys.
7. **Variables de entorno** — Documentar en el mismo commit en que se lea la variable en el cliente.
8. **API REST (consumidor)** — Interpretar errores FastAPI (`detail`); manejar 503/502/422 sin asumir 200 con error en body.
9. **Commits** — Nunca `--no-verify`; separar commits cuando haya `feat:` + `docs:` ecosistema.
10. **Documentación `D:\services`** — Tras `CARTA_ASTRAL.md`: `sync-services.ps1`; no editar a mano `docs-claude/`.
11. **Arquitectura** — Consumir **ai-service** existente; no embeber motor LLM propio en la app.
12. **Comunicación** — Cierre con PARA QUÉ / POR QUÉ; pendientes explícitos (p. ej. prueba manual con Ollama).

**Poco aplicable:** convenciones Python/Pydantic en servicios no tocados; `start.bat` de servicios Python; otros `.mdc` de `D:\services` salvo que se editen esas carpetas.

**Entregable de auditoría:** revisar esta lista contra el diff y anotar si hubo verificación manual con ai-service (:8100).

## Orden de trabajo

1. Cliente + contexto + tests del cliente  
2. UI + `ChartView`  
3. README + `.env.example` + `CARTA_ASTRAL.md` + `sync-services.ps1`  
4. `npm test -- --run`  
5. Checklist de auditoría  
