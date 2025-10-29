# n8n mit Gmail + Google Calendar - Komplette Anleitung

## 📋 Voraussetzungen

- ✅ Google Workspace Account mit `david.louis@xyra.digital`
- ✅ n8n Installation
- ✅ OpenAI API Key

---

## Teil 1: Gmail SMTP (Einfachste Methode)

### Schritt 1: App-Passwort erstellen

1. **Google Account öffnen:** https://myaccount.google.com/
2. **Security → 2-Step Verification**
3. Falls nicht aktiv: **Aktiviere 2FA** (Pflicht für App-Passwörter!)
4. **Zurück zu Security → App passwords**
5. **Create new App password:**
   - App: "n8n Email"
   - Generate
6. **Kopiere das 16-stellige Passwort** (z.B. `abcd efgh ijkl mnop`)
7. **Speichere es sicher!** (Wird nur einmal angezeigt)

### Schritt 2: SMTP Credentials in n8n

1. **n8n → Credentials → Add Credential**
2. **Suche:** "SMTP"
3. **Konfiguration:**
   - **Name:** `Gmail SMTP - Xyra`
   - **User:** `david.louis@xyra.digital`
   - **Password:** Das 16-stellige App-Passwort (OHNE Leerzeichen!)
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **Secure Connection:** ✅ STARTTLS
4. **Test Connection** → Sollte grün werden ✅
5. **Save**

---

## Teil 2: Google Calendar OAuth2

### Schritt 1: Google Cloud Project erstellen

1. **Google Cloud Console:** https://console.cloud.google.com/
2. **New Project:**
   - Name: `Xyra n8n Integration`
   - Create
3. **Select Project** (oben links dropdown)

### Schritt 2: APIs aktivieren

1. **APIs & Services → Library**
2. **Suche & aktiviere:**
   - ✅ **Gmail API** (Click "Enable")
   - ✅ **Google Calendar API** (Click "Enable")

### Schritt 3: OAuth Consent Screen

1. **APIs & Services → OAuth consent screen**
2. **User Type:** External (wenn nicht Google Workspace Organization)
3. **App information:**
   - **App name:** `Xyra n8n`
   - **User support email:** `david.louis@xyra.digital`
   - **Developer contact:** `david.louis@xyra.digital`
4. **Scopes:** (Später hinzufügen)
5. **Test users:** Add `david.louis@xyra.digital`
6. **Save and Continue** bis zum Ende

### Schritt 4: OAuth Credentials erstellen

1. **APIs & Services → Credentials**
2. **Create Credentials → OAuth client ID**
3. **Application type:** Web application
4. **Name:** `n8n Webhook`
5. **Authorized redirect URIs:**
   - Add: `https://DEINE-N8N-URL/rest/oauth2-credential/callback`
   - **Beispiel:** `https://n8n.example.com/rest/oauth2-credential/callback`
   - **Wichtig:** Muss exakt deine n8n URL sein!
6. **Create**
7. **Kopiere:**
   - ✅ Client ID
   - ✅ Client Secret

### Schritt 5: Google Calendar Credential in n8n

1. **n8n → Credentials → Add Credential**
2. **Suche:** "Google Calendar OAuth2 API"
3. **Konfiguration:**
   - **Name:** `Google Calendar - Xyra`
   - **Client ID:** [Paste from Google Cloud]
   - **Client Secret:** [Paste from Google Cloud]
   - **Scope:** Automatisch gesetzt
4. **Connect my account** → Google Login
5. **Allow access** für Calendar & Gmail
6. **Save**

---

## Teil 3: Workflow in n8n erstellen

### Node 1: Webhook

1. **Add Node → Webhook**
2. **Config:**
   - **HTTP Method:** POST
   - **Path:** `contact-form`
   - **Respond:** Using 'Respond to Webhook' Node
3. **Save**

### Node 2: Edit Fields (Daten extrahieren)

