import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ChartData } from '../../types/astrology'
import {
  calculateElements,
  calculateModalities,
  calculateRPGStats,
  calculateBadges,
  calculateStrengthsWeaknesses
} from '../astrology/chart-game-calculator'

// Función para formatear fecha
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  return `${day} de ${months[month - 1]} de ${year}`
}

// Función para formatear grados
function formatDegrees(decimalDegrees: number): string {
  const degreesInSign = decimalDegrees % 30
  const degrees = Math.floor(degreesInSign)
  const minutes = Math.floor((degreesInSign - degrees) * 60)
  return `${degrees}° ${minutes}'`
}

// Función para obtener el emoji del aspecto
function getAspectEmoji(aspectType: string): string {
  const emojis: Record<string, string> = {
    'conjunction': '🟡',
    'opposition': '🔴',
    'square': '🔴',
    'trine': '🟢',
    'sextile': '🟢'
  }
  return emojis[aspectType.toLowerCase()] || '⚪'
}

// Función para obtener el nombre del aspecto en español
function getAspectName(aspectType: string): string {
  const names: Record<string, string> = {
    'conjunction': 'Conjunción',
    'opposition': 'Oposición',
    'square': 'Cuadratura',
    'trine': 'Trígono',
    'sextile': 'Sextil'
  }
  return names[aspectType.toLowerCase()] || aspectType
}

