# Añadir Swiss Ephemeris como Motor de Cálculo Alternativo

## OBJETIVO

Ofrecer dos motores de cálculo en la app:
1. **Básico**: circular-natal-horoscope-js (actual)
2. **Profesional**: Swiss Ephemeris (máxima precisión)

Con selector en Settings para cambiar entre ambos.

---

## LIBRERÍA A USAR

**swisseph** (port JavaScript de Swiss Ephemeris)
```bash
npm install swisseph
```

Documentación: https://github.com/mivion/swisseph

---

## ARQUITECTURA

### 1. Interfaz unificada

Crear abstraction layer para que el resto de la app no sepa qué motor usa:
```typescript
// src/renderer/lib/astrology/engine-interface.ts

export interface AstrologyEngine {
  calculateChart(birthData: BirthData): Promise<ChartData>
  calculateTransits(date: Date, natalChart: ChartData): Promise<Transit[]>
}

export type EngineType = 'basic' | 'professional'
```

### 2. Implementaciones

**BasicEngine** (actual - circular-natal-horoscope-js):
```typescript
// src/renderer/lib/astrology/engines/basic-engine.ts

import { Origin } from 'circular-natal-horoscope-js'

export class BasicEngine implements AstrologyEngine {
  async calculateChart(birthData: BirthData): Promise<ChartData> {
    // Código actual de calculator.ts
  }
  
  async calculateTransits(date: Date, natalChart: ChartData): Promise<Transit[]> {
    // Código actual de transits.ts
  }
}
```

**ProfessionalEngine** (nuevo - swisseph):
```typescript
// src/renderer/lib/astrology/engines/professional-engine.ts

import swisseph from 'swisseph'

export class ProfessionalEngine implements AstrologyEngine {
  async calculateChart(birthData: BirthData): Promise<ChartData> {
    // Implementar con swisseph
  }
  
  async calculateTransits(date: Date, natalChart: ChartData): Promise<Transit[]> {
    // Implementar con swisseph
  }
}
```

### 3. Factory pattern
```typescript
// src/renderer/lib/astrology/engine-factory.ts

export class EngineFactory {
  static create(type: EngineType): AstrologyEngine {
    switch(type) {
      case 'basic':
        return new BasicEngine()
      case 'professional':
        return new ProfessionalEngine()
      default:
        return new BasicEngine()
    }
  }
}
```

---

## SETTINGS UI

Añadir en Settings o en vista de carta:
```typescript
<SettingsSection>
  <h3>⚙️ Motor de Cálculo</h3>
  
  <RadioGroup value={engineType} onChange={setEngineType}>
    <Radio value="basic">
      <div>
        <strong>Básico</strong>
        <p className="text-sm text-gray-600">
          Rápido y suficiente para uso diario.
          Precisión: ±0.5°
        </p>
      </div>
    </Radio>
    
    <Radio value="professional">
      <div>
        <strong>Profesional (Swiss Ephemeris)</strong>
        <p className="text-sm text-gray-600">
          Máxima precisión profesional.
          Exactitud: ±0.01° - Estándar NASA
        </p>
      </div>
    </Radio>
  </RadioGroup>
  
  <Alert>
    💡 El cambio recalculará todas las cartas guardadas.
    Puede tardar unos segundos.
  </Alert>
</SettingsSection>
```

---

## PERSISTENCIA

Guardar preferencia en localStorage:
```typescript
const SETTINGS_KEY = 'astrology-engine-settings'

interface EngineSettings {
  type: EngineType
  lastChanged: Date
}

function saveEngineSetting(type: EngineType) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    type,
    lastChanged: new Date()
  }))
}

function getEngineSetting(): EngineType {
  const saved = localStorage.getItem(SETTINGS_KEY)
  return saved ? JSON.parse(saved).type : 'basic'
}
```

---

## IMPLEMENTACIÓN SWISSEPH

### Inicialización
```typescript
import swisseph from 'swisseph'

// Configurar path de archivos efemerides
swisseph.swe_set_ephe_path('/path/to/ephemeris/files')

// O usar built-in (menos preciso pero no necesita archivos)
swisseph.swe_set_ephe_path(null)
```

### Calcular posiciones planetarias
```typescript
function calculatePlanetPosition(
  planetId: number, 
  julianDay: number
): { longitude: number, latitude: number, distance: number } {
  
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED
  
  const result = swisseph.swe_calc_ut(
    julianDay,
    planetId,
    flags
  )
  
  if (result.flag < 0) {
    throw new Error(`Error calculating planet: ${result.error}`)
  }
  
  return {
    longitude: result.longitude,
    latitude: result.latitude,
    distance: result.distance
  }
}
```

