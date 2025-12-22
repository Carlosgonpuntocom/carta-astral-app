import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ChartData } from '../../types/astrology'
import { calculateElements, calculateRPGStats } from '../astrology/chart-game-calculator'
import { calculateAffinity } from './affinity-calculator'

// Función para calcular aspectos de sinastría (copiada de CompareView)
function getAbsoluteLongitude(planet: { sign: string; degree: number }): number {
  const signOrder: Record<string, number> = {
    'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
    'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
    'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
  }
  const signOffset = signOrder[planet.sign] || 0
  return signOffset + planet.degree
}

function normalizePlanetName(name: string): string {
  const map: Record<string, string> = {
    'Sun': 'Sol', 'sun': 'Sol',
    'Moon': 'Luna', 'moon': 'Luna',
    'Mercury': 'Mercurio', 'mercury': 'Mercurio',
    'Venus': 'Venus', 'venus': 'Venus',
    'Mars': 'Marte', 'mars': 'Marte',
    'Jupiter': 'Júpiter', 'jupiter': 'Júpiter',
    'Saturn': 'Saturno', 'saturn': 'Saturno',
    'Uranus': 'Urano', 'uranus': 'Urano',
    'Neptune': 'Neptuno', 'neptune': 'Neptuno',
    'Pluto': 'Plutón', 'pluto': 'Plutón'
  }
  return map[name] || name
}

