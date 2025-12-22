# 📋 INSTRUCCIONES PASO A PASO - CARTA ASTRAL APP

## ✅ **PASO 1: Verificar que estás en la carpeta correcta**

Abre una terminal (PowerShell o CMD) y ejecuta:

```bash
cd D:\projects\carta-astral-app
```

**¿Cómo saber si estás en la carpeta correcta?**
- Deberías ver `D:\projects\carta-astral-app` en tu terminal
- Si ejecutas `dir` (o `ls`), deberías ver archivos como `package.json`, `src`, etc.

---

## ✅ **PASO 2: Instalar dependencias (SI NO LO HAS HECHO)**

Ejecuta este comando:

```bash
npm install
```

**¿Qué hace esto?**
- Descarga e instala todas las librerías necesarias
- Puede tardar 2-5 minutos la primera vez
- Verás muchos mensajes, es normal

**¿Cuándo está listo?**
- Verás un mensaje como "added 215 packages"
- No deberías ver errores en rojo
- Si ves "vulnerabilities", es normal, no es crítico

**Si hay errores:**
- Asegúrate de tener Node.js instalado (versión 18+)
- Si ves errores de permisos, ejecuta la terminal como administrador

---

## ✅ **PASO 3: Ejecutar la aplicación**

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

**¿Qué hace esto?**
- Compila el proyecto (puede tardar 30-60 segundos la primera vez)
- Inicia el servidor de desarrollo
- Abre automáticamente una ventana de Electron con la aplicación

**Primera vez:**
- Verás muchos mensajes en la terminal, es normal
- La ventana puede tardar unos segundos en abrirse
- Verás la consola de desarrollador abierta (es normal en desarrollo)

**¿Cómo saber que funciona?**
- Deberías ver una ventana con el título "Carta Astral Personal"
- Verás dos botones grandes: "Ver Demo" y "Mis Datos"
- Si ves esto, ¡todo está funcionando! ✅

---

## ✅ **PASO 4: Probar la aplicación**

### **Opción A: Ver Demo (RECOMENDADO PRIMERO)**

1. Haz clic en el botón **"Ver Demo"** (botón morado/azul)
2. Espera 1-2 segundos (verás un spinner de carga)
3. Deberías ver la carta astral de Robe Iniesta (Extremoduro)
4. Verás:
   - Su nombre y fecha de nacimiento
   - Ascendente y Medio Cielo
   - Lista de planetas con sus signos

**¿Por qué empezar con Demo?**
- Te permite ver cómo funciona sin usar tus datos
- Es más rápido (no necesitas escribir nada)
- Puedes comparar con ejemplos online si quieres

---

### **Opción B: Ingresar Tus Datos**

1. Haz clic en el botón **"Mis Datos"** (botón blanco)
2. Completa el formulario:
   - **Nombre**: Escribe tu nombre
   - **Fecha de nacimiento**: Selecciona tu fecha (formato: DD/MM/YYYY)
   - **Hora de nacimiento**: Escribe tu hora (formato: HH:MM, ejemplo: 14:30)
   - **Lugar de nacimiento**: Escribe ciudad y país (ejemplo: "Madrid, España")
3. Haz clic en **"Calcular Mi Carta Astral"**
4. Espera 1-2 segundos
5. Verás tu carta astral calculada
6. **IMPORTANTE**: Tus datos se guardan automáticamente en `data/chart.json`

**Nota sobre la hora:**
- La hora es MUY importante para calcular el Ascendente correctamente
- Si no sabes la hora exacta, usa 12:00 (mediodía) como aproximación
- Puedes cambiarla después cuando sepas la hora exacta

---

## ✅ **PASO 5: Navegar en la aplicación**

### **Botón "Volver al inicio"**
- Aparece cuando estás viendo una carta o el formulario
- Te lleva de vuelta a la pantalla principal con los dos botones

### **Guardado automático**
- Cuando ingresas tus datos, se guardan automáticamente
- La próxima vez que abras la app, verás tu carta directamente
- Los datos están en: `D:\projects\carta-astral-app\data\chart.json`

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Problema: "npm no se reconoce como comando"**

**Solución:**
1. Instala Node.js desde [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (Long Term Support)
3. Instala normalmente
4. Reinicia la terminal
5. Vuelve a intentar `npm install`

---

### **Problema: Error al ejecutar `npm run dev`**

**Posibles causas:**

1. **No estás en la carpeta correcta**
   - Solución: Ejecuta `cd D:\projects\carta-astral-app` primero

2. **No has instalado dependencias**
   - Solución: Ejecuta `npm install` primero

3. **Puerto 5173 ya está en uso**
   - Solución: Cierra otras aplicaciones que usen ese puerto
   - O cambia el puerto en `electron.vite.config.ts`

---

### **Problema: La ventana no se abre**

**Solución:**
1. Revisa la terminal para ver errores
2. Busca mensajes en rojo
3. Si ves errores de TypeScript, puede ser normal (algunos warnings)
4. Si ves errores de compilación, avísame y te ayudo

---

### **Problema: No veo mis datos guardados**

**Solución:**
1. Los datos se guardan en `data/chart.json`
2. Si no existe el archivo, es porque no has ingresado datos aún
3. Ingresa tus datos de nuevo usando el botón "Mis Datos"
4. Después de calcular, el archivo se creará automáticamente

---

## 📝 **NOTAS IMPORTANTES**

1. **Datos personales**: Todo se guarda localmente en tu PC
2. **Sin internet**: La aplicación funciona completamente offline
3. **Consola de desarrollador**: En desarrollo verás la consola abierta (F12), es normal
4. **Cálculos actuales**: Por ahora usa datos simulados (en la siguiente fase integraremos cálculos reales)

---

## 🎯 **PRÓXIMOS PASOS (Futuro)**

- [ ] Integrar cálculos reales con librería de astrología
- [ ] Vista de carta circular (SVG interactivo)
- [ ] Dashboard de tránsitos diarios
- [ ] Diario astrológico
- [ ] Compatibilidades con otras personas

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

Antes de pedir ayuda, verifica:

- [ ] Estoy en la carpeta `D:\projects\carta-astral-app`
- [ ] He ejecutado `npm install` y terminó sin errores críticos
- [ ] He ejecutado `npm run dev` y la ventana se abrió
- [ ] Puedo ver los botones "Ver Demo" y "Mis Datos"
- [ ] El botón "Ver Demo" muestra la carta de Robe Iniesta (Extremoduro)
- [ ] Puedo ingresar mis datos en el formulario

Si todos estos pasos funcionan, ¡tu aplicación está lista! 🎉

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" arriba, o avísame qué error específico estás viendo.

