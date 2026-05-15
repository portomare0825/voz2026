// Clase principal para la aplicación TTS
class TextToSpeechApp {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.history = this.loadHistory();
        this.audioContext = null;
        this.isSpeaking = false;
        this.shouldStop = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.estimatedDuration = 0;
        this.progressInterval = null;
        
        // Configuración de voces predefinidas con mapeo a voces reales del sistema
        this.voiceProfiles = [
            { name: 'Carlos', gender: 'male', accent: 'spain', description: 'Voz masculina española', voiceKeywords: ['pablo', 'jorge', 'enrique', 'carlos'] },
            { name: 'Miguel', gender: 'male', accent: 'spain', description: 'Voz masculina española', voiceKeywords: ['miguel', 'pablo', 'jorge'] },
            { name: 'Javier', gender: 'male', accent: 'mexico', description: 'Voz masculina mexicana', voiceKeywords: ['javier', 'raul', 'mexico'] },
            { name: 'Diego', gender: 'male', accent: 'argentina', description: 'Voz masculina argentina', voiceKeywords: ['diego', 'argentina'] },
            { name: 'Andrés', gender: 'male', accent: 'mexico', description: 'Voz masculina mexicana', voiceKeywords: ['andres', 'raul', 'carlos'] },
            { name: 'María', gender: 'female', accent: 'spain', description: 'Voz femenina española', voiceKeywords: ['helena', 'monica', 'maria'] },
            { name: 'Carmen', gender: 'female', accent: 'spain', description: 'Voz femenina española', voiceKeywords: ['carmen', 'monica', 'elena'] },
            { name: 'Sofía', gender: 'female', accent: 'mexico', description: 'Voz femenina mexicana', voiceKeywords: ['sofia', 'sandra', 'mexico'] },
            { name: 'Valentina', gender: 'female', accent: 'argentina', description: 'Voz femenina argentina', voiceKeywords: ['valentina', 'victoria', 'argentina'] },
            { name: 'Isabella', gender: 'female', accent: 'mexico', description: 'Voz femenina mexicana', voiceKeywords: ['isabella', 'lucia', 'paulina'] }
        ];
        
        // Mapeo de voces reales asignadas
        this.voiceMapping = {};

