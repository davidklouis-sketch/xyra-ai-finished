# n8n Workflow Setup - Xyra.Digital Kontaktformular

## 📋 Übersicht

Dieser n8n Workflow verarbeitet Kontaktformular-Anfragen automatisch:

1. **Webhook empfängt** Formulardaten vom Frontend
2. **ChatGPT (gpt-4o-mini)** generiert personalisierte Bestätigungs-E-Mail auf Deutsch
3. **Outlook sendet** E-Mail an den Interessenten (BCC an dich)
4. **Outlook Kalender** erstellt automatisch Termin (falls gewünscht)
5. **Webhook antwortet** mit Erfolgsbestätigung

---

## 🚀 Installation

### 1. n8n Workflow importieren

1. Öffne deine n8n Instanz
2. Klicke auf **"Workflows" → "Import from File"**
3. Wähle `n8n-contact-workflow.json`
4. Workflow wird importiert

### 2. Credentials einrichten

#### A) OpenAI API (ChatGPT)

1. Gehe zu https://platform.openai.com/api-keys
2. Erstelle neuen API Key
3. In n8n: **Credentials → Add Credential → OpenAI**
   - Name: `OpenAI API`
   - API Key: `<dein-key>`
4. Modell: `gpt-4o-mini` (günstigstes Modell: ~$0.15/1M Input Tokens)

#### B) Microsoft Outlook OAuth2

1. Azure Portal: https://portal.azure.com
2. **App registrations → New registration**
   - Name: `Xyra n8n Integration`
   - Redirect URI: `https://<deine-n8n-url>/rest/oauth2-credential/callback`
3. **API Permissions → Add permission → Microsoft Graph**
   - Delegated permissions:
     - `Mail.Send`
     - `Mail.ReadWrite`
     - `Calendars.ReadWrite`
     - `User.Read`
   - Grant admin consent
4. **Certificates & secrets → New client secret**
   - Kopiere Client Secret (nur einmal sichtbar!)
5. In n8n: **Credentials → Add Credential → Microsoft Outlook OAuth2**
   - Client ID: `<Application (client) ID>`
   - Client Secret: `<dein-secret>`
   - Authorize: Klicke "Connect my account"

### 3. Webhook URL konfigurieren

1. Im Workflow: Klicke auf **"Webhook"** Node
2. Aktiviere Workflow (Toggle oben rechts)
3. Kopiere Production Webhook URL (z.B. `https://n8n.example.com/webhook/contact-form`)
4. Füge URL in `.env` hinzu:
   ```bash
   VITE_CONTACT_WEBHOOK_URL=https://n8n.example.com/webhook/contact-form
   ```
5. Rebuild & Deploy Frontend

---

## ⚙️ Workflow-Details

### Node-Struktur:

```
1. Webhook (POST)
   ↓
2. Extract Form Data
   ↓
3. ChatGPT - Generate Email
   ↓
4. Outlook - Send Confirmation (mit BCC an dich)
   ↓
5. Check if Booking Requested? (bookDirect = true?)
   ├─ Ja → 6. Outlook - Create Calendar Event
   └─ Nein → Skip
   ↓
7. Respond to Webhook (200 OK)
```

