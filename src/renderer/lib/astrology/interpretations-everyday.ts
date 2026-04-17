/**
 * Capa breve «vida cotidiana» para tránsitos (complementa el texto simbólico).
 * No sustituye interpretación personal; da anclaje práctico para voz/LLM.
 */
import type { TransitAspectType } from '../../types/astrology'

const ASPECT_EVERYDAY: Record<TransitAspectType, string> = {
  conjunction:
    'varias energías actúan a la vez sobre el mismo asunto; suele notarse intenso y directo.',
  sextile: 'hay una pequeña ventaja si das un paso concreto; no hace falta forzar.',
  square:
    'puede haber roce o prisa; conviene ajustar expectativas y no precipitar decisiones.',
  trine: 'suele fluir con menos fricción; buen momento para avanzar sin complicar.',
  opposition:
    'tira entre dos necesidades; ayuda buscar equilibrio en vez de «o todo o nada».',
}

const PLANET_TRANSIT_EVERYDAY: Record<string, string> = {
  Sol: 'prioridades del día y cómo te muestras ante los demás',
  Luna: 'estado de ánimo, ritmos y necesidad de descanso o cercanía',
  Mercurio: 'mensajes, reuniones, estudios y trámites; revisa malentendidos si hay tensión',
  Venus: 'afecto, acuerdos cordiales, dinero ligero y lo que te resulta agradable',
  Marte: 'energía, impulsos y posible fricción; canaliza en acción física o tareas claras',
  Júpiter: 'ampliar miras y optimismo; vigila excesos o prometer de más',
  Saturno: 'límites, responsabilidades y orden; los retrasos piden paciencia',
  Urano: 'imprevistos o cambios de planes; flexibilidad suele ayudar',
  Neptuno: 'confusión o inspiración; conviene verificar hechos antes de decidir',
  Plutón: 'temas intensos o cierres de ciclo; evita choques innecesarios',
  Quirón: 'heridas viejas o aprendizaje por fricción suave; no es urgencia física',
}

const NATAL_POINT_EVERYDAY: Record<string, string> = {
  Sol: 'tu identidad y objetivos personales',
  Luna: 'tus emociones y el ritmo del hogar',
  Ascendente: 'tu imagen, actitud ante el día y primera impresión',
  'Medio Cielo': 'trabajo visible, reputación y metas a largo plazo',
  Mercurio: 'tu manera de pensar y comunicarte',
  Venus: 'relaciones y valores',
  Marte: 'cómo actúas y dónde pones la energía',
  Júpiter: 'crecimiento y visión de conjunto',
  Saturno: 'límites y compromisos',
  Urano: 'libertad y cambio',
  Neptuno: 'idealismo e intuición',
  Plutón: 'transformaciones profundas',
}

/** Frase corta añadida al final de cada interpretación de tránsito. */
export function everydaySupplement(
  transitingPlanet: string,
  aspect: TransitAspectType,
  natalPoint: string,
): string {
  const asp = ASPECT_EVERYDAY[aspect] ?? 'influencia que conviene observar con calma.'
  const zona = PLANET_TRANSIT_EVERYDAY[transitingPlanet] ?? `ámbitos ligados a ${transitingPlanet}`
  const blanco =
    NATAL_POINT_EVERYDAY[natalPoint] ?? `lo que en tu carta simboliza ${natalPoint}`
  return ` Día a día: ${asp} Suele notarse en ${blanco} y en ${zona}.`
}
