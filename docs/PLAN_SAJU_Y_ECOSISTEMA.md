> Estado: ACTIVO | Creado: 2026-03-27 | Última revisión: 2026-03-27

# Plan: Saju de precisión y arquitectura con Carta Astral / ecosistema

Copia canónica en el repo del proyecto (`.cursor/plans/` no se versiona). Actualizar **Última revisión** al modificar este archivo.

## Objetivo

Fijar por escrito la **intención de producto y arquitectura** para un **saju real** (cálculos y convenciones milimétricas, no un módulo cosmético), la relación con la app **occidental actual** (`carta-astral-app`), el uso de **`D:\services\`** (p. ej. **user-profile-service**, **logging-service**, **ai-service**) y la opción de **dos aplicaciones con nombres distintos** más una **UI puente** que las una sin mezclar motores.

**Este plan no implementa código:** sirve para decidir con criterios claros y enlazar desde la ficha del ecosistema.

## Tareas

| Tarea | Prioridad | Esfuerzo | Dependencias |
|-------|-----------|----------|--------------|
| Aprobar o rechazar **dos apps** (occidental vs saju) frente a **un solo repo con dos motores** | Alta | Bajo | Lectura de este plan |
| Si dos apps: definir **nombres de producto** y campo `service` en logs (p. ej. `carta-astral-app` vs `saju-…`) | Alta | Bajo | Decisión anterior |
| Especificar qué datos viven en **user-profile-service** (identidad, fecha/hora/lugar, zona, preferencias) vs almacenamiento local | Alta | Medio | Contrato `:8400`, privacidad |
| Definir **referencias de cálculo** para saju (tablas, calendario, escuela, tests de regresión con casos conocidos) | Alta | Alto | Expertise / literatura acordada |
| Opcional: diseñar **shell / dashboard** que abra ambas UIs **separadas** (enlaces, launcher), sin compartir bundle de cálculo | Media | Medio | Decisiones anteriores |
| Cuando exista repo o ejecutable saju: ficha **`D:\services\docs\projects\…`** y entrada en **ECOSYSTEM.md** | Media | Bajo | Repo creado |
| Integraciones opcionales alineadas con otros planes: **logging-service**, **ai-service** (mensajes bajo control del código) | Baja | Medio | Planes `PLAN_LOGGING_SERVICE.md` / `PLAN_AI_SERVICE.md` |

## Riesgos y regresiones

- **Mezclar** occidental y saju en un solo binario sin fronteras claras → bugs cruzados, tests ilegibles y expectativas de usuario confusas.
- **Saju “de verdad”** mal acotado → deuda técnica y pérdida de confianza; hace falta trazabilidad (de dónde sale cada pilar/regla).
- **Perfil compartido:** inconsistencias si una app actualiza datos que la otra interpreta distinto (p. ej. hora civil vs solar); documentar **fuente de verdad** y migraciones.
- **Privacidad:** datos de nacimiento en servicios compartidos implican acuerdo de retención y API keys en red local (reglas del ecosistema).

## Aprobación

No arrancar implementación de **app saju** ni cambios grandes en **carta-astral-app** hasta **OK explícito** del responsable (regla de fases del ecosistema). Este documento puede revisarse y pasar a `docs/historial/` cuando la decisión quede tomada y reflejada en README / fichas.

## Referencias

- Ficha ecosistema: `D:\services\docs\projects\CARTA_ASTRAL.md`
- Perfil compartido: `D:\services\docs\services\user-profile-service.md`
- Mapa global: `D:\services\docs\ECOSYSTEM.md`
- Reglas: `.cursor/rules/global-rules.mdc` (fuente `D:\services\docs\REGLAS_DESARROLLO.md`)

---

## Decisiones propuestas (para cerrar cuando quieras)

### Por qué probablemente **dos apps**

- El **saju** prioriza **calendario, convenciones y reglas** propias; la occidental prioriza **efemérides / casas / aspectos**. Son dominios de test y release distintos.
- Permite **marcas y nombres distintos** (“no es poner la etiqueta saju encima de la misma app”).
- Reduce el riesgo de que un refactor del motor occidental rompa el saju y viceversa.

### Cómo compartir sin mezclar

| Pieza | Propuesta |
|-------|-----------|
| **Datos de persona** | Sección(es) acordadas en **user-profile-service** (`user_id` estable), más lo que cada app guarde localmente si aplica |
| **Servicios HTTP** | **logging-service** (trazas), **ai-service** (texto bajo prompts fijos en código), otros solo si hay segundo consumidor justificado |
| **UI unificada** | Opcional: contenedor que **lance o enlace** a las dos apps (dashboard, menú, accesos directos). **No** un único motor compartido oculto |

### Nombres

- Resolver **dos nombres comerciales / técnicos** distintos antes del primer release de saju.
- En logs y métricas futuras, **`service`** distinto por app para filtrar en `logging-service`.

### Próximo paso documental

Cuando elijas una opción (una app / dos apps / shell), añadir un párrafo breve en **`CARTA_ASTRAL.md`** § decisión y, si aplica, crear **`D:\services\docs\projects\<NOMBRE_SAJU>.md`**.
