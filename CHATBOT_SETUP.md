# XYRA AI Chatbot Setup Guide

## 🎯 Übersicht

Dieser Chatbot nutzt n8n als Backend mit ChatGPT Integration und erscheint als floating Button rechts unten auf der Website.

---

## 📋 Voraussetzungen

1. **n8n Instance** (selbst gehostet oder n8n.cloud)
2. **OpenAI API Key** (für ChatGPT) - Hol dir einen auf https://platform.openai.com/api-keys

---

## 🚀 Setup in n8n

### Schritt 1: OpenAI Credentials erstellen

**WICHTIG: Mach das ZUERST, bevor du den Workflow importierst!**

1. Gehe in n8n zu **Settings** (⚙️) → **Credentials**
2. Klicke **Add Credential**
3. Suche nach **"OpenAI API"**
4. Trage deinen OpenAI API Key ein
5. Klicke **Save**

### Schritt 2: Workflow importieren

1. Gehe zu **Workflows**
2. Klicke **Add workflow** → **Import from File**
3. Wähle die Datei `n8n-chatbot-workflow.json`
4. Der Workflow sollte jetzt importiert sein

### Schritt 3: OpenAI Credentials zuweisen

1. Öffne den Node **"OpenAI API Request"**
2. Unter **Credential to connect with**, wähle deine OpenAI Credentials
3. Klicke **Save** am Node

### Schritt 4: Webhook aktivieren und URL kopieren

1. Aktiviere den Workflow (Toggle oben rechts auf **Active**)
2. Klicke auf den **Webhook** Node
3. Kopiere die **Production URL** (sieht aus wie `https://your-n8n.com/webhook/chatbot`)
4. Diese URL brauchst du gleich!

### Schritt 5: Webhook URL in Website eintragen

1. Öffne die Datei `src/components/ChatBot.jsx`
2. Suche Zeile 14:
   ```javascript
   const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/chatbot'
   ```
3. Ersetze die URL mit deiner kopierten Webhook URL
4. Speichern!

---

## 🎨 Workflow Nodes Erklärung

### 1. Webhook Node
- Empfängt POST Requests vom Chatbot
- Path: `/chatbot`
- Erwartet JSON: `{ "message": "Benutzer Nachricht" }`

### 2. OpenAI API Request Node
- Sendet die Message an ChatGPT API
- Nutzt `gpt-4-turbo-preview` Model
- System Prompt ist vorkonfiguriert mit XYRA Infos
- Temperature: 0.7 (kreativ aber konsistent)
- Max Tokens: 500

### 3. Check for Errors Node
- Prüft ob die API einen Fehler zurückgegeben hat
- Bei Erfolg → Respond to Webhook
- Bei Fehler → Error Response

### 4. Respond to Webhook / Error Response
- Sendet die Antwort zurück zum Chatbot
- Format: `{ "response": "ChatGPT Antwort", "timestamp": "..." }`

---

## 🧪 Testing

### Test im n8n Workflow:
1. Klicke auf **Webhook** Node
2. Klicke **Listen for test event**
3. In einem anderen Tab öffne deine Website
4. Klicke Chat-Button und sende eine Nachricht
5. Zurück in n8n siehst du die Execution

### Manuelle API Test:
```bash
curl -X POST https://your-n8n.com/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hallo, was kann XYRA AI?"}'
```

---

## ⚙️ System Prompt anpassen

Im **OpenAI API Request** Node, im JSON Body, findest du das System Prompt:

```json
{
  "role": "system",
  "content": "Du bist der offizielle XYRA AI Assistent..."
}
```

**Anpassungen:**
- Füge spezifische FAQs hinzu
- Definiere Ton und Persönlichkeit genauer
- Lege fest, wann zum Kontaktformular verwiesen werden soll

---

## 💰 Kosten

### OpenAI API Preise (Stand 2025):
- **GPT-4 Turbo**: ~$0.01 pro Chat (Input) + ~$0.03 (Output)
- **GPT-3.5 Turbo**: ~$0.0005 pro Chat (Input) + ~$0.0015 (Output)