1. **Add Node → Edit Fields**
2. **Connect:** Webhook → Edit Fields
3. **Add 8 Fields:**

```javascript
// Field 1
name: name
type: String
value: {{ $json.body.name }}

// Field 2
name: email
type: String
value: {{ $json.body.email }}

// Field 3
name: company
type: String
value: {{ $json.body.company || 'nicht angegeben' }}

// Field 4
name: message
type: String
value: {{ $json.body.message }}

// Field 5
name: datetime
type: String
value: {{ $json.body.schedule?.datetime || '' }}

// Field 6
name: durationMinutes
type: Number
value: {{ $json.body.schedule?.durationMinutes || 30 }}

// Field 7
name: timezone
type: String
value: {{ $json.body.schedule?.timezone || 'Europe/Berlin' }}

// Field 8
name: bookDirect
type: Boolean
value: {{ $json.body.schedule?.bookDirect || false }}
```

### Node 3: HTTP Request (OpenAI)

1. **Add Node → HTTP Request**
2. **Connect:** Edit Fields → HTTP Request
3. **Config:**

**Basic:**
- **Method:** POST
- **URL:** `https://api.openai.com/v1/chat/completions`

**Authentication:**
- **Type:** Generic Credential Type
- **Generic Auth Type:** Header Auth
  - **Header Name:** `Authorization`
  - **Value:** `Bearer sk-YOUR_OPENAI_KEY`

**Headers:**
- Add Header:
  - Name: `Content-Type`
  - Value: `application/json`

**Body:**
- **Send Body:** ✅
- **Body Content Type:** JSON
- **JSON Body (Expression Mode = aktivieren!):**

```javascript
={
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "Du bist ein professioneller Assistent von Xyra.Digital. Formuliere eine kurze, freundliche Bestätigungs-E-Mail auf Deutsch für Kontaktanfragen. Stil: professionell aber nicht zu förmlich, enthusiastisch über die Zusammenarbeit.\n\nWichtige Punkte:\n- Bestätige den Empfang der Anfrage\n- Bedanke dich für das Interesse\n- Erwähne dass sich David Louis zeitnah meldet (innerhalb 24h)\n- Falls ein Termin gewünscht wurde, bestätige diesen\n- Halte die Mail kurz (max 150 Wörter)\n- Verwende eine warme, persönliche Anrede\n- Signatur: Viele Grüße, Das Xyra.Digital Team"
    },
    {
      "role": "user",
      "content": {{ "Erstelle eine Bestätigungs-E-Mail für:\n\nName: " + $json.name + "\nFirma: " + $json.company + "\nNachricht: " + $json.message + "\n" + ($json.bookDirect ? ("Terminwunsch: " + $json.datetime + " (" + $json.durationMinutes + " Min, " + $json.timezone + ")") : "Kein Terminwunsch") }}
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

### Node 4: Send Email (Gmail SMTP)

1. **Add Node → Send Email**
2. **Connect:** HTTP Request → Send Email
3. **Config:**
   - **Credential:** Gmail SMTP - Xyra
   - **From Email:** `david.louis@xyra.digital`
   - **To Email:** `={{ $('Edit Fields').item.json.email }}`
   - **Subject:** `Vielen Dank für Ihre Anfrage – Xyra.Digital`
   - **Text (Expression Mode):** `={{ $json.choices[0].message.content }}`
   - **Additional Fields:**
     - **BCC:** `david.louis@xyra.digital`
     - **Reply To:** `david.louis@xyra.digital`

### Node 5: IF (Check Booking)

1. **Add Node → IF**
2. **Connect:** HTTP Request → IF
3. **Config:**
   - **Condition 1:**
     - Value 1: `={{ $('Edit Fields').item.json.bookDirect }}`
     - Operation: Equal
     - Value 2: `true`
   - **AND Condition 2:**
     - Value 1: `={{ $('Edit Fields').item.json.datetime }}`
     - Operation: Is Not Empty

### Node 6: Google Calendar (Create Event)

1. **Add Node → Google Calendar**
2. **Connect:** IF (true output) → Google Calendar
3. **Config:**
   - **Credential:** Google Calendar - Xyra
   - **Resource:** Event
   - **Operation:** Create
   - **Calendar ID:** `primary` (oder deine Kalender-ID)
   - **Start:** `={{ $('Edit Fields').item.json.datetime }}`
   - **End:** `={{ $dateTime($('Edit Fields').item.json.datetime).plus($('Edit Fields').item.json.durationMinutes, 'minutes').toISO() }}`
   - **Summary:** `=Meeting: {{ $('Edit Fields').item.json.name }}{{ $('Edit Fields').item.json.company !== 'nicht angegeben' ? ' (' + $('Edit Fields').item.json.company + ')' : '' }}`
   - **Description:** `=Kontaktanfrage über xyra.digital:\n\n{{ $('Edit Fields').item.json.message }}\n\n---\nKontakt:\nE-Mail: {{ $('Edit Fields').item.json.email }}\nFirma: {{ $('Edit Fields').item.json.company }}`
   - **Location:** `Online (Details folgen)`
   - **Additional Fields:**
     - **Attendees:** `={{ [$('Edit Fields').item.json.email] }}`
     - **Send Updates:** All (sendet E-Mail-Einladung an Teilnehmer)
     - **Reminders:** Minutes Before Start: `15`

### Node 7: Respond to Webhook

1. **Add Node → Respond to Webhook**
2. **Connect:**
   - Send Email → Respond
   - Google Calendar → Respond
3. **Config:**
   - **Respond With:** JSON
   - **Response Body:**
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon."
}
```