### Webhook Payload (vom Frontend):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Label GmbH",
  "message": "Wir möchten eine Kampagne starten.",
  "schedule": {
    "datetime": "2025-11-01T10:30",
    "durationMinutes": 30,
    "timezone": "Europe/Berlin",
    "bookDirect": true
  },
  "timestamp": "2025-10-20T12:34:56.000Z"
}
```

### ChatGPT Prompt:

**System:**
> Du bist ein professioneller Assistent von Xyra.Digital. Formuliere eine kurze, freundliche Bestätigungs-E-Mail auf Deutsch für Kontaktanfragen. Stil: professionell aber nicht zu förmlich, enthusiastisch über die Zusammenarbeit.

**Wichtige Punkte:**
- Bestätige den Empfang der Anfrage
- Bedanke dich für das Interesse
- Erwähne dass sich David Louis zeitnah meldet (innerhalb 24h)
- Falls ein Termin gewünscht wurde, bestätige diesen
- Halte die Mail kurz (max 150 Wörter)
- Verwende eine warme, persönliche Anrede
- Signatur: Viele Grüße, Das Xyra.Digital Team

### E-Mail Versand:

- **An:** Interessent-E-Mail
- **BCC:** david.louis@xyra.digital (du erhältst Kopie)
- **Betreff:** "Vielen Dank für Ihre Anfrage – Xyra.Digital"
- **Body:** Von ChatGPT generiert

### Kalendertermin (nur wenn `bookDirect = true`):

- **Titel:** "Meeting: [Name] ([Firma])"
- **Start:** `datetime` aus Formular
- **Ende:** Start + `durationMinutes`
- **Teilnehmer:** Interessent-E-Mail
- **Body:** Nachricht + Kontaktdaten
- **Location:** "Online (Details folgen)"
- **Reminder:** 15 Minuten vorher
- **Zeitzone:** `timezone` aus Formular

---

## 🧪 Testing

### 1. Workflow testen (Test-Webhook)

1. Klicke auf **"Webhook"** Node
2. Klicke **"Listen for Test Event"**
3. Sende Test-Request via `curl`:

```bash
curl -X POST https://n8n.example.com/webhook-test/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test GmbH",
    "message": "Dies ist eine Testanfrage.",
    "schedule": {
      "datetime": "2025-11-01T14:00",
      "durationMinutes": 30,
      "timezone": "Europe/Berlin",
      "bookDirect": true
    },
    "timestamp": "2025-10-29T12:00:00.000Z"
  }'
```

4. Prüfe ob:
   - ✅ E-Mail an `test@example.com` gesendet wurde
   - ✅ BCC Kopie an `david.louis@xyra.digital` kam
   - ✅ Kalendertermin erstellt wurde (01.11.2025, 14:00-14:30)
   - ✅ Webhook Response: `{"success": true, "message": "..."}`

### 2. Frontend Integration testen

1. Starte Frontend lokal: `npm run dev`
2. Öffne http://localhost:5173
3. Scrolle zu Kontaktformular
4. Fülle Formular aus:
   - Name: Dein Name
   - E-Mail: Deine Test-E-Mail
   - Firma: Optional
   - Nachricht: "Test vom Frontend"
   - Datum/Zeit: Wähle Zeitpunkt
   - Dauer: 30 Min
   - Checkbox: "Direkt buchen" aktivieren
5. Klicke "Nachricht senden"
6. Prüfe:
   - ✅ Success-Nachricht im Frontend
   - ✅ E-Mail erhalten
   - ✅ Kalendertermin erstellt

---

## 💰 Kosten (ca.)

### OpenAI (gpt-4o-mini):
- **Input:** ~$0.15 / 1M Tokens
- **Output:** ~$0.60 / 1M Tokens
- **Pro E-Mail:** ~300 Tokens Input + 200 Tokens Output = **~$0.00018** (0.018 Cent)
- **Bei 1000 Anfragen/Monat:** ~$0.18/Monat

### Microsoft 365:
- Mit bestehendem Business-Account: **kostenlos**
- Ohne Account: Microsoft 365 Business Basic ab €5.60/Monat (inkl. Outlook)

### n8n:
- Self-hosted: **kostenlos** (Open Source)
- n8n Cloud: Ab €20/Monat (5000 Executions)

**Gesamt:** Bei Self-hosted n8n + M365: **~$0.18/Monat** für 1000 Anfragen

---

## 🔧 Anpassungen

### ChatGPT Prompt ändern:

1. Klicke auf **"ChatGPT - Generate Email"** Node
2. Bearbeite **"Messages" → "System"**
3. Passe Ton, Stil oder Inhalt an
4. Speichern & Testen

### BCC E-Mail ändern:

1. Klicke auf **"Outlook - Send Confirmation"** Node
2. Ändere **"BCC Recipients"** auf andere E-Mail
3. Speichern

### Kalendertermin-Details ändern:

1. Klicke auf **"Outlook - Create Calendar Event"** Node
2. Passe **"Subject"**, **"Body"**, **"Location"** an
3. Ändere **"Reminder Minutes"** (Standard: 15)
4. Speichern

### E-Mail Template customizen:

**Option A: Fixes Template statt ChatGPT (Einfacher + Zuverlässiger)**

1. Ersetze **"ChatGPT - Generate Email"** Node durch **"Set"** Node
2. Erstelle Variable mit Template:
   - Variable Name: `emailBody`
   - Value:
   ```
   Hallo {{ $json.name }},

   vielen Dank für Ihre Anfrage über xyra.digital!

   Wir haben Ihre Nachricht erhalten und David Louis wird sich innerhalb von 24 Stunden bei Ihnen melden.

   {{ $json.bookDirect ? 'Ihr Terminwunsch: ' + $json.datetime + ' (' + $json.durationMinutes + ' Min) wurde vorgemerkt.' : '' }}

   Viele Grüße,
   Das Xyra.Digital Team
   ```
3. Im Outlook Node: Body = `={{ $json.emailBody }}`

**Option B: HTTP Request statt OpenAI Node (Bei Node-Problemen)**

Siehe `n8n-http-openai-alternative.json` für eine HTTP Request Node Konfiguration, die direkt die OpenAI API aufruft.

1. Lösche OpenAI Node
2. Füge "HTTP Request" Node hinzu
3. Importiere Config aus `n8n-http-openai-alternative.json`
4. Im Outlook Node: Body = `={{ $json.choices[0].message.content }}`

---

## 🚨 Troubleshooting

### Problem: "Credential not found"
- **Lösung:** OpenAI oder Outlook Credentials neu anlegen und im Node auswählen

### Problem: "Webhook returns 404"
- **Lösung:** Workflow aktivieren (Toggle oben rechts)

### Problem: "OAuth redirect URI mismatch"
- **Lösung:** In Azure App Registration Redirect URI überprüfen: `https://<n8n-url>/rest/oauth2-credential/callback`

