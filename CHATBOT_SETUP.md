# XYRA AI Chatbot Setup Guide

## 🎯 Übersicht

Dieser Chatbot nutzt n8n als Backend mit ChatGPT Integration und erscheint als floating Button rechts unten auf der Website.

---

## 📋 Voraussetzungen

1. **n8n Instance** (selbst gehostet oder n8n.cloud)
2. **OpenAI API Key** (für ChatGPT)
3. *Optional:* Airtable Account für Conversation Logging

---

## 🚀 Setup in n8n

### Schritt 1: Workflow importieren

1. Öffne deine n8n Instance
2. Gehe zu **Workflows** → **Import from File**
3. Importiere `n8n-chatbot-workflow.json`

### Schritt 2: OpenAI Credentials hinzufügen

1. Gehe zu **Credentials** → **Add Credential**
2. Wähle **OpenAI API**
3. Trage deinen OpenAI API Key ein
4. Speichern

### Schritt 3: Webhook konfigurieren

1. Öffne den **Webhook Node** im Workflow
2. Setze **Path**: `chatbot`
3. **HTTP Method**: POST
4. **Response Mode**: Using 'Respond to Webhook' Node
5. **Allowed Origins**:
   ```
   https://xyra-ai.de,http://localhost:5173,http://localhost:5177
   ```
6. Aktiviere den Workflow
7. **Kopiere die Webhook URL** (z.B. `https://your-n8n.com/webhook/chatbot`)

### Schritt 4: ChatGPT Node konfigurieren

1. Öffne den **ChatGPT Node**
2. Wähle deine OpenAI Credentials
3. **Model**: `gpt-4-turbo-preview` (oder `gpt-3.5-turbo` für günstigere Option)
4. **Temperature**: 0.7
5. **Max Tokens**: 500

Das System Prompt ist bereits vorkonfiguriert mit Infos über XYRA AI.

### Schritt 5: Website Integration

1. Öffne `src/components/ChatBot.jsx`
2. Ersetze die **WEBHOOK_URL** (Zeile 14):
   ```javascript
   const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/chatbot'
   ```
3. Speichern und testen

---

## 🎨 Chatbot Features

### Design
- Floating Button rechts unten (Türkis-Grün Gradient)
- Slide-in Animation beim Öffnen
- Mobile-responsive (96 = 384px breit)
- Dark Theme passend zur Website

### Funktionen
- ✅ Conversation History (letzte 10 Nachrichten als Kontext)
- ✅ Loading States
- ✅ Error Handling
- ✅ Auto-scroll zu neuen Nachrichten
- ✅ Smooth Animations (Framer Motion)

---

## 🔧 Optional: Conversation Logging

Aktiviere den **Airtable Node** um alle Conversations zu loggen:

### Airtable Setup:
1. Erstelle eine Base "XYRA AI Chatbot"
2. Tabelle "Chatbot Conversations" mit Feldern:
   - Timestamp (Date)
   - User Message (Long text)
   - AI Response (Long text)
   - Conversation History (Long text)

3. Airtable Credentials in n8n hinzufügen
4. Node im Workflow aktivieren (disabled = false)

---

## 🧪 Testing

### Lokal testen:
```bash
npm run dev
```

Öffne http://localhost:5177 und klicke auf den Chat-Button rechts unten.

### Produktiv testen:
Nach dem Deploy auf https://xyra-ai.de

---

## 📊 Monitoring

### n8n Executions:
- Gehe zu **Executions** in n8n
- Sieh alle Chatbot-Anfragen
- Debug bei Fehlern

### Metriken im Auge behalten:
- Anzahl Conversations
- Durchschnittliche Response Time
- Häufigste Fragen
- Error Rate

---

## 🎯 System Prompt Anpassungen

Das System Prompt in `ChatGPT Node` → `messages` → System Message anpassen:

**Aktuelles Prompt:**
```
Du bist der offizielle XYRA AI Assistent für die Musikindustrie und Creator Economy.

Aufgaben:
- Beantworte Fragen über Services (Chat-Agenten, Voice-Agenten, Automatisierung)
- Erkläre Projektansätze (Discovery-Sprint, Build & Launch, Scale)
- Qualifiziere Leads nach Branche und Herausforderungen
- Sei freundlich, professionell und präzise
```

**Tipps:**
- Füge spezifische Use Cases hinzu
- Definiere welche Fragen zum Kontaktformular weiterleiten
- Lege Ton und Persönlichkeit fest

---

## 💰 Kosten

### OpenAI API:
- **GPT-4 Turbo**: ~$0.01 pro Chat (~500 tokens)
- **GPT-3.5 Turbo**: ~$0.002 pro Chat (~500 tokens)

### Geschätzte monatliche Kosten:
- 100 Chats/Monat: ~$1-10
- 1000 Chats/Monat: ~$10-100

→ Für niedrigere Kosten: Nutze `gpt-3.5-turbo`

---

## 🔒 Sicherheit

### CORS:
Webhook erlaubt nur Requests von:
- https://xyra-ai.de
- localhost (Development)

### Rate Limiting:
Füge in n8n einen **IF Node** hinzu um zu viele Requests zu blockieren.

### API Key Protection:
OpenAI Key ist sicher in n8n Credentials gespeichert, nie im Frontend!

---

## 🚀 Deployment

### Änderungen pushen:
```bash
git add src/components/ChatBot.jsx src/App.jsx
git commit -m "feat: add ChatGPT chatbot with n8n webhook"
git push
```

### Nach dem Deploy:
1. Webhook URL in ChatBot.jsx anpassen
2. CORS Origins in n8n Webhook aktualisieren
3. Testen auf Production

---

## 📞 Support

Bei Problemen:
- n8n Docs: https://docs.n8n.io
- OpenAI Docs: https://platform.openai.com/docs
- XYRA Support: david.louis@xyra-ai.de