function calculateSynastryAspects(chart1: ChartData, chart2: ChartData) {
  const aspects: Array<{
    planet1: string
    planet2: string
    type: string
    orb: number
  }> = []

  for (const planet1 of chart1.planets) {
    for (const planet2 of chart2.planets) {
      const long1 = getAbsoluteLongitude(planet1)
      const long2 = getAbsoluteLongitude(planet2)
      const diff = Math.abs(long1 - long2)
      const angle = Math.min(diff, 360 - diff)
      
      const aspectRanges = [
        { type: 'conjunction', angle: 0, orb: 8 },
        { type: 'sextile', angle: 60, orb: 6 },
        { type: 'square', angle: 90, orb: 8 },
        { type: 'trine', angle: 120, orb: 8 },
        { type: 'opposition', angle: 180, orb: 8 }
      ]

      for (const aspectRange of aspectRanges) {
        const diffFromAspect = Math.abs(angle - aspectRange.angle)
        if (diffFromAspect <= aspectRange.orb) {
          aspects.push({
            planet1: normalizePlanetName(planet1.name),
            planet2: normalizePlanetName(planet2.name),
            type: aspectRange.type,
            orb: diffFromAspect
          })
          break
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb)
}

function getAspectName(type: string): string {
  const names: Record<string, string> = {
    'conjunction': 'Conjunción',
    'trine': 'Trígono',
    'sextile': 'Sextil',
    'square': 'Cuadratura',
    'opposition': 'Oposición'
  }
  return names[type] || type
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  return `${day} de ${months[month - 1]} de ${year}`
}

export async function exportCompareToPDF(
  myChart: ChartData,
  otherChart: ChartData,
  myName: string,
  otherName: string
): Promise<void> {
  const affinity = calculateAffinity(myChart, otherChart)
  const myElements = calculateElements(myChart)
  const otherElements = calculateElements(otherChart)
  const myStats = calculateRPGStats(myChart)
  const otherStats = calculateRPGStats(otherChart)
  const aspects = calculateSynastryAspects(myChart, otherChart)
  
  const harmoniousAspects = aspects.filter(a => ['trine', 'sextile'].includes(a.type))
  const tenseAspects = aspects.filter(a => ['square', 'opposition'].includes(a.type))
  const conjunctions = aspects.filter(a => a.type === 'conjunction')

  const mySun = myChart.planets.find(p => 
    p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
  )
  const myMoon = myChart.planets.find(p => 
    p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
  )
  const otherSun = otherChart.planets.find(p => 
    p.name === 'Sol' || p.name === 'Sun' || p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
  )
  const otherMoon = otherChart.planets.find(p => 
    p.name === 'Luna' || p.name === 'Moon' || p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
  )

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
          background: white;
          color: #1f2937;
          line-height: 1.6;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #7c3aed;
        }
        .section h2 {
          font-size: 20px;
          color: #7c3aed;
          margin-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .person-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }
        .person-card h3 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #1f2937;
        }
        .aspect-item {
          padding: 10px;
          margin: 8px 0;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #7c3aed;
        }
        .aspect-harmonious { border-left-color: #10b981; }
        .aspect-tense { border-left-color: #ef4444; }
        .aspect-conjunction { border-left-color: #f59e0b; }
        .affinity-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin-top: 10px;
        }
        .affinity-high { background: #d1fae5; color: #065f46; }
        .affinity-medium { background: #dbeafe; color: #1e40af; }
        .affinity-low { background: #fee2e2; color: #991b1b; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }
        .stat-item {
          text-align: center;
          padding: 10px;
          background: white;
          border-radius: 6px;
        }
        .stat-label { font-size: 12px; color: #6b7280; }
        .stat-value { font-size: 18px; font-weight: bold; color: #1f2937; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Comparación de Cartas Astrales</h1>
        <p>Sinastría entre ${myName} y ${otherName}</p>
        <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">
          Generado el ${new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <!-- Grado de Afinidad -->
      <div class="section">
        <h2>💫 Grado de Afinidad</h2>
        <div class="affinity-badge affinity-${affinity.level === 'excelente' || affinity.level === 'muy buena' ? 'high' : affinity.level === 'buena' ? 'medium' : 'low'}">
          ${affinity.percentage}% - ${affinity.description}
        </div>
        <p style="margin-top: 10px; color: #6b7280;">
          Basado en aspectos entre planetas importantes y compatibilidad de elementos
        </p>
      </div>

      <!-- Signos Principales -->
      <div class="section">
        <h2>⭐ Signos Principales</h2>
        <div class="comparison-grid">
          <div class="person-card">
            <h3>${myName}</h3>
            ${mySun ? `<p><strong>☉ Sol:</strong> ${mySun.sign}</p>` : ''}
            ${myMoon ? `<p><strong>☽ Luna:</strong> ${myMoon.sign}</p>` : ''}
            ${myChart.ascendant ? `<p><strong>↑ Ascendente:</strong> ${myChart.ascendant}</p>` : ''}
            <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">
              📅 ${formatDate(myChart.birthData.date)} ${myChart.birthData.time || ''}
            </p>
            <p style="font-size: 12px; color: #6b7280;">📍 ${myChart.birthData.place}</p>
          </div>
          <div class="person-card">
            <h3>${otherName}</h3>
            ${otherSun ? `<p><strong>☉ Sol:</strong> ${otherSun.sign}</p>` : ''}
            ${otherMoon ? `<p><strong>☽ Luna:</strong> ${otherMoon.sign}</p>` : ''}
            ${otherChart.ascendant ? `<p><strong>↑ Ascendente:</strong> ${otherChart.ascendant}</p>` : ''}
            <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">
              📅 ${formatDate(otherChart.birthData.date)} ${otherChart.birthData.time || ''}
            </p>
            <p style="font-size: 12px; color: #6b7280;">📍 ${otherChart.birthData.place}</p>
          </div>
        </div>
      </div>

      <!-- Elementos -->
      <div class="section">
        <h2>🔥💧💨🌍 Distribución de Elementos</h2>
        <div class="comparison-grid">
          <div class="person-card">
            <h3>${myName}</h3>
            <p>🔥 Fuego: ${myElements.fire}%</p>
            <p>🌍 Tierra: ${myElements.earth}%</p>
            <p>💨 Aire: ${myElements.air}%</p>
            <p>💧 Agua: ${myElements.water}%</p>
          </div>
          <div class="person-card">
            <h3>${otherName}</h3>
            <p>🔥 Fuego: ${otherElements.fire}%</p>
            <p>🌍 Tierra: ${otherElements.earth}%</p>
            <p>💨 Aire: ${otherElements.air}%</p>
            <p>💧 Agua: ${otherElements.water}%</p>
          </div>
        </div>
      </div>

      <!-- Stats RPG -->
      <div class="section">
        <h2>⚔️ Estadísticas RPG</h2>
        <div class="comparison-grid">
          <div class="person-card">
            <h3>${myName}</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">INT</div>
                <div class="stat-value">${myStats.INT}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">WIS</div>
                <div class="stat-value">${myStats.WIS}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">CHA</div>
                <div class="stat-value">${myStats.CHA}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">STR</div>
                <div class="stat-value">${myStats.STR}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">DEX</div>
                <div class="stat-value">${myStats.DEX}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">CON</div>
                <div class="stat-value">${myStats.CON}</div>
              </div>
            </div>
          </div>
          <div class="person-card">
            <h3>${otherName}</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">INT</div>
                <div class="stat-value">${otherStats.INT}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">WIS</div>
                <div class="stat-value">${otherStats.WIS}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">CHA</div>
                <div class="stat-value">${otherStats.CHA}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">STR</div>
                <div class="stat-value">${otherStats.STR}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">DEX</div>
                <div class="stat-value">${otherStats.DEX}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">CON</div>
                <div class="stat-value">${otherStats.CON}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de Aspectos -->
      <div class="section">
        <h2>📐 Resumen de Aspectos de Sinastría</h2>
        <p><strong>Total de aspectos encontrados:</strong> ${aspects.length}</p>
        <p>🟢 Aspectos armónicos (trígono, sextil): ${harmoniousAspects.length}</p>
        <p>🔴 Aspectos tensos (cuadratura, oposición): ${tenseAspects.length}</p>
        <p>🟡 Conjunciones: ${conjunctions.length}</p>
      </div>

      <!-- Aspectos más importantes -->
      <div class="section">
        <h2>⭐ Aspectos Más Importantes (Top 15)</h2>
        ${aspects.slice(0, 15).map(aspect => {
          const isHarmonious = ['trine', 'sextile'].includes(aspect.type)
          const isTense = ['square', 'opposition'].includes(aspect.type)
          const aspectClass = isHarmonious ? 'aspect-harmonious' : isTense ? 'aspect-tense' : 'aspect-conjunction'
          return `
            <div class="aspect-item ${aspectClass}">
              <strong>${aspect.planet1}</strong> ${getAspectName(aspect.type)} <strong>${aspect.planet2}</strong>
              <span style="float: right; color: #6b7280; font-size: 12px;">Orbe: ${aspect.orb.toFixed(2)}°</span>
            </div>
          `
        }).join('')}
      </div>
    </body>
    </html>
  `

  // Crear elemento temporal
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = '210mm' // A4 width
  document.body.appendChild(tempDiv)

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const fileName = `Comparacion_${myName}_${otherName}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } finally {
    document.body.removeChild(tempDiv)
  }
}

