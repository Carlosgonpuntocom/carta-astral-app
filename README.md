# 🌟 Carta Astral Personal

Aplicación de escritorio para calcular y gestionar tu carta astral personal.

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

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

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

### **Error: "npm no se reconoce"**
- Instala Node.js desde [nodejs.org](https://nodejs.org/)

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