---

## Teil 4: Workflow aktivieren & testen

### Workflow aktivieren

1. **Workflow speichern:** Ctrl+S oder Save Button
2. **Aktivieren:** Toggle oben rechts auf "Active" ✅
3. **Webhook URL kopieren:**
   - Klicke auf Webhook Node
   - Kopiere **Production URL**
   - Beispiel: `https://n8n.example.com/webhook/contact-form`

### Test-Request senden

```bash
curl -X POST https://DEINE-N8N-URL/webhook/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "test@example.com",
    "company": "Test GmbH",
    "message": "Ich interessiere mich für Ihre AI-Lösungen.",
    "schedule": {
      "datetime": "2025-11-20T14:00:00",
      "durationMinutes": 30,
      "timezone": "Europe/Berlin",
      "bookDirect": true
    },
    "timestamp": "2025-10-29T18:00:00.000Z"
  }'
```

### Prüfe ob:

- ✅ **E-Mail an test@example.com** gesendet wurde
- ✅ **BCC an david.louis@xyra.digital** angekommen
- ✅ **Kalendertermin** in Google Calendar erstellt
- ✅ **Einladungs-E-Mail** an test@example.com von Google Calendar
- ✅ **Webhook Response:** `{"success": true, ...}`

---

## Teil 5: Frontend Integration

### .env Datei aktualisieren

**Lokal (für Development):**

Erstelle `.env.local`:
```bash
VITE_CONTACT_WEBHOOK_URL=https://DEINE-N8N-URL/webhook/contact-form
```

**Für Production:**

GitHub Actions Secret hinzufügen:
1. **GitHub → Repository → Settings → Secrets → Actions**
2. **New repository secret:**
   - Name: `VITE_CONTACT_WEBHOOK_URL`
   - Value: `https://DEINE-N8N-URL/webhook/contact-form`

### .github/workflows/cd.yml anpassen

In Zeile 70 (wo .env erstellt wird):

```yaml
# Create .env file locally for rsync
echo "DOMAIN=${{ secrets.DOMAIN }}" > .env
echo "TRAEFIK_EMAIL=${{ secrets.TRAEFIK_EMAIL }}" >> .env
echo "VITE_CONTACT_WEBHOOK_URL=${{ secrets.VITE_CONTACT_WEBHOOK_URL }}" >> .env
```