### Problem: "Mail not sent"
- **Lösung:** Outlook Permissions prüfen (Mail.Send muss granted sein)

### Problem: "Calendar event not created"
- **Lösung:**
  1. Prüfe ob `bookDirect = true` und `datetime` gesetzt
  2. Prüfe Calendars.ReadWrite Permission

### Problem: "ChatGPT timeout"
- **Lösung:**
  1. Erhöhe Timeout in Node Settings → Execution → Timeout
  2. Oder reduziere maxTokens auf 300

---

## 📊 Monitoring

### n8n Executions anzeigen:

1. **Workflows → Executions**
2. Siehe alle Workflow-Läufe mit:
   - Status (Success/Error)
   - Timestamp
   - Input/Output Daten
   - Error Messages

### Bei Fehlern:

1. Klicke auf fehlerhafte Execution
2. Siehe welcher Node fehlgeschlagen ist
3. Prüfe Error Message
4. Teste Node einzeln mit "Execute Node"

---

## 🔒 Security

- **Webhook:** Nur POST akzeptieren (bereits konfiguriert)
- **Rate Limiting:** In n8n Settings aktivieren (z.B. max 10 Requests/Minute)
- **API Keys:** Niemals in Code committen (nur in n8n Credentials)
- **HTTPS:** n8n nur über HTTPS betreiben
- **CORS:** Falls nötig in n8n Settings konfigurieren

---

## 📝 Nächste Schritte

1. ✅ Workflow importieren
2. ✅ Credentials einrichten (OpenAI + Outlook)
3. ✅ Webhook URL ins Frontend eintragen (`.env`)
4. ✅ Test-Request senden
5. ✅ Frontend testen
6. ✅ Production deployen

---

**Bei Fragen oder Problemen:**
📧 david.louis@xyra.digital
