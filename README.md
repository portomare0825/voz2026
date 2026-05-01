# 🎙️ Voz - Generador de Voz con Inteligencia Artificial

Una aplicación web moderna y avanzada de **Text-to-Speech (TTS)** que convierte texto en voz de forma natural sin necesidad de API Keys.

## ⚠️ IMPORTANTE: Cómo Ejecutar la Aplicación

Debido a restricciones de seguridad del navegador, **NO abras el archivo index.html directamente** desde el explorador de archivos. En su lugar:

### Método 1: Usando el Servidor Local (Recomendado)

1. **Haz doble clic en `iniciar.bat`**
2. Se abrirá una ventana de terminal
3. Abre tu navegador y ve a: **http://localhost:3000**
4. ¡Listo! La aplicación funcionará correctamente

### Método 2: Usando Live Server en VS Code

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### Método 3: Usando Python (si no tienes Node.js)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abre: **http://localhost:8000**

## ✨ Características Principales

### 🎯 Sin Dependencias Externas
- **No requiere API Key** - Funciona completamente en el navegador usando Web Speech API
- **Privacidad total** - Todo el procesamiento se realiza localmente
- **Sin costos** - Completamente gratuito

### 🎭 Selección de Voces
- **10 voces diferentes**: 5 masculinas y 5 femeninas
- Nombres auténticos: Carlos, Miguel, Javier, Diego, Andrés, María, Carmen, Sofía, Valentina, Isabella

### 🌍 Acentos en Español
- **España** 🇪 - Acento castellano
- **México** 🇲🇽 - Acento mexicano
- **Argentina** 🇦🇷 - Acento argentino

### 🎨 Estilos de Habla
- **Natural** 😊 - Tono conversacional estándar
- **Alegre** 😄 - Voz animada y energética
- **Triste** 😢 - Tono melancólico y pausado
- **Susurrar** 🤫 - Voz suave y confidencial
- **Storyteller** 📖 - Narración envolvente

### ⚡ Controles Avanzados

#### Velocidad
- Rango: 0.5x a 2.0x
- Control deslizante preciso
- Ajuste en tiempo real

#### Tono
- Rango amplio: 0.1 a 2.0
- Incrementos de 0.05 para precisión
- Desde muy grave hasta muy agudo

### 🏷️ Etiquetas Especiales

La aplicación soporta etiquetas avanzadas que modifican la expresión de la voz:

| Etiqueta | Efecto |
|----------|--------|
| `[pausa]` | Pausa de 2 segundos en la lectura |
| `[risa]` | Inserta una risa natural |
| `[grito]` | Habla enérgica, exclamativa y en voz alta |
| `[llanto]` | Voz quebrada como si estuviera llorando |
| `[sorpresa]` | Tono sorprendido y asombrado |
| `[triste]` | Tono melancólico o decaído |
| `[secreto]` | Tono confidencial y susurrado |
| `[drama]` | Tono dramático y teatral |

### 📚 Historial Completo
- Almacenamiento automático de los últimos 20 audios generados
- Información detallada de cada generación
- Opciones de reproducción y descarga
- Persistencia con LocalStorage

## 🚀 Cómo Usar

### Instalación
1. Descarga o clona el repositorio
2. **Ejecuta `iniciar.bat`** (Windows) o usa uno de los métodos alternativos arriba
3. Abre **http://localhost:3000** en tu navegador
4. ¡Listo! No se necesita instalación ni configuración adicional

### Uso Básico
1. **Escribe el texto** en el área de texto principal
2. **Selecciona la voz** deseada del menú desplegable
3. **Elige el acento** (España, México o Argentina)
4. **Selecciona el estilo** que prefieras
5. **Ajusta velocidad y tono** según tus preferencias
6. **Haz clic en "Generar Voz"** para escuchar el resultado

### Uso de Etiquetas Especiales

Puedes insertar etiquetas especiales en tu texto para modificar la expresión:

```
Hola, ¿cómo estás? [pausa] Me alegro mucho de verte. [risa]
¡Esto es increíble! [grito] No puedo creerlo. [sorpresa]
```

### Ejemplos de Uso

#### Ejemplo 1: Narración de Cuento
```
Érase una vez... [pausa] En un bosque muy lejano, vivía un pequeño zorro. 
[secreto] Pero nadie sabía su verdadero nombre...
```

Configuración recomendada:
- Estilo: Storyteller
- Velocidad: 0.9x
- Tono: 1.1

#### Ejemplo 2: Mensaje Alegre
```
¡Felicitaciones! [sorpresa] Has ganado el premio mayor. [risa] 
Estamos muy contentos por ti. [grito]
```

Configuración recomendada:
- Estilo: Alegre
- Velocidad: 1.2x
- Tono: 1.3

