Texto: Presiona Ctrl + Shift + I (o abre las Herramientas de Desarr...
app.js:820  POST https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyAlRdVxQS8P6_m3onQyNmegKKlT3BXVlYY 403 (Forbidden)
(anonymous) @ app.js:820
speakChunkGoogle @ app.js:808
generateSpeech @ app.js:760
await in generateSpeech
togglePlayPause @ app.js:1201
(anonymous) @ app.js:151
app.js:839 Google TTS Error Response: {
  "error": {
    "code": 403,
    "message": "Cloud Text-to-Speech API has not been used in project 441542553006 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=441542553006 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.",
    "status": "PERMISSION_DENIED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "SERVICE_DISABLED",
        "domain": "googleapis.com",
        "metadata": {
          "activationUrl": "https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=441542553006",
          "consumer": "projects/441542553006",
          "service": "texttospeech.googleapis.com",
          "serviceTitle": "Cloud Text-to-Speech API",
          "containerInfo": "441542553006"
        }
      },
      {
        "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
        "locale": "en-US",
        "message": "Cloud Text-to-Speech API has not been used in project 441542553006 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=441542553006 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry."
      },
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Google developers console API activation",
            "url": "https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=441542553006"
          }
        ]
      }
    ]
  }
}

(anonymous) @ app.js:839
await in (anonymous)
speakChunkGoogle @ app.js:808
generateSpeech @ app.js:760
await in generateSpeech
togglePlayPause @ app.js:1201
(anonymous) @ app.js:151
app.js:1591 [Status warning]: Fallo en API de Google. Usando voz local.
app.js:762 Error usando Google TTS, cayendo a local... Error: Google TTS API Error: 403
    at app.js:841:27
generateSpeech @ app.js:762
await in generateSpeech
togglePlayPause @ app.js:1201
(anonymous) @ app.js:151
app.js:892 🎤 Voz asignada: Microsoft Raul - Spanish (Mexico) (es-MX)
app.js:904 
🎭 ESTILO SELECCIONADO: natural
app.js:905 📊 Configuración inicial del usuario: vel=1, tono=1, vol=100%
app.js:591 
🎨 APLICANDO MODIFICADORES DE ETIQUETAS:
app.js:592   Configuración base: vel=1, tono=1, vol=1
app.js:637   ✅ Configuración final: vel=1, tono=1, vol=1
app.js:916 
✅ CONFIGURACIÓN FINAL DEL FRAGMENTO:
app.js:917    Velocidad: 1.00x
app.js:918    Tono: 1.00
app.js:919    Volumen: 100%
app.js:920    Texto: "Presiona Ctrl + Shift + I (o abre las Herramientas de Desarr..."