### IDs de planetas en swisseph
```typescript
const PLANET_IDS = {
  sun: swisseph.SE_SUN,        // 0
  moon: swisseph.SE_MOON,      // 1
  mercury: swisseph.SE_MERCURY, // 2
  venus: swisseph.SE_VENUS,     // 3
  mars: swisseph.SE_MARS,       // 4
  jupiter: swisseph.SE_JUPITER, // 5
  saturn: swisseph.SE_SATURN,   // 6
  uranus: swisseph.SE_URANUS,   // 7
  neptune: swisseph.SE_NEPTUNE, // 8
  pluto: swisseph.SE_PLUTO,     // 9
  chiron: swisseph.SE_CHIRON,   // 15
  // Nodo Norte: swisseph.SE_TRUE_NODE
}
```

### Calcular Ascendente y MC
```typescript
function calculateAngles(
  julianDay: number,
  latitude: number,
  longitude: number
): { ascendant: number, mc: number } {
  
  const houses = swisseph.swe_houses(
    julianDay,
    latitude,
    longitude,
    'P' // Sistema Placidus
  )
  
  return {
    ascendant: houses.ascendant,
    mc: houses.mc
  }
}
```

### Convertir fecha a Julian Day
```typescript
function dateToJulianDay(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours() + date.getMinutes() / 60
  
  return swisseph.swe_julday(
    year,
    month, 
    day,
    hour,
    swisseph.SE_GREG_CAL
  )
}
```

---

## COMPARACIÓN DE RESULTADOS

Añadir componente para comparar:
```typescript
<ComparisonView>
  <h3>🔬 Comparación de Motores</h3>
  
  <table>
    <thead>
      <tr>
        <th>Planeta</th>
        <th>Básico</th>
        <th>Profesional</th>
        <th>Diferencia</th>
      </tr>
    </thead>
    <tbody>
      {planets.map(planet => (
        <tr>
          <td>{planet.name}</td>
          <td>{basicResult[planet]}</td>
          <td>{professionalResult[planet]}</td>
          <td className={getDiffClass(diff)}>
            {diff}°
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</ComparisonView>
```

---

## MIGRATION

Cuando usuario cambia de motor:
```typescript
async function migrateToNewEngine(newType: EngineType) {
  const people = await loadAllPeople()
  const newEngine = EngineFactory.create(newType)
  
  for (const person of people) {
    // Recalcular carta con nuevo motor
    const newChart = await newEngine.calculateChart(person.birthData)
    
    // Actualizar
    person.chartData = newChart
    await savePerson(person)
  }
  
  // Guardar preferencia
  saveEngineSetting(newType)
}
```

---

## CONSIDERACIONES

### Performance
- swisseph es más lento que circular-natal-horoscope-js
- Cachear resultados agresivamente
- Mostrar loading indicator

### Archivos de efemérides
- swisseph necesita archivos de datos
- Opción 1: Incluir en app (aumenta tamaño)
- Opción 2: Descargar on-demand
- Opción 3: Usar built-in (menos preciso)

### Compatibilidad
- swisseph puede tener issues en web
- Funciona mejor en Electron/Node
- Testing exhaustivo necesario

---

## TESTING

Comparar con astro.com:
```typescript
describe('Professional Engine', () => {
  it('should match astro.com within 0.1°', async () => {
    const birthData = {
      date: '1983-01-01',
      time: '15:30',
      location: 'Palma, España'
    }
    
    const result = await professionalEngine.calculateChart(birthData)
    
    // Valores de astro.com
    expect(result.sun.longitude).toBeCloseTo(280.6, 1)
    expect(result.ascendant.longitude).toBeCloseTo(72.04, 1)
  })
})
```

---

## PRIORIDAD

1. ✅ Crear abstraction layer (EngineInterface)
2. ✅ Refactorizar código actual a BasicEngine
3. ✅ Implementar ProfessionalEngine básico
4. ✅ Añadir selector en Settings
5. ✅ Testing con tu carta
6. ⭐ Comparación side-by-side
7. ⭐ Migration tool

---

## ⚠️ NOTAS IMPORTANTES

### NO IMPLEMENTAR HOY
- Requiere mente fresca y tiempo dedicado (3-4 horas)
- swisseph es complejo y puede introducir bugs
- Mejor hacerlo cuando se pueda dedicar atención completa

### ALTERNATIVAS A CONSIDERAR

1. **swisseph vs astro.js**:
   - `astro.js` es más moderno y fácil de usar
   - `swisseph` es más preciso pero más complejo
   - Considerar `astro.js` como alternativa intermedia

2. **Validación primero**:
   - Antes de implementar, validar que circular-natal-horoscope-js realmente tiene problemas
   - Comparar resultados con astro.com para ver diferencias reales
   - Si diferencias son < 0.5°, puede no valer la pena

3. **Implementación gradual**:
   - Primero: Refactorizar código actual a BasicEngine (sin cambios funcionales)
   - Segundo: Validar necesidad real de swisseph
   - Tercero: Si es necesario, implementar ProfessionalEngine

---

## RECURSOS

- Swiss Ephemeris: https://www.astro.com/swisseph/swephinfo_e.htm
- swisseph npm: https://www.npmjs.com/package/swisseph
- astro.js (alternativa): https://github.com/astrology-js/astro.js

