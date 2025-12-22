import type { TransitAspectType } from '../../types/astrology'

// Base de datos de interpretaciones básicas
// Formato: "transitingPlanet_aspect_natalPoint"
const INTERPRETATIONS: Record<string, string> = {
  // Sol transitando
  'Sol_conjunction_Sol': 'Retorno solar. Nuevo ciclo personal. Renovación de energía y propósito.',
  'Sol_conjunction_Luna': 'Energía emocional intensa. Momentos de claridad emocional.',
  'Sol_conjunction_Ascendente': 'Período de autoconfianza y proyección personal. Nuevos comienzos.',
  'Sol_square_Sol': 'Desafíos a tu identidad y propósito. Necesitas redefinirte.',
  'Sol_trine_Sol': 'Flujo de energía positiva. Confianza y claridad en tus objetivos.',
  'Sol_opposition_Sol': 'Tensiones entre tu yo interno y externo. Necesitas equilibrio.',
  
  // Luna transitando
  'Luna_conjunction_Sol': 'Sincronización emocional y racional. Momentos de claridad.',
  'Luna_conjunction_Luna': 'Retorno lunar. Ciclo emocional completo. Sensibilidad aumentada.',
  'Luna_square_Luna': 'Tensiones emocionales. Necesitas procesar sentimientos.',
  'Luna_trine_Luna': 'Armonía emocional. Buen momento para expresar sentimientos.',
  
  // Mercurio transitando
  'Mercurio_conjunction_Sol': 'Comunicación clara y directa. Ideas brillantes.',
  'Mercurio_conjunction_Luna': 'Pensamientos y emociones alineados. Comunicación emocional fluida.',
  'Mercurio_square_Mercurio': 'Dificultades de comunicación. Malentendidos posibles.',
  'Mercurio_trine_Mercurio': 'Comunicación fluida. Buen momento para negocios y estudios.',
  
  // Venus transitando
  'Venus_conjunction_Venus': 'Retorno de Venus. Renovación en relaciones y valores.',
  'Venus_conjunction_Sol': 'Armonía en relaciones. Atractivo y carisma aumentados.',
  'Venus_conjunction_Luna': 'Emociones placenteras. Conexión emocional en relaciones.',
  'Venus_square_Venus': 'Desafíos en relaciones. Necesitas revisar valores.',
  'Venus_trine_Venus': 'Armonía en relaciones y creatividad. Momentos de belleza.',
  
  // Marte transitando
  'Marte_conjunction_Marte': 'Retorno de Marte. Energía y acción renovadas.',
  'Marte_conjunction_Sol': 'Energía intensa. Momento para actuar con determinación.',
  'Marte_square_Marte': 'Tensiones y conflictos. Necesitas canalizar la energía.',
  'Marte_trine_Marte': 'Energía constructiva. Buen momento para iniciar proyectos.',
  
  // Júpiter transitando
  'Júpiter_conjunction_Sol': 'Expansión y crecimiento personal. Oportunidades de éxito.',
  'Júpiter_conjunction_Luna': 'Expansión emocional positiva. Suerte en asuntos familiares.',
  'Júpiter_trine_Sol': 'Optimismo y crecimiento. Oportunidades favorables.',
  'Júpiter_trine_Luna': 'Bienestar emocional. Suerte y expansión en el hogar.',
  'Júpiter_square_Sol': 'Exceso de confianza. Necesitas moderación.',
  'Júpiter_opposition_Sol': 'Tensiones entre expansión y límites. Necesitas equilibrio.',
  
  // Saturno transitando
  'Saturno_conjunction_Sol': 'Periodo de responsabilidades y maduración. Pruebas de carácter.',
  'Saturno_conjunction_Luna': 'Restricciones emocionales. Necesitas estructura emocional.',
  'Saturno_square_Sol': 'Desafíos y responsabilidades. Momento de maduración y disciplina.',
  'Saturno_square_Luna': 'Restricciones emocionales. Necesitas procesar limitaciones.',
  'Saturno_trine_Sol': 'Estructura y estabilidad. Recompensas por trabajo previo.',
  'Saturno_opposition_Sol': 'Tensiones entre responsabilidad y libertad. Necesitas equilibrio.',
  
  // Urano transitando
  'Urano_conjunction_Sol': 'Cambios súbitos e inesperados. Liberación y libertad.',
  'Urano_conjunction_Luna': 'Cambios emocionales inesperados. Necesitas adaptabilidad.',
  'Urano_square_Sol': 'Revoluciones personales. Cambios disruptivos necesarios.',
  'Urano_trine_Sol': 'Innovación y libertad. Oportunidades de cambio positivo.',
  
  // Neptuno transitando
  'Neptuno_conjunction_Sol': 'Inspiración y espiritualidad. Período de idealismo.',
  'Neptuno_conjunction_Luna': 'Sensibilidad psíquica aumentada. Necesitas discernimiento.',
  'Neptuno_square_Sol': 'Confusión y desilusión. Necesitas claridad.',
  'Neptuno_trine_Sol': 'Inspiración creativa. Conexión espiritual profunda.',
  
  // Plutón transitando
  'Plutón_conjunction_Sol': 'Transformación profunda. Renacimiento personal.',
  'Plutón_conjunction_Luna': 'Transformación emocional intensa. Procesamiento profundo.',
  'Plutón_square_Sol': 'Crisis transformadoras. Necesitas soltar lo viejo.',
  'Plutón_trine_Sol': 'Transformación positiva. Poder personal renovado.',
  
  // Tránsitos a Ascendente
  'Sol_conjunction_Ascendente': 'Nuevo ciclo personal. Autoconfianza y proyección.',
  'Luna_conjunction_Ascendente': 'Sensibilidad aumentada. Momentos de cambio emocional.',
  'Marte_conjunction_Ascendente': 'Energía y acción. Momento para iniciar proyectos.',
  'Venus_conjunction_Ascendente': 'Atractivo y carisma. Buen momento para relaciones.',
  'Júpiter_conjunction_Ascendente': 'Expansión personal. Oportunidades de crecimiento.',
  'Saturno_conjunction_Ascendente': 'Responsabilidades y maduración. Estructura personal.',
  
  // Tránsitos a Medio Cielo
  'Sol_conjunction_Medio Cielo': 'Éxito profesional. Reconocimiento y logros.',
  'Luna_conjunction_Medio Cielo': 'Cambios en carrera. Sensibilidad profesional.',
  'Marte_conjunction_Medio Cielo': 'Acción en carrera. Competitividad y determinación.',
  'Júpiter_conjunction_Medio Cielo': 'Expansión profesional. Oportunidades de éxito.',
  'Saturno_conjunction_Medio Cielo': 'Responsabilidades profesionales. Estructura y disciplina.',
  'Venus_conjunction_Medio Cielo': '¡Excelente para visibilidad profesional! Atractivo y reconocimiento en tu carrera. Oportunidades de éxito y relaciones laborales positivas.',
  'Venus_trine_Medio Cielo': 'Armonía profesional. Reconocimiento y éxito en tu carrera.',
  'Venus_sextile_Medio Cielo': 'Oportunidades profesionales. Relaciones laborales favorables.',
  'Mercurio_conjunction_Medio Cielo': 'Comunicación profesional. Ideas brillantes en tu carrera.',
  'Urano_conjunction_Medio Cielo': 'Cambios profesionales inesperados. Innovación en carrera.',
  'Neptuno_conjunction_Medio Cielo': 'Inspiración profesional. Visión creativa en tu carrera.',
  'Plutón_conjunction_Medio Cielo': 'Transformación profesional profunda. Renacimiento en carrera.',
  
  // Más combinaciones específicas
  'Venus_conjunction_Venus': 'Retorno de Venus. Renovación en relaciones y valores. Momento especial para el amor y la belleza.',
  'Venus_trine_Venus': 'Armonía en relaciones y creatividad. Momentos de belleza y placer.',
  'Venus_sextile_Venus': 'Oportunidades en relaciones. Conexiones favorables.',
  'Venus_square_Venus': 'Desafíos en relaciones. Necesitas revisar valores y expectativas.',
  'Venus_opposition_Venus': 'Tensiones en relaciones. Necesitas equilibrio entre dar y recibir.',
  
  'Urano_trine_Sol': 'Innovación y libertad. Oportunidades de cambio positivo y liberación.',
  'Urano_sextile_Sol': 'Cambios favorables. Apertura a nuevas posibilidades.',
  'Urano_square_Sol': 'Revoluciones personales. Cambios disruptivos necesarios para crecer.',
  'Urano_opposition_Sol': 'Tensiones entre libertad y estructura. Necesitas encontrar equilibrio.',
  
  'Júpiter_sextile_Sol': 'Oportunidades de crecimiento. Expansión favorable en tus objetivos.',
  'Júpiter_sextile_Luna': 'Bienestar emocional. Suerte y expansión en el hogar.',
  'Júpiter_sextile_Venus': 'Suerte en relaciones. Oportunidades de amor y placer.',
  
  'Saturno_sextile_Sol': 'Estructura y disciplina. Recompensas por trabajo constante.',
  'Saturno_sextile_Luna': 'Estabilidad emocional. Estructura en el hogar.',
  
  'Neptuno_sextile_Sol': 'Inspiración creativa. Conexión espiritual y artística.',
  'Neptuno_sextile_Luna': 'Sensibilidad psíquica. Intuición aumentada.',
  
  'Plutón_sextile_Sol': 'Transformación positiva. Poder personal renovado.',
  'Plutón_sextile_Luna': 'Transformación emocional profunda. Procesamiento interno.',
}

// Función para obtener interpretación
export function getInterpretation(
  transitingPlanet: string,
  aspect: TransitAspectType,
  natalPoint: string
): string {
  const key = `${transitingPlanet}_${aspect}_${natalPoint}`
  
  // Intentar con el nombre exacto
  if (INTERPRETATIONS[key]) {
    return INTERPRETATIONS[key]
  }
  
  // Fallback: interpretación genérica basada en aspecto
  const aspectMeanings: Record<TransitAspectType, string> = {
    conjunction: 'Fusión de energías. Influencia directa y potente.',
    sextile: 'Oportunidad armónica. Flujo positivo de energía.',
    square: 'Desafío y tensión. Necesitas acción y resolución.',
    trine: 'Armonía y flujo. Energía positiva y facilitadora.',
    opposition: 'Tensión y polaridad. Necesitas equilibrio y diálogo.'
  }
  
  return `${transitingPlanet} ${aspectMeanings[aspect]} sobre tu ${natalPoint} natal.`
}