        this.init();
    }

    async init() {
        console.log('\n🎙️ INICIALIZANDO APLICACIÓN VOZ TTS');
        console.log('═══════════════════════════════════════');
        
        this.cacheDOMElements();
        this.bindEvents();
        
        // Verificar soporte del navegador
        if (!window.speechSynthesis) {
            console.error('❌ TU NAVEGADOR NO SOPORTA Web Speech API');
            this.showStatus('❌ Tu navegador no soporta síntesis de voz', 'error');
            return;
        }
        
        console.log('✅ Web Speech API soportada');
        console.log('Navegador:', navigator.userAgent);
        console.log('═══════════════════════════════════════\n');
        
        await this.loadVoices();
        this.renderHistory();
        this.updateUI();
        this.updatePlayPauseButtonState(); // Estado inicial del botón
        this.loadVersionInfo(); // Cargar la versión de la aplicación
        
        console.log('✅ APLICACIÓN LISTA PARA USAR\n');
    }

    async loadVersionInfo() {
        // La versión ahora se inyecta directamente en index.html 
        // a través de generate-version.js durante la compilación.
        // Ya no es necesario hacer peticiones fetch.
    }

    cacheDOMElements() {
        this.textInput = document.getElementById('textInput');
        this.voiceSelector = document.getElementById('voiceSelector');
        this.accentSelector = document.getElementById('accentSelector');
        this.styleSelector = document.getElementById('styleSelector');
        this.speedControl = document.getElementById('speedControl');
        this.pitchControl = document.getElementById('pitchControl');
        this.volumeControl = document.getElementById('volumeControl');
        this.speedValue = document.getElementById('speedValue');
        this.pitchValue = document.getElementById('pitchValue');
        this.volumeValue = document.getElementById('volumeValue');
        this.voiceGender = document.getElementById('voiceGender');
        this.voiceAccent = document.getElementById('voiceAccent');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.playPauseText = document.getElementById('playPauseText');
        this.stopBtn = document.getElementById('stopBtn');
        this.diagnosticBtn = document.getElementById('diagnosticBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.plainTextBtn = document.getElementById('plainTextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.statusMessage = document.getElementById('statusMessage');
        this.statusText = document.getElementById('statusText');
        this.historyList = document.getElementById('historyList');
        
        // Modal elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.configModal = document.getElementById('configModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.appVersionInfo = document.getElementById('appVersionInfo');
    }

    bindEvents() {
        this.voiceSelector.addEventListener('change', () => this.onVoiceChange());
        this.accentSelector.addEventListener('change', () => this.filterVoicesByAccent());
        this.styleSelector.addEventListener('change', () => this.applyStyleSettings());
        this.speedControl.addEventListener('input', () => this.updateSliderValues());
        this.pitchControl.addEventListener('input', () => this.updateSliderValues());
        this.volumeControl.addEventListener('input', () => this.updateSliderValues());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.stopBtn.addEventListener('click', () => this.stopSpeech());
        this.diagnosticBtn.addEventListener('click', () => this.audioDiagnostic());
        this.copyBtn.addEventListener('click', () => this.copyText());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.plainTextBtn.addEventListener('click', () => this.stripToPlainText());
        
        // Habilitar/deshabilitar botón play según el texto
        this.textInput.addEventListener('input', () => this.updatePlayPauseButtonState());
        this.textInput.addEventListener('paste', () => setTimeout(() => this.updatePlayPauseButtonState(), 0));
        
        // Modal events
        this.settingsBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.configModal.addEventListener('click', (e) => {
            if (e.target === this.configModal) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.configModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevenir scroll de la página de fondo
    }

    closeModal() {
        this.configModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    async loadVoices() {
        console.log('🔊 Cargando voces disponibles...');
        
        return new Promise((resolve) => {
            const loadVoices = () => {
                this.voices = this.synth.getVoices();
                
                if (this.voices.length > 0) {
                    console.log(`✅ ${this.voices.length} voces cargadas:`);
                    this.voices.forEach((voice, index) => {
                        console.log(`  ${index + 1}. ${voice.name} (${voice.lang})`);
                    });
                    
                    // Mapear voces reales a perfiles
                    this.mapVoicesToProfiles();
                    
                    this.populateVoiceSelector();
                    resolve();
                } else {
                    console.warn('⚠️ No hay voces disponibles aún, reintentando...');
                }
            };
            
            // Intentar cargar voces inmediatamente
            loadVoices();
            
            // Si no hay voces, esperar al evento
            if (this.voices.length === 0) {
                this.synth.onvoiceschanged = () => {
                    loadVoices();
                    resolve();
                };
                
                // Timeout de seguridad después de 3 segundos
                setTimeout(() => {
                    if (this.voices.length === 0) {
                        console.error('❌ No se pudieron cargar las voces después de 3 segundos');
                        this.showStatus('❌ No se encontraron voces en tu navegador', 'error');
                    }
                    resolve();
                }, 3000);
            }
        });
    }

    mapVoicesToProfiles() {
        console.log('\n🗺️ MAPEANDO VOCES REALES A PERFILES...');
        
        // Limpiar mapeo anterior
        this.voiceMapping = {};
        
        // Voces en español disponibles
        const spanishVoices = this.voices.filter(v => v.lang.startsWith('es'));
        
        // Para cada perfil, buscar la mejor voz real
        this.voiceProfiles.forEach((profile, index) => {
            console.log(`\nBuscando voz para perfil: ${profile.name} (${profile.accent})`);
            
            // Filtrar voces por acento
            const accentLang = this.getLanguageForAccent(profile.accent);
            const accentVoices = spanishVoices.filter(v => v.lang === accentLang);
            
            console.log(`  Voces disponibles para ${accentLang}: ${accentVoices.length}`);
            
            if (accentVoices.length > 0) {
                // Si hay múltiples voces del mismo acento, asignar por índice
                const voiceIndex = index % accentVoices.length;
                const assignedVoice = accentVoices[voiceIndex];
                
                this.voiceMapping[index] = assignedVoice;
                console.log(`  ✅ Asignada: ${assignedVoice.name}`);
            } else {
                // Si no hay voces del acento específico, usar cualquier voz en español
                if (spanishVoices.length > 0) {
                    const fallbackVoice = spanishVoices[0];
                    this.voiceMapping[index] = fallbackVoice;
                    console.log(`  ⚠️ Fallback a: ${fallbackVoice.name}`);
                } else {
                    console.log(`  ❌ No hay voces disponibles`);
                }
            }
        });
        
        console.log('\n✅ MAPEO COMPLETADO');
        Object.keys(this.voiceMapping).forEach(key => {
            console.log(`  Perfil ${key} (${this.voiceProfiles[key].name}) → ${this.voiceMapping[key].name}`);
        });
    }

    populateVoiceSelector() {
        this.voiceSelector.innerHTML = '';
        
        this.voiceProfiles.forEach((profile, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${profile.name} - ${profile.description}`;
            option.dataset.gender = profile.gender;
            option.dataset.accent = profile.accent;
            this.voiceSelector.appendChild(option);
        });

        // Seleccionar primera voz por defecto
        if (this.voiceSelector.options.length > 0) {
            this.voiceSelector.selectedIndex = 0;
            this.onVoiceChange();
        }
    }

    filterVoicesByAccent() {
        const selectedAccent = this.accentSelector.value;
        const options = Array.from(this.voiceSelector.options);
        
        options.forEach((option, index) => {
            const profile = this.voiceProfiles[index];
            if (selectedAccent === 'all' || profile.accent === selectedAccent) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });

        // Seleccionar la primera voz visible
        const firstVisible = options.find(opt => opt.style.display !== 'none');
        if (firstVisible) {
            this.voiceSelector.value = firstVisible.value;
            this.onVoiceChange();
        }
    }

    onVoiceChange() {
        const selectedIndex = this.voiceSelector.selectedIndex;
        if (selectedIndex >= 0 && this.voiceProfiles[selectedIndex]) {
            const profile = this.voiceProfiles[selectedIndex];
            this.voiceGender.textContent = profile.gender === 'male' ? '👨 Hombre' : '👩 Mujer';
            this.voiceAccent.textContent = this.getAccentName(profile.accent);
        }
    }

    getAccentName(accent) {
        const accents = {
            'spain': '🇪🇸 España',
            'mexico': '🇲🇽 México',
            'argentina': '🇦🇷 Argentina'
        };
        return accents[accent] || accent;
    }

    applyStyleSettings() {
        const style = this.styleSelector.value;
        
        console.log(`\n🎨 CAMBIANDO ESTILO A: ${style.toUpperCase()}`);
        
        // Aplicar configuraciones según el estilo - MÁS EXTREMAS para que se note
        switch (style) {
            case 'happy':
                this.pitchControl.value = 1.35;
                this.speedControl.value = 1.25;
                console.log('   😄 ALEGRE: Tono=1.35 (más agudo), Velocidad=1.25x (rápido)');
                console.log('   → Voz animada, energética y alegre');
                break;
            case 'sad':
                this.pitchControl.value = 0.7;
                this.speedControl.value = 0.75;
                console.log('   😢 TRISTE: Tono=0.70 (grave), Velocidad=0.75x (lento)');
                console.log('   → Voz melancólica, pausada y decaída');
                break;
            case 'whisper':
                this.pitchControl.value = 0.85;
                this.speedControl.value = 0.7;
                console.log('   🤫 SUSURRAR: Tono=0.85 (suave), Velocidad=0.7x (muy lento)');
                console.log('   → Voz baja, íntima y susurrada');
                break;
            case 'storyteller':
                this.pitchControl.value = 1.15;
                this.speedControl.value = 0.9;
                console.log('   📖 STORYTELLER: Tono=1.15 (moderado), Velocidad=0.9x (pausado)');
                console.log('   → Voz narrativa, envolvente y expresiva');
                break;
            case 'natural':
                this.pitchControl.value = 1.0;
                this.speedControl.value = 1.0;
                console.log('   😊 NATURAL: Tono=1.00 (normal), Velocidad=1.0x (normal)');
                console.log('   → Voz conversacional estándar');
                break;
        }
        
        // Actualizar visualización de valores
        this.updateSliderValues();
        
        // Feedback visual al usuario
        const styleNames = {
            'natural': '😊 Natural',
            'happy': '😄 Alegre',
            'sad': '😢 Triste',
            'whisper': '🤫 Susurrar',
            'storyteller': '📖 Storyteller'
        };
        
        this.showStatus(`✅ Estilo "${styleNames[style]}" aplicado - Los ajustes se aplicarán al generar`, 'success');
        setTimeout(() => this.hideStatus(), 2500);
    }

    updateSliderValues() {
        const speed = parseFloat(this.speedControl.value).toFixed(1);
        const pitch = parseFloat(this.pitchControl.value).toFixed(2);
        const volume = Math.round(parseFloat(this.volumeControl.value) * 100);
        
        this.speedValue.textContent = speed;
        this.pitchValue.textContent = pitch;
        this.volumeValue.textContent = volume + '%';
        
        console.log(`🎛️ Controles actualizados - Velocidad: ${speed}x, Tono: ${pitch}, Volumen: ${volume}%`);
    }

    // Diagnóstico completo de audio
    async audioDiagnostic() {
        console.log('\n╔══════════════════════════════════════════╗');
        console.log('║  🔬 DIAGNÓSTICO COMPLETO DE AUDIO 🔬    ║');
        console.log('╚══════════════════════════════════════════╝\n');
        
        // 1. Verificar Web Speech API
        console.log('1️⃣ VERIFICANDO WEB SPEECH API...');
        if (!window.speechSynthesis) {
            console.error('❌ Web Speech API NO disponible');
            this.showStatus('❌ Tu navegador no soporta síntesis de voz', 'error');
            return;
        }
        console.log('✅ Web Speech API disponible');
        
        // 2. Verificar voces
        console.log('\n2️⃣ VERIFICANDO VOCES...');
        const voices = this.synth.getVoices();
        console.log(`Voces encontradas: ${voices.length}`);
        
        if (voices.length === 0) {
            console.error('❌ NO HAY VOCES DISPONIBLES');
            console.log('💡 Solución: Espera unos segundos y refresca la página');
            this.showStatus('❌ No hay voces. Refresca la página.', 'error');
            return;
        }
        
        // Mostrar voces en español
        const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
        console.log(`\nVoces en español: ${spanishVoices.length}`);
        spanishVoices.forEach((v, i) => {
            console.log(`  ${i + 1}. ${v.name} (${v.lang}) ${v.default ? '[DEFAULT]' : ''}`);
        });
        
        // 3. Mostrar mapeo de voces
        console.log('\n3️⃣ MAPEO DE PERFILES A VOCES REALES...');
        if (Object.keys(this.voiceMapping).length > 0) {
            Object.keys(this.voiceMapping).forEach(key => {
                const profile = this.voiceProfiles[key];
                const realVoice = this.voiceMapping[key];
                console.log(`  ${profile.name} (${profile.accent}) → ${realVoice.name} (${realVoice.lang})`);
            });
        } else {
            console.log('  ⚠️ No hay mapeo disponible aún');
        }
        
        // 4. Verificar perfil seleccionado actualmente
        console.log('\n4️⃣ PERFIL ACTUALMENTE SELECCIONADO...');
        const selectedIndex = this.voiceSelector.selectedIndex;
        const currentProfile = this.voiceProfiles[selectedIndex];
        const mappedVoice = this.voiceMapping[selectedIndex];
        
        console.log(`Selector índice: ${selectedIndex}`);
        console.log(`Perfil: ${currentProfile.name}`);
        console.log(`Voz mapeada: ${mappedVoice ? mappedVoice.name : 'NO MAPEADA'}`);
        
        // 5. Verificar estado del sintetizador
        console.log('\n5️⃣ ESTADO DEL SINTETIZADOR...');
        console.log('Speaking:', this.synth.speaking);
        console.log('Paused:', this.synth.paused);
        console.log('Pending:', this.synth.pending);
        
        // 6. Prueba de audio simple
        console.log('\n6️⃣ REALIZANDO PRUEBA DE AUDIO...');
        this.showStatus('🔊 Reproduciendo prueba de diagnóstico...', 'info');
        
        const testText = `Hola. Probando voz ${currentProfile.name}. Si escuchas esto, el audio funciona correctamente.`;
        
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(testText);
            
            // Usar la voz mapeada al perfil seleccionado
            if (mappedVoice) {
                utterance.voice = mappedVoice;
                console.log(`Usando voz mapeada: ${utterance.voice.name}`);
            } else if (spanishVoices.length > 0) {
                utterance.voice = spanishVoices[0];
                console.log(`Usando primera voz española: ${utterance.voice.name}`);
            }
            
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            utterance.onstart = () => {
                console.log('✅ Audio INICIADO correctamente');
                console.log('👂 ¿Escuchas la voz? Si NO la escuchas:');
                console.log('   1. Verifica el volumen de tu sistema');
                console.log('   2. Verifica que el navegador tenga permiso de audio');
                console.log('   3. Prueba con auriculares');
            };
            
            utterance.onend = () => {
                console.log('✅ Audio FINALIZADO correctamente');
                console.log('\n╔══════════════════════════════════════════╗');
                console.log('║         DIAGNÓSTICO COMPLETADO           ║');
                console.log('╚══════════════════════════════════════════╝');
                console.log('\n📋 RESULTADO:');
                console.log('- Web Speech API: ✅ Funcionando');
                console.log('- Voces disponibles: ✅', voices.length);
                console.log('- Perfiles mapeados: ✅', Object.keys(this.voiceMapping).length);
                console.log('- Reproducción: ✅ Completada');
                console.log('\n❓ ¿Escuchaste el audio?');
                console.log('   SÍ → El sistema funciona correctamente');
                console.log('   NO → Revisa volumen del sistema/navegador');
                
                this.showStatus('✅ Diagnóstico completado. Revisa la consola.', 'success');
                resolve();
            };
            
            utterance.onerror = (event) => {
                console.error('❌ Error en prueba de audio:', event.error);
                console.log('\n💡 Posibles soluciones:');
                console.log('1. Cierra y abre el navegador');
                console.log('2. Verifica chrome://settings/content/sound');
                console.log('3. Prueba en otro navegador (Chrome/Edge)');
                
                this.showStatus('❌ Error en audio: ' + event.error, 'error');
                resolve();
            };
            
            console.log('Reproduciendo prueba...');
            this.synth.speak(utterance);
        });
    }

    processSpecialTags(text) {
        // Procesar etiquetas especiales y convertirlas en modificaciones de voz
        let processedText = text;
        
        // Detectar etiquetas antes de procesar (importante para modificar parámetros)
        const hasGrito = text.includes('[grito]');
        const hasLlanto = text.includes('[llanto]');
        const hasTriste = text.includes('[triste]');
        const hasSecreto = text.includes('[secreto]');
        const hasDrama = text.includes('[drama]');
        const hasPausa = text.includes('[pausa]');
        const hasRisa = text.includes('[risa]');
        const hasSorpresa = text.includes('[sorpresa]');

        console.log('\n🏷️ PROCESANDO ETIQUETAS ESPECIALES:');
        console.log('  [pausa]:', hasPausa);
        console.log('  [risa]:', hasRisa);
        console.log('  [grito]:', hasGrito);
        console.log('  [llanto]:', hasLlanto);
        console.log('  [sorpresa]:', hasSorpresa);
        console.log('  [triste]:', hasTriste);
        console.log('  [secreto]:', hasSecreto);
        console.log('  [drama]:', hasDrama);

        // Eliminar todas las etiquetas del texto (reemplazar con espacio o nada)
        // IMPORTANTE: No usar SSML ya que no es soportado por todos los navegadores
        
        // [pausa] -> Insertar puntos suspensivos para crear pausa natural
        processedText = processedText.replace(/\[pausa\]/gi, '...');
        
        // [risa] -> Texto que simula risa
        processedText = processedText.replace(/\[risa\]/gi, ' je je je');
        
        // [grito] -> Se maneja con modificadores de volumen y velocidad
        processedText = processedText.replace(/\[grito\]/gi, '');
        
        // [llanto] -> Se maneja con modificadores de tono y velocidad
        processedText = processedText.replace(/\[llanto\]/gi, '');
        
        // [sorpresa] -> Insertar exclamación
        processedText = processedText.replace(/\[sorpresa\]/gi, ' ¡Ay!');
        
        // [triste] -> Se maneja con modificadores
        processedText = processedText.replace(/\[triste\]/gi, '');
        
        // [secreto] -> Se maneja con volumen reducido
        processedText = processedText.replace(/\[secreto\]/gi, '');
        
        // [drama] -> Se maneja con velocidad y tono
        processedText = processedText.replace(/\[drama\]/gi, '');

        // Limpiar espacios múltiples
        processedText = processedText.replace(/\s+/g, ' ').trim();

        console.log('Texto original:', text.substring(0, 100));
        console.log('Texto procesado:', processedText.substring(0, 100));

        return { 
            text: processedText, 
            modifiers: { hasGrito, hasLlanto, hasTriste, hasSecreto, hasDrama, hasPausa, hasRisa, hasSorpresa } 
        };
    }

    // Aplicar modificadores de etiquetas al utterance
    applyModifiersToUtterance(utterance, modifiers) {
        let speed = utterance.rate;
        let pitch = utterance.pitch;
        let volume = utterance.volume;

        console.log('\n🎨 APLICANDO MODIFICADORES DE ETIQUETAS:');
        console.log('  Configuración base: vel=' + speed + ', tono=' + pitch + ', vol=' + volume);

        // [grito] -> Voz más fuerte, rápida y aguda
        if (modifiers.hasGrito) {
            volume = Math.min(1.0, volume * 1.0); // Ya está al máximo
            speed = speed * 1.3; // Más rápido para dar energía
            pitch = pitch * 1.4; // Más agudo para sonar exclamativo
            console.log('  📢 [grito] aplicado: vol=1.0, vel x1.3, tono x1.4');
        }

        // [llanto] o [triste] -> Voz más lenta, grave y suave
        if (modifiers.hasLlanto || modifiers.hasTriste) {
            speed = speed * 0.7; // Más lento
            pitch = pitch * 0.75; // Más grave
            volume = volume * 0.85; // Un poco más suave
            console.log('  😢 [llanto/triste] aplicado: vel x0.7, tono x0.75, vol x0.85');
        }

        // [secreto] -> Voz muy suave y lenta
        if (modifiers.hasSecreto) {
            volume = 0.4; // Muy suave
            speed = speed * 0.75; // Más lento
            pitch = pitch * 0.9; // Ligeramente más grave
            console.log('  🤫 [secreto] aplicado: vol=0.4, vel x0.75, tono x0.9');
        }

        // [drama] -> Voz lenta con tono variado
        if (modifiers.hasDrama) {
            speed = speed * 0.8; // Más lento para dramatismo
            pitch = pitch * 1.2; // Más agudo para intensidad
            console.log('  🎭 [drama] aplicado: vel x0.8, tono x1.2');
        }

        // [sorpresa] -> Ya se agregó "¡Ay!" al texto, pero ajustar tono
        if (modifiers.hasSorpresa) {
            pitch = pitch * 1.3; // Más agudo para sorpresa
            speed = speed * 1.1; // Un poco más rápido
            console.log('  😲 [sorpresa] aplicado: tono x1.3, vel x1.1');
        }

        // Aplicar valores finales
        utterance.rate = Math.max(0.1, Math.min(3.0, speed)); // Limitar rango
        utterance.pitch = Math.max(0.1, Math.min(2.0, pitch)); // Limitar rango
        utterance.volume = Math.max(0.1, Math.min(1.0, volume)); // Limitar rango

        console.log('  ✅ Configuración final: vel=' + utterance.rate + ', tono=' + utterance.pitch + ', vol=' + utterance.volume);
    }

    async generateSpeech() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showStatus('Por favor, introduce algún texto para convertir', 'warning');
            return;
        }

        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎙️ INICIANDO GENERACIÓN DE AUDIO');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            this.showStatus('⚙️ Preparando audio...', 'info');
            this.playPauseBtn.disabled = true;
            this.isSpeaking = true;
            this.shouldStop = false;
            this.isPaused = false;
            this.elapsedTime = 0;

            // Cancelar cualquier speech anterior
            if (this.synth) {
                this.synth.cancel();
            }
            
            // Pausa breve para asegurar que se canceló
            await new Promise(resolve => setTimeout(resolve, 100));

            // Procesar texto especial
            const { text: processedText, modifiers } = this.processSpecialTags(text);
            
            console.log('📝 Texto procesado:', processedText.substring(0, 80) + '...');

            // Dividir texto largo en fragmentos
            const textChunks = this.splitLongText(processedText, 180);
            console.log(`📋 Texto dividido en ${textChunks.length} fragmento(s)`);

            // Configurar voz seleccionada usando el mapeo real
            const selectedVoiceIndex = parseInt(this.voiceSelector.value);
            const voiceProfile = this.voiceProfiles[selectedVoiceIndex];
            
            console.log('🎤 Perfil de voz seleccionado:', voiceProfile.name);
            
            // Obtener la voz real mapeada a este perfil
            let actualVoice = this.voiceMapping[selectedVoiceIndex];
            
            if (actualVoice) {
                console.log('✅ Voz real asignada:', actualVoice.name, '(' + actualVoice.lang + ')');
            } else {
                console.warn('⚠️ No hay voz mapeada, buscando por acento...');
                // Fallback: buscar por acento
                const lang = this.getLanguageForAccent(voiceProfile.accent);
                actualVoice = this.voices.find(v => v.lang.startsWith(lang));
                
                if (actualVoice) {
                    console.log('✅ Voz encontrada por acento:', actualVoice.name);
                } else {
                    console.error('❌ NO SE ENCONTRÓ NINGUNA VOZ');
                    this.showStatus('❌ No hay voces disponibles', 'error');
                    this.playPauseBtn.disabled = false;
                    this.isSpeaking = false;
                    return;
                }
            }

            // Mostrar configuración actual
            const speed = parseFloat(this.speedControl.value);
            const pitch = parseFloat(this.pitchControl.value);
            const volume = parseFloat(this.volumeControl.value);
            console.log(`🎛️ CONFIGURACIÓN: Velocidad=${speed}, Tono=${pitch}, Volumen=${Math.round(volume * 100)}%`);

            // Calcular duración estimada
            this.estimatedDuration = this.calculateEstimatedDuration(processedText, speed);
            console.log(`⏱️ Duración estimada: ${this.estimatedDuration} segundos (${this.formatTime(this.estimatedDuration)})`);
            
            // Actualizar UI de progreso
            this.totalTimeEl.textContent = this.formatTime(this.estimatedDuration);
            this.currentTimeEl.textContent = '0:00';
            this.progressFill.style.width = '0%';
            
            // Actualizar botón a estado "Reproduciendo"
            this.updatePlayPauseButton(true, false);
            this.showStatus('🔊 Reproduciendo...', 'success');
            
            // Iniciar tracking de progreso
            this.startProgressTracking();

            // Reproducir cada fragmento secuencialmente
            for (let i = 0; i < textChunks.length; i++) {
                // Verificar si se debe detener
                if (this.shouldStop) {
                    console.log('⏹️ Detención solicitada por el usuario');
                    break;
                }
                
                // Esperar si está pausado
                while (this.isPaused && !this.shouldStop) {
                    console.log('⏸️ Esperando reanudación...');
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Verificar nuevamente después de la pausa
                if (this.shouldStop) {
                    console.log('⏹️ Detención solicitada durante la pausa');
                    break;
                }
                
                const chunk = textChunks[i];
                console.log(`\n--- Fragmento ${i + 1}/${textChunks.length} ---`);
                console.log('Texto:', chunk.substring(0, 60) + '...');
                
                const success = await this.speakChunk(chunk, actualVoice, modifiers);
                
                if (!success || this.shouldStop) {
                    console.log('⚠️ Interrupción detectada, deteniendo...');
                    break;
                }
            }
            
            if (!this.shouldStop) {
                console.log('\n✅ TODOS LOS FRAGMENTOS REPRODUCIDOS');
                this.showStatus('✅ Audio completado', 'success');
                setTimeout(() => this.hideStatus(), 2000);
            }
            
            // Resetear estado
            this.resetProgress();
            
            // Agregar al historial
            this.addToHistory(text, voiceProfile.name);
            
        } catch (error) {
            console.error('❌ Error al generar audio:', error);
            this.showStatus('❌ Error: ' + error.message, 'error');
            this.resetProgress();
        }
    }

    speakChunk(text, voice, modifiers) {
        return new Promise((resolve, reject) => {
            if (!text || text.trim() === '') {
                console.log('⚠️ Fragmento vacío, saltando...');
                resolve(true);
                return;
            }
            
            // Verificar si se debe detener antes de empezar
            if (this.shouldStop) {
                console.log('⏹️ Stop detectado antes de iniciar fragmento');
                resolve(false);
                return;
            }

            // Crear utterance
            const utterance = new SpeechSynthesisUtterance(text);

            // Configurar voz
            if (voice) {
                utterance.voice = voice;
                console.log(`🎤 Voz asignada: ${voice.name} (${voice.lang})`);
            } else {
                console.warn('⚠️ No se asignó voz específica');
            }

            // Obtener valores ACTUALES de los controles del usuario
            let speed = parseFloat(this.speedControl.value);
            let pitch = parseFloat(this.pitchControl.value);
            let volume = parseFloat(this.volumeControl.value);

            // Aplicar estilo seleccionado (esto ya modificó los sliders)
            const style = this.styleSelector.value;
            console.log(`\n🎭 ESTILO SELECCIONADO: ${style}`);
            console.log(`📊 Configuración inicial del usuario: vel=${speed}, tono=${pitch}, vol=${Math.round(volume * 100)}%`);

            // Aplicar valores base al utterance
            utterance.rate = speed;
            utterance.pitch = pitch;
            utterance.volume = volume;

            // Aplicar modificadores de etiquetas especiales
            this.applyModifiersToUtterance(utterance, modifiers);

            // Mostrar configuración final
            console.log(`\n✅ CONFIGURACIÓN FINAL DEL FRAGMENTO:`);
            console.log(`   Velocidad: ${utterance.rate.toFixed(2)}x`);
            console.log(`   Tono: ${utterance.pitch.toFixed(2)}`);
            console.log(`   Volumen: ${(utterance.volume * 100).toFixed(0)}%`);
            console.log(`   Texto: "${text.substring(0, 60)}..."`);

            // Mantener el audio vivo (Chrome bug workaround)
            let keepAliveInterval = null;

            // Eventos
            utterance.onstart = () => {
                console.log('▶️ FRAGMENTO INICIADO');
                this.showStatus('🔊 Reproduciendo...', 'success');
                
                // Workaround para Chrome: mantener vivo el speech
                keepAliveInterval = setInterval(() => {
                    if (this.synth.speaking && !this.synth.paused) {
                        this.synth.pause();
                        this.synth.resume();
                    }
                }, 5000);
            };

            utterance.onend = () => {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
                console.log('✅ FRAGMENTO FINALIZADO');
                resolve(true);
            };

            utterance.onerror = (event) => {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
                
                console.error('❌ Error en fragmento:', event.error);
                
                if (event.error === 'interrupted' || event.error === 'canceled') {
                    console.log('⚠️ Interrupción manual detectada');
                    resolve(false);
                } else if (event.error === 'not-allowed') {
                    console.error('❌ Permiso de audio denegado');
                    reject(new Error('Permiso de audio denegado'));
                } else {
                    reject(new Error(event.error));
                }
            };

            // Timeout de seguridad por fragmento
            const timeout = setTimeout(() => {
                if (keepAliveInterval) clearInterval(keepAliveInterval);
                console.warn('⏰ Timeout (30s) en fragmento');
                resolve(true); // Continuar con siguiente
            }, 30000);

            // Limpiar timeout al finalizar
            const originalOnEnd = utterance.onend;
            utterance.onend = () => {
                clearTimeout(timeout);
                originalOnEnd();
            };

            // Reproducir
            if (this.synth) {
                console.log('🚀 synth.speak() llamado');
                this.synth.speak(utterance);
            } else {
                reject(new Error('SpeechSynthesis no disponible'));
            }
        });
    }

    getLanguageForAccent(accent) {
        const languages = {
            'spain': 'es-ES',
            'mexico': 'es-MX',
            'argentina': 'es-AR'
        };
        return languages[accent] || 'es-ES';
    }

    stopSpeech() {
        console.log('\n⏹️ BOTÓN STOP PRESIONADO');
        
        this.shouldStop = true;
        this.isSpeaking = false;
        this.isPaused = false;
        
        if (this.synth) {
            this.synth.cancel();
            console.log('✅ synth.cancel() ejecutado');
        }
        
        // Resetear progreso
        this.resetProgress();
        
        this.hideStatus();
        this.playPauseBtn.disabled = false;
        this.showStatus('⏹️ Reproducción detenida', 'info');
        
        console.log(' Estado: shouldStop=' + this.shouldStop + ', isSpeaking=' + this.isSpeaking);
        
        setTimeout(() => {
            this.hideStatus();
            console.log('🔇 Audio completamente detenido');
        }, 2000);
    }

    copyText() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showStatus('⚠️ No hay texto para copiar', 'warning');
            setTimeout(() => this.hideStatus(), 2000);
            return;
        }
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Texto copiado al portapapeles');
            this.showStatus('✅ Texto copiado al portapapeles', 'success');
            
            // Efecto visual en el botón
            this.copyBtn.style.color = 'var(--success-color)';
            this.copyBtn.style.borderColor = 'var(--success-color)';
            
            setTimeout(() => {
                this.hideStatus();
                this.copyBtn.style.color = '';
                this.copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('❌ Error al copiar:', err);
            this.showStatus('❌ Error al copiar el texto', 'error');
            setTimeout(() => this.hideStatus(), 2000);
        });
    }

    clearText() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showStatus('ℹ️ El campo ya está vacío', 'info');
            setTimeout(() => this.hideStatus(), 1500);
            return;
        }
        
        this.stopSpeech();
        this.textInput.value = '';
        this.textInput.focus();
        
        console.log('🗑️ Texto limpiado');
        this.showStatus('✅ Texto eliminado', 'success');
        
        // Efecto visual en el botón
        this.clearBtn.style.color = 'var(--danger-color)';
        this.clearBtn.style.borderColor = 'var(--danger-color)';
        
        setTimeout(() => {
            this.hideStatus();
            this.clearBtn.style.color = '';
            this.clearBtn.style.borderColor = '';
        }, 1500);
    }

    stripToPlainText() {
        const text = this.textInput.value;

        if (!text.trim()) {
            this.showStatus('El campo de texto está vacío', 'info');
            setTimeout(() => this.hideStatus(), 1500);
            return;
        }

        let plain = text;

        // Eliminar bloques de código con triple backtick
        plain = plain.replace(/```[\s\S]*?```/g, '');

        // Eliminar código inline con backtick simple
        plain = plain.replace(/`([^`]*)`/g, '$1');

        // Eliminar negritas y cursivas con asteriscos triples
        plain = plain.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');

        // Eliminar negritas con doble asterisco
        plain = plain.replace(/\*\*([^*]+)\*\*/g, '$1');

        // Eliminar negritas con doble guion bajo
        plain = plain.replace(/__([^_]+)__/g, '$1');

        // Eliminar cursivas con asterisco simple
        plain = plain.replace(/\*([^*]+)\*/g, '$1');

        // Eliminar cursivas con guion bajo simple
        plain = plain.replace(/_([^_]+)_/g, '$1');

        // Eliminar tachado con doble tilde
        plain = plain.replace(/~~([^~]+)~~/g, '$1');

        // Eliminar encabezados Markdown (# ## ### etc.)
        plain = plain.replace(/^#{1,6}\s+/gm, '');

        // Eliminar citas (> al inicio de línea)
        plain = plain.replace(/^>\s*/gm, '');

        // Eliminar listas con guion, asterisco o número
        plain = plain.replace(/^[\-\*\+]\s+/gm, '');
        plain = plain.replace(/^\d+\.\s+/gm, '');

        // Eliminar líneas horizontales (--- o ***)
        plain = plain.replace(/^[-\*]{3,}\s*$/gm, '');

        // Eliminar links Markdown [texto](url) -> solo el texto
        plain = plain.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

        // Eliminar imágenes Markdown ![alt](url)
        plain = plain.replace(/!\[[^\]]*\]\([^\)]+\)/g, '');

        // Eliminar HTML simple que pudiera haber
        plain = plain.replace(/<[^>]+>/g, '');

        // Limpiar espacios múltiples y líneas en blanco excesivas
        plain = plain.replace(/\r\n/g, '\n');
        plain = plain.replace(/\n{3,}/g, '\n\n');
        plain = plain.replace(/[ \t]+/g, ' ');
        plain = plain.trim();

        if (plain === text.trim()) {
            this.showStatus('El texto ya está en formato plano', 'info');
            setTimeout(() => this.hideStatus(), 2000);
            return;
        }

        this.textInput.value = plain;
        this.updatePlayPauseButtonState();

        // Efecto visual en el botón
        this.plainTextBtn.style.color = 'var(--success-color)';
        this.plainTextBtn.style.borderColor = 'var(--success-color)';

        console.log('Formato eliminado. Texto convertido a texto plano.');
        this.showStatus('Formato eliminado. Texto plano listo.', 'success');

        setTimeout(() => {
            this.hideStatus();
            this.plainTextBtn.style.color = '';
            this.plainTextBtn.style.borderColor = '';
        }, 2000);
    }

    // Toggle Play/Pause
    async togglePlayPause() {
        if (this.isSpeaking && !this.isPaused) {
            // Pausar
            this.pauseSpeech();
        } else if (this.isPaused) {
            // Reanudar
            this.resumeSpeech();
        } else {
            // Iniciar reproducción
            await this.generateSpeech();
        }
    }

    pauseSpeech() {
        console.log('⏸️ INTENTANDO PAUSAR...');
        console.log('  synth.speaking:', this.synth.speaking);
        console.log('  synth.paused:', this.synth.paused);
        
        if (this.synth && this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            this.isPaused = true;
            
            // Actualizar UI
            this.playPauseIcon.textContent = '▶️';
            this.playPauseText.textContent = 'Reanudar';
            this.playPauseBtn.classList.remove('playing');
            this.playPauseBtn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            
            // Detener progreso
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
            
            console.log('✅ Audio pausado correctamente');
            this.showStatus('⏸️ Audio pausado', 'info');
            
            // Verificar que realmente se pausó
            setTimeout(() => {
                console.log('  Verificación post-pausa:');
                console.log('    synth.paused:', this.synth.paused);
                console.log('    synth.speaking:', this.synth.speaking);
            }, 200);
        } else {
            console.log('  ⚠️ No se puede pausar: synth.speaking =', this.synth.speaking);
        }
    }

    resumeSpeech() {
        console.log('▶️ INTENTANDO REANUDAR...');
        console.log('  synth.paused:', this.synth.paused);
        console.log('  synth.speaking:', this.synth.speaking);
        
        // Método 1: Intentar resume normal
        if (this.synth && this.synth.paused) {
            console.log('  ✅ Método 1: synth.resume()');
            this.synth.resume();
            this.isPaused = false;
            
            // Actualizar UI
            this.playPauseIcon.textContent = '⏸️';
            this.playPauseText.textContent = 'Pausar';
            this.playPauseBtn.classList.add('playing');
            this.playPauseBtn.style.background = '';
            
            // Reanudar progreso
            this.startProgressTracking();
            
            console.log('▶️ Audio reanudado con resume()');
            this.showStatus('▶️ Reproduciendo...', 'success');
            return;
        }
        
        // Método 2: Si resume() no funciona, reiniciar desde el fragmento actual
        console.log('  ⚠️ Método 2: Reiniciando reproducción...');
        this.isPaused = false;
        this.shouldStop = false;
        
        // Actualizar UI
        this.playPauseIcon.textContent = '⏸️';
        this.playPauseText.textContent = 'Pausar';
        this.playPauseBtn.classList.add('playing');
        this.playPauseBtn.style.background = '';
        
        // Reiniciar tracking
        this.startProgressTracking();
        
        console.log('▶️ Reproducción reiniciada');
        this.showStatus('▶️ Reproduciendo...', 'success');
        
        // Web Speech API a veces necesita un pequeño delay después de pause
        setTimeout(() => {
            if (this.synth.paused) {
                this.synth.resume();
                console.log('  ✅ resume() ejecutado con delay');
            }
        }, 100);
    }

    // Calcular duración estimada del audio (más precisa)
    calculateEstimatedDuration(text, speed) {
        // Promedio: 13 palabras por segundo en español a velocidad normal (1.0x)
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        
        // Ajustar según velocidad
        const wordsPerSecond = 13 * speed;
        const estimatedSeconds = words / wordsPerSecond;
        
        console.log(`  📊 Cálculo de duración:`);
        console.log(`    Palabras: ${words}`);
        console.log(`    Velocidad: ${speed}x`);
        console.log(`    Palabras/segundo: ${wordsPerSecond.toFixed(2)}`);
        console.log(`    Duración estimada: ${estimatedSeconds.toFixed(2)} segundos`);
        
        return Math.ceil(estimatedSeconds);
    }

    // Formatear tiempo en MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Iniciar tracking de progreso mejorado
    startProgressTracking() {
        this.startTime = Date.now() - (this.elapsedTime * 1000);
        this.actualDuration = 0; // Duración real medida
        
        console.log(`⏱️ Iniciando tracking: tiempo estimado = ${this.estimatedDuration}s`);
        
        // Actualizar progreso cada 100ms
        this.progressInterval = setInterval(() => {
            if (!this.isPaused && this.isSpeaking) {
                const now = Date.now();
                this.elapsedTime = (now - this.startTime) / 1000;
                this.actualDuration = Math.max(this.actualDuration, this.elapsedTime);
                
                // Calcular progreso basado en el tiempo real vs estimado
                // Pero NO limitar a 100% - permitir que continúe si el audio sigue
                let progress = (this.elapsedTime / this.estimatedDuration) * 100;
                
                // Si el progreso supera el 100%, ajustar la estimación dinámicamente
                if (progress > 100) {
                    // Recalcular duración estimada basada en el tiempo real transcurrido
                    // Asumimos que el audio está al 90% cuando llegamos aquí
                    this.estimatedDuration = this.elapsedTime / 0.9;
                    progress = 90; // Mantener en 90% hasta que realmente termine
                    console.log(`  📊 Ajustando estimación: ${this.estimatedDuration.toFixed(2)}s`);
                }
                
                // Limitar visualmente a 95% hasta que realmente termine
                const visualProgress = Math.min(progress, 95);
                
                // Actualizar UI
                this.progressFill.style.width = `${visualProgress}%`;
                this.currentTimeEl.textContent = this.formatTime(this.elapsedTime);
                this.totalTimeEl.textContent = this.formatTime(Math.max(this.estimatedDuration, this.elapsedTime));
            }
        }, 100);
    }

    // Resetear progreso
    resetProgress() {
        this.elapsedTime = 0;
        this.isSpeaking = false;
        this.isPaused = false;
        this.shouldStop = false;
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // Resetear UI
        this.progressFill.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        this.totalTimeEl.textContent = '0:00';
        
        this.playPauseIcon.textContent = '▶️';
        this.playPauseText.textContent = 'Reproducir';
        this.playPauseBtn.classList.remove('playing');
        this.playPauseBtn.style.background = '';
        this.playPauseBtn.disabled = false;
    }

    // Actualizar estado del botón play/pause
    updatePlayPauseButton(isSpeaking, isPaused) {
        if (isSpeaking && !isPaused) {
            this.playPauseIcon.textContent = '⏸️';
            this.playPauseText.textContent = 'Pausar';
            this.playPauseBtn.classList.add('playing');
            this.playPauseBtn.disabled = false;
        } else if (isPaused) {
            this.playPauseIcon.textContent = '▶️';
            this.playPauseText.textContent = 'Reanudar';
            this.playPauseBtn.classList.remove('playing');
            this.playPauseBtn.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            this.playPauseBtn.disabled = false;
        } else {
            this.playPauseIcon.textContent = '▶️';
            this.playPauseText.textContent = 'Reproducir';
            this.playPauseBtn.classList.remove('playing');
            this.playPauseBtn.style.background = '';
            this.playPauseBtn.disabled = false;
        }
    }

    // Actualizar si el botón play debe estar habilitado o no
    updatePlayPauseButtonState() {
        const hasText = this.textInput.value.trim().length > 0;
        this.playPauseBtn.disabled = !hasText;
        
        if (!hasText) {
            this.playPauseIcon.textContent = '▶️';
            this.playPauseText.textContent = 'Reproducir';
            this.playPauseBtn.classList.remove('playing');
            this.playPauseBtn.style.background = '';
        }
    }

    addToHistory(text, voiceName) {
        const historyItem = {
            id: Date.now(),
            text: text.substring(0, 200),
            fullText: text,
            voice: voiceName,
            accent: this.accentSelector.value,
            style: this.styleSelector.value,
            speed: this.speedControl.value,
            pitch: this.pitchControl.value,
            timestamp: new Date().toISOString()
        };

        this.history.unshift(historyItem);
        
        // Mantener solo los últimos 20 elementos
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎧</div>
                    <p>Aún no has generado ningún audio</p>
                    <p class="empty-hint">Los audios generados aparecerán aquí</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-header">
                    <div class="history-title">🎙️ ${item.voice}</div>
                    <div class="history-date">${this.formatDate(item.timestamp)}</div>
                </div>
                <div class="history-text">${this.escapeHtml(item.text)}</div>
                <div class="history-controls">
                    <button class="btn btn-small btn-play" onclick="app.replayHistory(${item.id})">
                        ▶️ Reproducir
                    </button>
                    <button class="btn btn-small btn-download" onclick="app.downloadHistory(${item.id})">
                        💾 Descargar
                    </button>
                    <button class="btn btn-small btn-delete" onclick="app.deleteHistory(${item.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    replayHistory(id) {
        const item = this.history.find(h => h.id === id);
        if (item) {
            this.textInput.value = item.fullText;
            this.voiceSelector.value = this.voiceProfiles.findIndex(p => p.name === item.voice);
            this.accentSelector.value = item.accent;
            this.styleSelector.value = item.style;
            this.speedControl.value = item.speed;
            this.pitchControl.value = item.pitch;
            this.updateSliderValues();
            // Asegurar que los valores de los sliders se apliquen antes de generar
            this.generateSpeech();
        }
    }

    downloadHistory(id) {
        const item = this.history.find(h => h.id === id);
        if (item) {
            // Crear un archivo de texto con la información
            const content = `Texto: ${item.fullText}\n\nVoz: ${item.voice}\nAcento: ${item.accent}\nEstilo: ${item.style}\nVelocidad: ${item.speed}\nTono: ${item.pitch}\nFecha: ${this.formatDate(item.timestamp)}`;
            
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `voz_audio_${item.id}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus('Archivo descargado correctamente', 'success');
            setTimeout(() => this.hideStatus(), 2000);
        }
    }

    deleteHistory(id) {
        this.history = this.history.filter(h => h.id !== id);
        this.saveHistory();
        this.renderHistory();
        this.showStatus('Elemento eliminado del historial', 'info');
        setTimeout(() => this.hideStatus(), 2000);
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    splitLongText(text, maxLength = 200) {
        // Dividir texto largo en fragmentos más pequeños para evitar el error "interrupted"
        if (text.length <= maxLength) {
            return [text];
        }

        const chunks = [];
        let remaining = text;

        while (remaining.length > 0) {
            if (remaining.length <= maxLength) {
                chunks.push(remaining);
                break;
            }

            // Encontrar el último punto dentro del límite
            let splitIndex = remaining.lastIndexOf('.', maxLength);
            
            // Si no hay punto, buscar coma
            if (splitIndex === -1) {
                splitIndex = remaining.lastIndexOf(',', maxLength);
            }
            
            // Si tampoco hay coma, cortar en el límite
            if (splitIndex === -1) {
                splitIndex = maxLength;
            } else {
                splitIndex++; // Incluir el punto/coma
            }

            chunks.push(remaining.substring(0, splitIndex).trim());
            remaining = remaining.substring(splitIndex).trim();
        }

        return chunks;
    }

    saveHistory() {
        localStorage.setItem('tts_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('tts_history');
        return saved ? JSON.parse(saved) : [];
    }

    showStatus(message, type = 'info') {
        this.statusText.textContent = message;
        this.statusMessage.classList.remove('hidden');
        
        const colors = {
            info: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        
        this.statusMessage.style.borderColor = colors[type] || colors.info;
        
        // Agregar timestamp para debugging
        console.log(`[Status ${type}]: ${message}`);
    }

    hideStatus() {
        this.statusMessage.classList.add('hidden');
    }

    updateUI() {
        this.generateBtn.disabled = false;
        this.updateSliderValues();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TextToSpeechApp();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e);
});

// Lógica de Actualización Automática (UI)
document.addEventListener('DOMContentLoaded', () => {
    const updateModal = document.getElementById('updateModalOverlay');
    const updateTitle = document.getElementById('updateModalTitle');
    const updateMessage = document.getElementById('updateModalMessage');
    const updateBtn = document.getElementById('updateModalBtn');
    const secondaryBtn = document.getElementById('updateModalSecondaryBtn');
    const progressContainer = document.getElementById('updateProgressContainer');
    const progressBarFill = document.getElementById('updateProgressBarFill');
    const progressText = document.getElementById('updateProgressText');

    if (window.electronAPI) {
        // 1. Nueva versión detectada
        window.electronAPI.onUpdateAvailable(() => {
            updateTitle.textContent = "🚀 Actualización Detectada";
            updateMessage.textContent = "Una nueva versión de Voz está disponible y se está descargando automáticamente.";
            updateBtn.textContent = "Entendido";
            updateBtn.onclick = () => updateModal.classList.remove('active');
            secondaryBtn.classList.add('hidden');
            progressContainer.classList.remove('hidden'); // Mostrar barra de progreso
            updateModal.classList.add('active');
        });

        // 2. Progreso de descarga
        window.electronAPI.onDownloadProgress((percent) => {
            const rounded = Math.round(percent);
            progressBarFill.style.width = `${rounded}%`;
            progressText.textContent = `Descargando: ${rounded}%`;
            
            // Si está descargando, ocultar el botón de "Entendido" para que no lo cierren
            updateBtn.classList.add('hidden');
        });

        // 3. Descarga completada
        window.electronAPI.onUpdateDownloaded(() => {
            updateTitle.textContent = "✨ ¡Todo Listo!";
            updateMessage.textContent = "La nueva versión se ha descargado. Reinicia la aplicación para disfrutar de las mejoras.";
            
            progressContainer.classList.add('hidden'); // Ocultar barra al terminar
            
            updateBtn.classList.remove('hidden');
            updateBtn.textContent = "Reiniciar y Actualizar Ahora";
            updateBtn.onclick = () => window.electronAPI.installUpdate();
            
            secondaryBtn.textContent = "Más tarde";
            secondaryBtn.classList.remove('hidden');
            secondaryBtn.onclick = () => updateModal.classList.remove('active');
            
            updateModal.classList.add('active');
        });
    }
});