> Estado: ACTIVO | Creado: 2026-03-26 | Última revisión: 2026-03-27

# Plan: Carta Astral consume ai-service (IA de `D:\services\`)

La app **no** es un servicio HTTP: sigue siendo Electron en `D:\projects\carta-astral-app\`. **Solo añade un cliente** que llama a **ai-service** ya existente en `:8100` (Ollama/OpenAI según config de ai-service).

Actualizar **Última revisión** al cambiar este archivo.

## Objetivo

Un botón (o bloque) en la vista de carta que pida un **resumen en español** vía `POST /chat`, con **timeout**, **errores visibles** si ai-service/Ollama no están, y **system prompt fijo en código** (el modelo no inventa posiciones; solo explica a partir de `ChartData` ya calculado).

## Aprobación

Implementar solo tras **OK explícito** del responsable.

## Qué necesita el PC

1. **ai-service** arrancado (`D:\services\ai-service\`, puerto **8100**).
2. **Proveedor configurado** en ai-service (típicamente **Ollama** en local). Ver `D:\services\docs\services\ai-service.md`.

## Contrato (una línea)

`POST http://127.0.0.1:8100/chat` — body `{ "messages": [{ "role": "user", "content": "..." }], "system_prompt": "..." }` — respuesta `{ "response", "model", "provider" }`. Opcional: `GET /health` antes para saber si hay proveedor.

Implementación de referencia en `D:\services\ai-service\main.py`.

## Pasos de implementación (orden)

1. **`src/renderer/lib/ai/ai-service-client.ts`** — `fetch` + `AbortSignal.timeout` (~45–60 s); tipos alineados con FastAPI; función **`chartDataToPromptContext(chart)`** (solo datos ya calculados); mensajes de error al usuario en **español**.
2. **Tests Vitest** — mock de `fetch`: comprueba URL, cuerpo y timeout (no mock vacío).
3. **`ChartAiAssistant.tsx` + `ChartView`** — colapsable; estados carga / error / resultado; `aria-label`.
4. **`.env.example` + README** — `VITE_AI_SERVICE_URL=http://127.0.0.1:8100` y cómo arrancar ai-service + Ollama.
5. **`CARTA_ASTRAL.md` + `sync-services.ps1`** — una vez integrado, reflejar consumo de ai-service en la ficha del ecosistema.

**MVP:** solo “Generar resumen con IA”. Una **pregunta corta** opcional en el mismo entregable si no alarga mucho.

## Riesgos

- Sin ai-service: la carta normal debe seguir igual; solo el bloque IA muestra el error.
- No enviar **PII** innecesaria en logs de consola; el prompt puede llevar datos de carta — documentar si algún día se usa OpenAI en cloud.

## Referencias rápidas

| Qué | Dónde |
|-----|--------|
| Vista carta | `src/renderer/components/ChartView.tsx`, `App.tsx` |
| `fetch` similar | `src/renderer/lib/utils/geocoding.ts` |
| Ficha proyecto | `D:\services\docs\projects\CARTA_ASTRAL.md` |
| Reglas | `.cursor/rules/global-rules.mdc` |

## Auditoría antes de cerrar

**Fuentes:** `global-rules.mdc` → `REGLAS_DESARROLLO.md`; `documentation-sync.mdc` / `ecosystem-context.mdc` si se toca `CARTA_ASTRAL.md`.

**Comprobar:** tests **0 failed / 0 skipped / 0 warnings**; timeout en cada llamada; sin `catch` vacío; TS strict; **prompt de sistema en código**; UX carga/error; `.env.example` actualizado; `sync-services.ps1` tras doc en services; commits sin `--no-verify`; prueba manual con :8100 si no hay E2E; cierre **PARA QUÉ / POR QUÉ**.

*(Listado detallado 1–12: versión anterior en historial Git si hace falta desglosar por sector.)*