#### Ejemplo 3: Mensaje Emotivo
```
[triste] Extraño mucho los momentos que compartimos. [pausa] 
Ojalá pudieras estar aquí conmigo...
```

Configuración recomendada:
- Estilo: Triste
- Velocidad: 0.85x
- Tono: 0.8

## 🎛️ Guía de Configuración

### Voces Masculinas
- **Carlos** - Voz española madura y profesional
- **Miguel** - Voz española joven y dinámica
- **Javier** - Voz mexicana cálida y amigable
- **Diego** - Voz argentina con carácter
- **Andrés** - Voz mexicana versátil

### Voces Femeninas
- **María** - Voz española elegante y clara
- **Carmen** - Voz española dulce y expresiva
- **Sofía** - Voz mexicana vibrante y alegre
- **Valentina** - Voz argentina apasionada
- **Isabella** - Voz mexicana suave y melodiosa

### Combinaciones Recomendadas

| Uso | Voz | Estilo | Velocidad | Tono |
|-----|-----|--------|-----------|------|
| Presentaciones | Carlos/María | Natural | 1.0x | 1.0 |
| Cuentos infantiles | Sofía/Andrés | Storyteller | 0.9x | 1.1 |
| Noticias | Javier/Carmen | Natural | 1.1x | 1.0 |
| Meditación | Valentina/Diego | Susurrar | 0.8x | 0.9 |
| Publicidad | Isabella/Javier | Alegre | 1.2x | 1.2 |

## 💾 Descargar Audios

La aplicación permite descargar la información de cada audio generado:
- Haz clic en el botón **"Descargar"** en el historial
- Se descargará un archivo con todos los parámetros utilizados
- Puedes usar esta información para replicar la configuración

## 🔧 Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Edge (Recomendado) - Mejor calidad de voces
- ✅ Firefox - Buen soporte
- ✅ Safari - Soporte básico
- ⚠️ Opera - Soporte variable

### Requisitos
- Navegador moderno con soporte para Web Speech API
- Conexión a Internet (para cargar fuentes de Google)
- Altavoces o auriculares
- **Servidor HTTP local** (incluido en el proyecto)

## 🎨 Diseño

La interfaz presenta:
- **Tema oscuro moderno** con gradientes atractivos
- **Animaciones suaves** y transiciones elegantes
- **Diseño responsive** - Funciona en móvil, tablet y escritorio
- **Indicadores visuales** claros y badges informativos
- **Controles intuitivos** con sliders interactivos

## 📝 Notas Técnicas

### Web Speech API
La aplicación utiliza la **Web Speech API** nativa del navegador, específicamente:
- `SpeechSynthesis` - Motor de síntesis de voz
- `SpeechSynthesisUtterance` - Configuración de cada utterance
- `SpeechSynthesisVoice` - Voces disponibles en el sistema

### Procesamiento de Etiquetas
Las etiquetas especiales son procesadas mediante:
- Reemplazo de patrones en el texto
- Modificación dinámica de parámetros (velocidad, tono, volumen)
- Inserción de efectos de sonido simulados

### Almacenamiento
- **LocalStorage** - Historial de audios generados
- Máximo 20 elementos en el historial
- Datos persistentes entre sesiones

## 🐛 Solución de Problemas

### "Unsafe attempt to load URL file:///" 
**Problema:** Estás abriendo el archivo directamente desde el explorador de archivos.

**Solución:** 
1. Cierra la pestaña actual
2. Ejecuta `iniciar.bat`
3. Abre http://localhost:3000 en tu navegador

### No se escuchan las voces
1. Verifica que el volumen del sistema esté activado
2. Comprueba que el navegador tenga permiso para reproducir audio
3. Prueba con otro navegador
4. Refresca la página (F5)

### Las voces tardan en cargar
- Espera unos segundos después de abrir la aplicación
- Refresca la página si es necesario
- Algunas voces pueden depender del sistema operativo

### Calidad de voz limitada
- La calidad depende del navegador y sistema operativo
- Chrome/Edge suelen ofrecer mejor calidad
- Considera actualizar tu navegador

## 📄 Licencia

Este proyecto es de código abierto y puede ser utilizado libremente para fines educativos y personales.

## 🌟 Futuras Mejoras

- [ ] Exportación directa a MP3/WAV
- [ ] Más idiomas y acentos
- [ ] Editor de texto enriquecido
- [ ] Plantillas predefinidas
- [ ] Modo batch para múltiples textos
- [ ] Integración con servicios de IA opcionales

---

**Desarrollado con ❤️ usando tecnologías web modernas**

*Nota: Esta aplicación funciona completamente en el navegador sin necesidad de servidores externos o API Keys. Sin embargo, requiere un servidor HTTP local para funcionar correctamente debido a las restricciones de seguridad del navegador.*