### Build & Deploy

```bash
# Lokal testen
npm run dev

# Production deployment
git add .env.local .github/workflows/cd.yml
git commit -m "feat: add webhook URL to contact form"
git push origin main
```

---

## 📊 Workflow Übersicht

```
┌─────────────┐
│   Webhook   │ (POST /contact-form)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Edit Fields │ (Name, Email, Company, Message, Booking Details)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ HTTP Request│ (OpenAI - Generiert E-Mail)
└──────┬──────┘
       │
       ├────────────────────────┐
       ▼                        ▼
┌─────────────┐          ┌─────────────┐
│ Send Email  │          │     IF      │ (Booking gewünscht?)
│   (Gmail)   │          └──────┬──────┘
└──────┬──────┘                 │ true
       │                        ▼
       │                 ┌─────────────┐
       │                 │   Google    │
       │                 │  Calendar   │
       │                 └──────┬──────┘
       │                        │
       └────────┬───────────────┘
                ▼
         ┌─────────────┐
         │  Respond    │ (200 OK)
         └─────────────┘
```

---

## 🔧 Troubleshooting

### Gmail SMTP Error: "Username and Password not accepted"

**Lösung 1: App-Passwort verwenden**
- **Nicht** dein normales Gmail-Passwort!
- Erstelle App-Passwort: https://myaccount.google.com/apppasswords
- 2FA muss aktiviert sein

**Lösung 2: "Less secure app access" (NICHT empfohlen)**
- Funktioniert nicht bei Google Workspace
- Nur bei kostenlosen Gmail-Accounts

### Google Calendar: "Insufficient Permission"

**OAuth Scopes prüfen:**
1. Google Cloud Console → APIs & Services → Credentials
2. Deine OAuth Client ID → Edit
3. Scopes sollten enthalten:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
4. In n8n: Reconnect Google Calendar Credential

### Kalendertermin wird nicht erstellt

**Prüfe IF Node:**
- `bookDirect` muss `true` sein
- `datetime` darf nicht leer sein

**Test einzelnen Node:**
- Klicke auf Google Calendar Node
- "Execute Node" → Siehst du Fehler?

### OpenAI Timeout

**Erhöhe Timeout:**
- HTTP Request Node → Settings → Timeout → `30000` (30 Sekunden)

### Webhook gibt 404

**Workflow muss aktiv sein:**
- Toggle oben rechts auf "Active" ✅
- Production URL verwenden (nicht Test URL!)

---

## 💰 Kosten-Übersicht

**Monatliche Kosten:**
- **Google Workspace:** €5.75/Monat
- **OpenAI (gpt-4o-mini):** ~€0.18/Monat (bei 1000 Anfragen)
- **n8n:** €0 (Self-hosted) oder ab €20/Monat (Cloud)

**Gesamt:** ~€6/Monat (ohne n8n Hosting)

---

## ✅ Checkliste: Ist alles fertig?

- [ ] Google Workspace Account aktiv
- [ ] 2FA aktiviert + App-Passwort erstellt
- [ ] Google Cloud Project mit Gmail + Calendar API
- [ ] OAuth Credentials erstellt
- [ ] n8n SMTP Credential getestet (grün ✅)
- [ ] n8n Google Calendar Credential verbunden
- [ ] Workflow erstellt und aktiviert
- [ ] Test-Request erfolgreich
- [ ] E-Mail empfangen (To + BCC)
- [ ] Kalendertermin erstellt
- [ ] Webhook URL in GitHub Secrets
- [ ] Frontend deployed mit neuer .env

---

## 🎉 Fertig!

Dein Kontaktformular sendet jetzt automatisch:
- ✅ Personalisierte Bestätigungs-E-Mails via Gmail
- ✅ BCC Kopie an dich
- ✅ Google Calendar Einladungen bei Terminwunsch
- ✅ Alles professional mit deiner Domain

**Bei Fragen:** Sag mir Bescheid! 🚀
