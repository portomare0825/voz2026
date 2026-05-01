# 🧪 Guía de Prueba - Etiquetas y Estilos

## ⚠️ IMPORTANTE: Limitaciones de Web Speech API

Las voces de Web Speech API son **sintéticas** y pueden sonar robotizadas. Esto es normal y depende del sistema operativo y navegador. Sin embargo, los **estilos y etiquetas SÍ funcionan** modificando:
- **Velocidad** (rate): Más rápido o lento
- **Tono** (pitch): Más agudo o grave  
- **Volumen** (volume): Más fuerte o suave

## 🎭 Prueba de Estilos

### 1. Estilo Natural 😊
```
Texto: "Hola, esto es una prueba de voz natural"
Configuración: Velocidad=1.0, Tono=1.0
```

### 2. Estilo Alegre 😄
```
Texto: "Hola, esto es una prueba de voz alegre"
Configuración: Velocidad=1.25, Tono=1.35
```
**Deberías escuchar:** Voz más rápida y aguda, animada

### 3. Estilo Triste 😢
```
Texto: "Hola, esto es una prueba de voz triste"
Configuración: Velocidad=0.75, Tono=0.70
```
**Deberías escuchar:** Voz más lenta y grave, melancólica

### 4. Estilo Susurrar 🤫
```
Texto: "Hola, esto es una prueba de voz susurrada"
Configuración: Velocidad=0.7, Tono=0.85
```
**Deberías escuchar:** Voz más lenta, suave y baja

### 5. Estilo Storyteller 📖
```
Texto: "Érase una vez, en un lugar muy lejano"
Configuración: Velocidad=0.9, Tono=1.15
```
**Deberías escuchar:** Voz pausada, narrativa y envolvente

## 🏷️ Prueba de Etiquetas

### Prueba 1: [grito]
```
Texto: "Esto es normal [grito] pero ahora estoy gritando"
```
**Efecto:** La parte después de [grito] será más rápida (1.3x), más aguda (1.4x)

### Prueba 2: [triste]
```
Texto: "Estoy hablando normal [triste] pero ahora estoy muy triste"
```
**Efecto:** La parte después de [triste] será más lenta (0.7x), más grave (0.75x)

### Prueba 3: [secreto]
```
Texto: "Esto es público [secreto] pero esto es un secreto"
```
**Efecto:** La parte después de [secreto] será muy suave (vol=0.4) y lenta

### Prueba 4: [pausa]
```
Texto: "Primera parte [pausa] segunda parte después de la pausa"
```
**Efecto:** Pausa visual con "..." (la duración depende del sintetizador)

### Prueba 5: [sorpresa]
```
Texto: "Todo normal [sorpresa] ¡esto es sorprendente!"
```
**Efecto:** Se agrega "¡Ay!" y tono más agudo (1.3x)

### Prueba 6: Combinación
```
Texto: "Estoy normal [grito] ¡GRITANDO! [triste] ahora triste [secreto] y susurrando"
```

## 🔬 Cómo Verificar que Funcionan

1. **Abre la consola** (F12)
2. **Cambia el estilo** - Deberías ver:
   ```
   🎨 CAMBIANDO ESTILO A: HAPPY
      😄 ALEGRE: Tono=1.35, Velocidad=1.25x
   ```
3. **Genera voz** - Deberías ver:
   ```
   🎭 ESTILO SELECCIONADO: happy
   📊 Configuración inicial: vel=1.25, tono=1.35
   🏷️ PROCESANDO ETIQUETAS ESPECIALES:
   🎨 APLICANDO MODIFICADORES DE ETIQUETAS:
   ✅ CONFIGURACIÓN FINAL: vel=1.63, tono=1.89, vol=100%
   ```

## ⚡ Truco para Notar las Diferencias

**Prueba A/B:**
1. Genera el MISMO texto con estilo **Natural**
2. Genera el MISMO texto con estilo **Triste**
3. Compara: Deberías notar claramente la diferencia en velocidad y tono

## 💡 Consejos para Mejorar la Calidad

### Opción 1: Instalar Voces de Mejor Calidad (Windows)
1. Ve a **Configuración** → **Hora e idioma** → **Voz**
2. Haz clic en **Agregar voces**
3. Busca "Español" e instala voces adicionales
4. Las voces de **Microsoft** suelen ser mejores
5. Refresca la página después de instalar

### Opción 2: Usar Chrome en lugar de Edge
- Chrome tiene mejor soporte para Web Speech API
- Las voces de Google suelen ser más naturales

### Opción 3: Ajustar Velocidad y Tono Manualmente
- **Velocidad 0.8-0.9**: Hace la voz más clara y menos robotizada
- **Tono 0.9-1.1**: Rango más natural
- Evita extremos (muy rápido o muy agudo)

## 🎯 Prueba Recomendada

1. **Estilo Natural** con velocidad 0.9 y tono 1.0
   - Texto: "Hola, esta es la configuración más natural"

2. **Estilo Triste** 
   - Texto: "Hoy es un día gris y melancólico"

3. **Con etiqueta [grito]**
   - Texto: "Hablando normal [grito] ¡AHORA ESTOY GRITANDO!"

4. **Comparar** los tres audios

## ❓ ¿Qué Esperar?

**SÍ funciona:**
- ✅ Cambios de velocidad (rápido vs lento)
- ✅ Cambios de tono (agudo vs grave)
- ✅ Cambios de volumen (fuerte vs suave)
- ✅ Inserción de texto (risas, exclamaciones)

**Limitaciones:**
- ⚠️ Las voces siguen siendo sintéticas
- ⚠️ No hay emociones reales de IA
- ⚠️ La calidad depende del sistema operativo
- ⚠️ [pausa] puede no hacer pausa exacta de 2 segundos

**Si las etiquetas no funcionan:**
- Revisa la consola para ver si se detectaron
- Verifica que la ortografía sea exacta: `[grito]` no `[Grito]`
- Prueba con un texto muy corto primero