**Um Kosten zu senken**, ändere im JSON Body:
```json
"model": "gpt-3.5-turbo"
```

### Geschätzte Kosten:
- 100 Chats/Monat mit GPT-4: ~$4-10
- 100 Chats/Monat mit GPT-3.5: ~$0.20
- 1000 Chats/Monat mit GPT-4: ~$40-100
- 1000 Chats/Monat mit GPT-3.5: ~$2

---

## 🔒 Sicherheit & CORS

### CORS Headers hinzufügen (falls nötig):

Wenn du CORS-Fehler bekommst, füge einen **Set** Node nach dem Webhook hinzu:

1. Add **Set** Node zwischen Webhook und OpenAI Request
2. Konfiguration:
   ```
   response.headers.Access-Control-Allow-Origin = https://xyra-ai.de
   response.headers.Access-Control-Allow-Methods = POST, OPTIONS
   response.headers.Access-Control-Allow-Headers = Content-Type
   ```

### Rate Limiting:

Füge einen **IF** Node ein um zu viele Requests zu blockieren:
- Zähle Requests pro IP
- Limitiere auf z.B. 10 Requests pro Minute

---

## 🐛 Troubleshooting

### "Could not connect to OpenAI"
- ✅ OpenAI Credentials korrekt eingetragen?
- ✅ API Key gültig und nicht abgelaufen?
- ✅ Guthaben auf OpenAI Account vorhanden?

### "Webhook returns 404"
- ✅ Workflow aktiviert (Active)?
- ✅ Webhook URL korrekt kopiert?
- ✅ Path in Webhook Node ist "chatbot"?

### "CORS Error in Browser"
- ✅ Website Domain in allowed origins?
- ✅ CORS Headers hinzugefügt? (siehe oben)

### "ChatBot zeigt Error Message"
- ✅ Check n8n Executions für Fehler-Details
- ✅ OpenAI API Quota nicht überschritten?
- ✅ JSON Response Format korrekt?

---

## 🚀 Erweiterte Features (Optional)

### 1. Conversation History
Füge im **OpenAI API Request** JSON Body hinzu:
```json
"messages": [
  { "role": "system", "content": "..." },
  {{ $json.body.conversationHistory }},
  { "role": "user", "content": "{{ $json.body.message }}" }
]
```

Der Chatbot sendet dann die letzten 10 Messages mit.

### 2. Logging in Airtable/Database
Füge nach **Check for Errors** einen **Airtable/PostgreSQL** Node hinzu:
- Speichere User Message
- Speichere AI Response
- Timestamp
- Session ID

### 3. Lead Qualification
Wenn User bestimmte Keywords erwähnt:
- Sende E-Mail Benachrichtigung
- Erstelle Lead in CRM
- Trigger Follow-up Workflow

---

## 📊 Monitoring

### n8n Executions:
- **Workflows** → Dein Workflow → **Executions**
- Sieh alle Chatbot-Anfragen
- Fehler-Details bei Failed Executions

### OpenAI Usage:
- https://platform.openai.com/usage
- Sieh Token Usage
- Kosten-Übersicht

---

## 🔄 Updates

### Workflow aktualisieren:
1. Export aktuellen Workflow als Backup
2. Importiere neue Version
3. Credentials neu zuweisen
4. Testen!

### ChatBot Component aktualisieren:
```bash
git pull
npm install
npm run dev
```

---

## 📞 Support

**Bei Problemen:**
- n8n Community: https://community.n8n.io
- OpenAI Docs: https://platform.openai.com/docs
- XYRA Support: david.louis@xyra-ai.de

---

## ✅ Checkliste

- [ ] OpenAI API Key erstellt
- [ ] OpenAI Credentials in n8n hinzugefügt
- [ ] Workflow importiert
- [ ] Credentials im OpenAI Request Node zugewiesen
- [ ] Workflow aktiviert
- [ ] Webhook URL kopiert
- [ ] Webhook URL in ChatBot.jsx eingetragen
- [ ] Website deployed/gestartet
- [ ] Chatbot getestet
- [ ] Fehlerbehandlung funktioniert
- [ ] Kosten im Auge behalten

**Viel Erfolg! 🚀**
