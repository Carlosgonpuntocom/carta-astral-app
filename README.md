# 🌟 Carta Astral Personal

Aplicación de escritorio para calcular y gestionar tu carta astral personal.

**Documentación central del ecosistema** (visión global, índice de todos los `.md` del proyecto, rol frente a `D:\services\`): en tu máquina abre `D:\services\docs\projects\CARTA_ASTRAL.md` (monorepo de servicios; no vive dentro de este repo).

**Planes activos del proyecto** (formato ecosistema):

- `docs/PLAN_AI_SERVICE.md` — integración opcional con ai-service (Ollama).
- `docs/PLAN_LOGGING_SERVICE.md` — integración opcional con logging-service (:8600).

## 📋 Instrucciones de Instalación (Paso a Paso)

### **PASO 1: Instalar Dependencias**

Abre una terminal en esta carpeta (`D:\projects\carta-astral-app`) y ejecuta:

```bash
npm install
```

**¿Qué hace esto?**
- Descarga e instala todas las librerías necesarias (React, Electron, Tailwind, etc.)
- Puede tardar 2-5 minutos la primera vez
- Verás muchos mensajes, es normal

**Si hay errores:**
- Asegúrate de tener Node.js instalado (versión 18 o superior)
- Si ves errores de permisos, ejecuta la terminal como administrador

---

### **PASO 2: Ejecutar la Aplicación**

Una vez instaladas las dependencias, puedes arrancar de cualquiera de estas formas:

**Opción A — Terminal**

```bash
npm run dev
```

**Opción B — Windows (`start.bat`)**

Haz doble clic en `start.bat` en la raíz del proyecto. Equivale a ejecutar `npm run dev` desde esa carpeta (usa la ruta del propio script, no hace falta abrir la terminal a mano).

**Acceso directo en el escritorio**

1. Clic derecho en `start.bat` → **Enviar a** → **Escritorio (crear acceso directo)**  
   o crea un acceso directo cuyo destino sea la ruta completa a `start.bat` del repo (por ejemplo `D:\projects\carta-astral-app\start.bat`).
2. La primera vez sigue siendo necesario haber ejecutado `npm install` en el proyecto (PASO 1).

**¿Qué hace esto?**
- Inicia el servidor de desarrollo
- Abre automáticamente la ventana de Electron
- Verás la aplicación funcionando

**Primera vez:**
- Puede tardar unos segundos en compilar
- Verás mensajes en la terminal, es normal
- La ventana se abrirá automáticamente

---

### **PASO 3: Usar la Aplicación**

#### **Opción A: Ver Demo (Recomendado para empezar)**
1. Haz clic en el botón **"Ver Demo"**
2. Verás la carta astral de Robe Iniesta (Extremoduro) como ejemplo
3. Esto te permite ver cómo funciona antes de usar tus datos

#### **Opción B: Ingresar Tus Datos**
1. Haz clic en el botón **"Mis Datos"**
2. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Fecha**: Tu fecha de nacimiento
   - **Hora**: Tu hora de nacimiento (importante para precisión)
   - **Lugar**: Ciudad y país donde naciste
3. Haz clic en **"Calcular Mi Carta Astral"**
4. Tu carta se guardará automáticamente en `data/chart.json`

---

## 🎯 Características Actuales

✅ **Modo DEMO**: Ver ejemplo con datos de Robe Iniesta (Extremoduro)  
✅ **Formulario de datos**: Ingresar tu información personal  
✅ **Cálculo básico**: Calcular posiciones planetarias  
✅ **Vista de carta**: Ver resultados de forma clara  
✅ **Guardado automático**: Los datos se guardan en JSON  

---

## 📁 Estructura del Proyecto

```
carta-astral-app/
├── start.bat              # Arranque en Windows (doble clic o acceso directo)
├── src/
│   ├── main/              # Proceso principal de Electron
│   ├── preload/           # Scripts de preload (seguridad)
│   ├── renderer/          # Aplicación React
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Librerías y utilidades
│   │   └── types/          # Tipos TypeScript
│   └── shared/            # Código compartido
├── data/                  # Datos guardados (JSON)
└── package.json           # Configuración del proyecto
```

---

## 🛠️ Comandos Disponibles

- `start.bat` (Windows) - Inicia la app en modo desarrollo; mismo efecto que `npm run dev` desde la raíz del proyecto
- `npm run dev` - Inicia la aplicación en modo desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción

---

## ⚠️ Notas Importantes

1. **Datos personales**: Todo se guarda localmente en tu PC, nada se envía a internet
2. **Primera ejecución**: La primera vez puede tardar más en compilar
3. **Modo desarrollo**: Verás la consola de desarrollador abierta (F12), es normal
4. **Guardado**: Los datos se guardan automáticamente en `data/chart.json`

---

## 🐛 Solución de Problemas

### **Error: "npm no se reconoce"** (también al usar `start.bat`)
- Instala Node.js desde [nodejs.org](https://nodejs.org/)
- Si al hacer doble clic en `start.bat` falla pero en una terminal abierta desde el IDE sí funciona, Node puede no estar en el PATH del Explorador de archivos: reinstala Node marcando la opción de añadir al PATH o reinicia sesión

### **Error al instalar dependencias**
- Ejecuta la terminal como administrador
- O intenta: `npm install --legacy-peer-deps`

### **La ventana no se abre**
- Revisa la terminal para ver errores
- Asegúrate de estar en la carpeta correcta

### **No veo mis datos guardados**
- Los datos están en `data/chart.json`
- Si no existe, créalo manualmente o ingresa tus datos de nuevo

---

## 🚀 Próximos Pasos

- [ ] Integrar cálculos reales con astrology.js
- [ ] Vista de carta circular (SVG)
- [ ] Dashboard de tránsitos diarios
- [ ] Diario astrológico
- [ ] Compatibilidades con otras personas

---

**¡Disfruta explorando tu carta astral!** ✨