export async function exportChartToPDF(chartData: ChartData): Promise<void> {
  // Calcular todos los datos necesarios
  const elements = calculateElements(chartData)
  const modalities = calculateModalities(chartData)
  const stats = calculateRPGStats(chartData)
  const badges = calculateBadges(chartData)
  const { strengths, weaknesses } = calculateStrengthsWeaknesses(chartData)

  // Encontrar Sol y Luna
  const sun = chartData.planets.find(p => 
    p.name.toLowerCase() === 'sol' || p.name.toLowerCase() === 'sun'
  )
  const moon = chartData.planets.find(p => 
    p.name.toLowerCase() === 'luna' || p.name.toLowerCase() === 'moon'
  )

  // Crear HTML para el PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
          background: white;
          color: #1f2937;
          line-height: 1.6;
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #7c3aed;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .signs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .sign-card {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #7c3aed;
        }
        .sign-card h3 {
          font-size: 16px;
          color: #7c3aed;
          margin-bottom: 5px;
        }
        .sign-card p {
          font-size: 14px;
          color: #6b7280;
        }
        .planets-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .planets-table th,
        .planets-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .planets-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .stat-card {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #7c3aed;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 5px;
        }
        .elements-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .element-card {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .element-value {
          font-size: 24px;
          font-weight: bold;
          color: #7c3aed;
        }
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 15px;
        }
        .badge {
          background: #f9fafb;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
        }
        .aspect-item {
          padding: 8px;
          margin-bottom: 5px;
          background: #f9fafb;
          border-radius: 4px;
          font-size: 13px;
        }
        .strength-item, .weakness-item {
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 14px;
        }
        .strength-item {
          background: #d1fae5;
          border-left: 4px solid #10b981;
        }
        .weakness-item {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <h1>${chartData.birthData.name}</h1>
        <p>Nacido el ${formatDate(chartData.birthData.date)} a las ${chartData.birthData.time}</p>
        <p>${chartData.birthData.place}</p>
        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
          Generado el ${new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <!-- Signos Principales -->
      <div class="section">
        <div class="section-title">🌟 Signos Principales</div>
        <div class="signs-grid">
          ${sun ? `
            <div class="sign-card">
              <h3>☉ Sol</h3>
              <p>${sun.sign} ${formatDegrees(sun.degree)}</p>
              <p style="font-size: 12px; margin-top: 5px; color: #9ca3af;">
                Tu identidad esencial, tu yo más auténtico
              </p>
            </div>
          ` : ''}
          ${moon ? `
            <div class="sign-card">
              <h3>🌙 Luna</h3>
              <p>${moon.sign} ${formatDegrees(moon.degree)}</p>
              <p style="font-size: 12px; margin-top: 5px; color: #9ca3af;">
                Tus emociones, necesidades y mundo interior
              </p>
            </div>
          ` : ''}
          ${chartData.ascendant ? `
            <div class="sign-card">
              <h3>⬆️ Ascendente</h3>
              <p>${chartData.ascendant}</p>
              <p style="font-size: 12px; margin-top: 5px; color: #9ca3af;">
                Cómo te presentas al mundo, tu máscara social
              </p>
            </div>
          ` : ''}
          ${chartData.midheaven ? `
            <div class="sign-card">
              <h3>🔝 Medio Cielo</h3>
              <p>${chartData.midheaven}</p>
              <p style="font-size: 12px; margin-top: 5px; color: #9ca3af;">
                Tu vocación, ambiciones y legado público
              </p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Stats RPG -->
      <div class="section">
        <div class="section-title">⚔️ Estadísticas RPG</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.INT.toFixed(1)}</div>
            <div class="stat-label">Intelecto</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.WIS.toFixed(1)}</div>
            <div class="stat-label">Intuición</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.CHA.toFixed(1)}</div>
            <div class="stat-label">Magnetismo</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.STR.toFixed(1)}</div>
            <div class="stat-label">Fuerza</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.DEX.toFixed(1)}</div>
            <div class="stat-label">Agilidad</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.CON.toFixed(1)}</div>
            <div class="stat-label">Constitución</div>
          </div>
        </div>
      </div>

      <!-- Elementos y Modalidades -->
      <div class="section">
        <div class="section-title">🌍 Elementos y Modalidades</div>
        <div class="elements-grid">
          <div class="element-card">
            <div class="element-value">${elements.fire.toFixed(0)}%</div>
            <div class="stat-label">🔥 Fuego</div>
          </div>
          <div class="element-card">
            <div class="element-value">${elements.earth.toFixed(0)}%</div>
            <div class="stat-label">🌍 Tierra</div>
          </div>
          <div class="element-card">
            <div class="element-value">${elements.air.toFixed(0)}%</div>
            <div class="stat-label">💨 Aire</div>
          </div>
          <div class="element-card">
            <div class="element-value">${elements.water.toFixed(0)}%</div>
            <div class="stat-label">💧 Agua</div>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <p style="margin-bottom: 10px;"><strong>Modalidades:</strong></p>
          <p>Cardinal: ${modalities.cardinal.toFixed(0)}% | Fijo: ${modalities.fixed.toFixed(0)}% | Mutable: ${modalities.mutable.toFixed(0)}%</p>
        </div>
      </div>

      <!-- Posiciones Planetarias -->
      <div class="section">
        <div class="section-title">🪐 Posiciones Planetarias</div>
        <table class="planets-table">
          <thead>
            <tr>
              <th>Planeta</th>
              <th>Signo</th>
              <th>Grados</th>
              <th>Casa</th>
            </tr>
          </thead>
          <tbody>
            ${chartData.planets.map(planet => `
              <tr>
                <td><strong>${planet.name}</strong></td>
                <td>${planet.sign}</td>
                <td>${formatDegrees(planet.degree)}</td>
                <td>${planet.house || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Aspectos -->
      ${chartData.aspects && chartData.aspects.length > 0 ? `
        <div class="section">
          <div class="section-title">🔗 Aspectos Planetarios</div>
          <div style="margin-top: 10px;">
            ${chartData.aspects.slice(0, 20).map(aspect => `
              <div class="aspect-item">
                ${getAspectEmoji(aspect.type)} <strong>${aspect.planet1}</strong> ${getAspectName(aspect.type)} <strong>${aspect.planet2}</strong>
                <span style="color: #6b7280; font-size: 11px; margin-left: 10px;">Orbe: ${aspect.orb.toFixed(1)}°</span>
              </div>
            `).join('')}
            ${chartData.aspects.length > 20 ? `
              <p style="margin-top: 10px; color: #6b7280; font-size: 12px;">
                ... y ${chartData.aspects.length - 20} aspectos más
              </p>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Badges -->
      ${badges.length > 0 ? `
        <div class="section">
          <div class="section-title">🏆 Logros y Características</div>
          <div class="badges-grid">
            ${badges.map(badge => `
              <div class="badge">
                ${badge.icon} ${badge.title}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Fortalezas y Áreas de Crecimiento -->
      <div class="section">
        <div class="section-title">💪 Fortalezas</div>
        <div style="margin-top: 10px;">
          ${strengths.map(strength => `
            <div class="strength-item">
              <strong>${strength.title}</strong><br>
              ${strength.description}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">🌱 Áreas de Crecimiento</div>
        <div style="margin-top: 10px;">
          ${weaknesses.map(weakness => `
            <div class="weakness-item">
              <strong>${weakness.title}</strong><br>
              ${weakness.description}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Generado por Carta Astral App</p>
        <p>Este documento contiene información astrológica personalizada</p>
      </div>
    </body>
    </html>
  `

  // Crear un elemento temporal para renderizar el HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  tempDiv.style.position = 'fixed'
  tempDiv.style.top = '0'
  tempDiv.style.left = '0'
  tempDiv.style.width = '794px' // A4 width in pixels at 96 DPI
  tempDiv.style.backgroundColor = 'white'
  tempDiv.style.zIndex = '9999'
  tempDiv.style.overflow = 'visible'
  document.body.appendChild(tempDiv)

  // Esperar un momento para que el DOM se renderice
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // Convertir HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      height: tempDiv.scrollHeight,
      windowWidth: 794,
      windowHeight: tempDiv.scrollHeight,
      backgroundColor: '#ffffff'
    })

    // Crear PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    // Calcular dimensiones para ajustar a A4
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgScaledWidth = imgWidth * ratio
    const imgScaledHeight = imgHeight * ratio

    // Si el contenido es más alto que una página, dividirlo en múltiples páginas
    const pageHeight = pdfHeight
    let heightLeft = imgScaledHeight
    let position = 0

    // Primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
    heightLeft -= pageHeight

    // Páginas adicionales si es necesario
    while (heightLeft > 0) {
      position = heightLeft - imgScaledHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgScaledWidth, imgScaledHeight)
      heightLeft -= pageHeight
    }

    // Descargar PDF
    const fileName = `Carta_Astral_${chartData.birthData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('Error al generar PDF:', error)
    throw error
  } finally {
    // Limpiar siempre, incluso si hay error
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
    }
  }
}

