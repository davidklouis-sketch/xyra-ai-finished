# n8n Workflow mit SMTP (Universelle E-Mail Lösung)

## Warum SMTP?

- ✅ Funktioniert mit jedem E-Mail Provider (Outlook, Gmail, etc.)
- ✅ Keine Community Nodes Installation nötig
- ✅ In n8n vorinstalliert
- ✅ Sehr zuverlässig

---

## Schritt 1: SMTP Credentials erstellen

1. **n8n → Credentials → Add Credential**
2. Suche: **"SMTP"**
3. **Konfiguration:**

### Für Outlook/Microsoft 365:
- **User:** `david.louis@xyra.digital`
- **Password:** Dein E-Mail Passwort (oder App Password)
- **Host:** `smtp.office365.com`
- **Port:** `587`
- **Secure Connection:** ✅ STARTTLS

### Für Gmail:
- **User:** deine-email@gmail.com
- **Password:** App Password (nicht normales Passwort!)
  - Erstellen: https://myaccount.google.com/apppasswords
- **Host:** `smtp.gmail.com`
- **Port:** `587`
- **Secure Connection:** ✅ STARTTLS

### Für andere Provider:
Suche nach "[Provider] SMTP settings" (z.B. "ionos smtp settings")

4. **Test Connection** klicken
5. **Save**

---

## Schritt 2: Send Email Node (SMTP)

**Ersetze den "Outlook - Send Confirmation" Node:**

1. **Lösche Outlook Node** (falls er fehlerhaft ist)
2. **Füge neuen Node hinzu:** Suche "Send Email"
3. **Konfiguration:**

### Basic Settings:
- **From Email:** `david.louis@xyra.digital`
- **To Email:** `={{ $('Edit Fields').item.json.email }}`
- **Subject:** `Vielen Dank für Ihre Anfrage – Xyra.Digital`

### Message:
**Option A - Plain Text:**
- **Text:** `={{ $json.choices[0].message.content }}`

**Option B - HTML (falls ChatGPT HTML generiert):**
- **HTML:** `={{ $json.choices[0].message.content.replace(/\n/g, '<br>') }}`

### Additional Fields:
- **BCC:** `david.louis@xyra.digital`
- **Reply To:** `david.louis@xyra.digital`

### Credentials:
- Wähle deine SMTP Credential aus

4. **Verbinde:** HTTP Request → Send Email → Respond to Webhook
5. **Speichern**

---

## Schritt 3: Kalender-Alternative

**Da Outlook Calendar Node fehlt, hast du 3 Optionen:**

### Option A: Google Calendar (Falls du Google nutzt)

1. **Node:** "Google Calendar"
2. **Operation:** Create Event
3. **Config:**
   - **Calendar ID:** `primary`
   - **Start:** `={{ $('Edit Fields').item.json.datetime }}`
   - **End:** `={{ $dateTime($('Edit Fields').item.json.datetime).plus($('Edit Fields').item.json.durationMinutes, 'minutes').toISO() }}`
   - **Summary:** `=Meeting: {{ $('Edit Fields').item.json.name }}`
   - **Description:** `={{ $('Edit Fields').item.json.message }}`
   - **Attendees:** `={{ $('Edit Fields').item.json.email }}`

### Option B: Microsoft Graph API (HTTP Request)

1. **Node:** "HTTP Request"
2. **Method:** POST
3. **URL:** `https://graph.microsoft.com/v1.0/me/calendar/events`
4. **Authentication:** OAuth2
5. **Body:**
```json
={
  "subject": "Meeting: " + $('Edit Fields').item.json.name,
  "start": {
    "dateTime": $('Edit Fields').item.json.datetime,
    "timeZone": $('Edit Fields').item.json.timezone
  },
  "end": {
    "dateTime": $dateTime($('Edit Fields').item.json.datetime).plus($('Edit Fields').item.json.durationMinutes, 'minutes').toISO(),
    "timeZone": $('Edit Fields').item.json.timezone
  },
  "attendees": [
    {
      "emailAddress": {
        "address": $('Edit Fields').item.json.email
      },
      "type": "required"
    }
  ],
  "body": {
    "contentType": "Text",
    "content": $('Edit Fields').item.json.message
  },
  "location": {
    "displayName": "Online (Details folgen)"
  },
  "isReminderOn": true,
  "reminderMinutesBeforeStart": 15
}
```

### Option C: Webhook an Calendly/Cal.com

Falls du einen Booking-Service nutzt, sende Webhook dorthin.

### Option D: Nur E-Mail (Einfachste Lösung)

**Verzichte auf automatischen Kalender-Eintrag:**
- Erwähne in der E-Mail dass du manuell einen Termin vereinbarst
- Nutze Calendly Link in der E-Mail für Self-Booking

**Im ChatGPT Prompt ändern:**
```
Falls ein Termin gewünscht wurde:
"David Louis wird sich mit einem Terminvorschlag melden.
Alternativ können Sie direkt hier einen Termin buchen: [Calendly Link]"
```

---

## Kompletter Workflow (Vereinfacht - Ohne Kalender)

```
1. Webhook (POST /contact-form)
   ↓
2. Edit Fields (Daten extrahieren)
   ↓
3. HTTP Request (OpenAI - E-Mail generieren)
   ↓
4. Send Email (SMTP - E-Mail senden mit BCC an dich)
   ↓
5. Respond to Webhook (200 OK)
```

**Kein IF Node mehr nötig!** ✅ Einfacher und zuverlässiger.

---

## Testen

### 1. Test-Anfrage senden:

```bash
curl -X POST https://your-n8n.com/webhook/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test GmbH",
    "message": "Das ist eine Testanfrage.",
    "schedule": {
      "datetime": "2025-11-15T14:00:00",
      "durationMinutes": 30,
      "timezone": "Europe/Berlin",
      "bookDirect": false
    },
    "timestamp": "2025-10-29T16:00:00.000Z"
  }'
```

### 2. Prüfe:
- ✅ E-Mail an test@example.com empfangen?
- ✅ BCC an david.louis@xyra.digital empfangen?
- ✅ E-Mail Text ist auf Deutsch & personalisiert?
- ✅ Webhook antwortet mit 200 OK?

---

## Troubleshooting

### SMTP Error: "Authentication failed"

**Outlook/Microsoft 365:**
- **Lösung 1:** App Password erstellen
  1. https://account.microsoft.com/security
  2. Security → Advanced security options
  3. App passwords → Create new
  4. Verwende dieses Passwort statt deinem normalen

- **Lösung 2:** "Less secure app access" aktivieren (falls verfügbar)

**Gmail:**
- **Muss App Password nutzen:** https://myaccount.google.com/apppasswords
- 2FA muss aktiviert sein um App Passwords zu erstellen

### SMTP Error: "Connection timeout"

- **Port falsch:** Verwende 587 (nicht 465 oder 25)
- **TLS Settings:** STARTTLS aktivieren
- **Firewall:** n8n muss Port 587 ausgehend erlauben

### E-Mail kommt nicht an

- **Spam Ordner prüfen**
- **SPF/DKIM Records** für deine Domain konfigurieren
- **From Email muss existieren** (david.louis@xyra.digital)

### ChatGPT generiert keine E-Mail

- **HTTP Request Node testen:** Execute Node einzeln
- **Response prüfen:** Muss `choices[0].message.content` enthalten
- **OpenAI API Key prüfen:** Gültig? Guthaben vorhanden?

---

## Kosten

**Mit SMTP + OpenAI:**
- SMTP: **Kostenlos** (normale E-Mail-Nutzung)
- OpenAI: ~$0.18/Monat bei 1000 Anfragen
- **Gesamt: ~$0.18/Monat**

**Ohne OpenAI (Statisches Template):**
- **$0/Monat** - Komplett kostenlos!

---

## Alternative: Statisches Template (Kein OpenAI)

Falls OpenAI zu kompliziert ist:

**Ersetze HTTP Request Node durch Edit Fields:**

1. **Node:** Edit Fields
2. **Field hinzufügen:**
   - **Name:** `emailBody`
   - **Value:**
```javascript
="Hallo " + $json.name + ",\n\nvielen Dank für Ihre Anfrage über xyra.digital!\n\nWir haben Ihre Nachricht erhalten:\n\n\"" + $json.message + "\"\n\nDavid Louis wird sich innerhalb der nächsten 24 Stunden persönlich bei Ihnen melden" + ($json.bookDirect ? (", um Ihren Terminwunsch am " + $json.datetime + " zu besprechen") : "") + ".\n\nBei Rückfragen erreichen Sie uns unter:\nE-Mail: david.louis@xyra.digital\nTelefon: +49 151 64657852\n\nViele Grüße,\nDas Xyra.Digital Team\n\n---\nXyra.Digital\nAI for Music & Creators\nhttps://xyra.digital"
```

3. **Im Send Email Node:**
   - **Text:** `={{ $json.emailBody }}`

**Fertig! Kein API Call, funktioniert sofort.** ✅

---

## Empfehlung

**Für den Start:**
1. ✅ Nutze **SMTP** für E-Mail (einfach & zuverlässig)
2. ✅ Nutze **Statisches Template** statt OpenAI (keine Kosten)
3. ❌ **Verzichte vorerst auf Kalender-Integration** (zu komplex)
4. ✅ Terminabsprache über **manuelle E-Mail** oder **Calendly Link**

**Später erweitern:**
- OpenAI Integration hinzufügen (wenn SMTP funktioniert)
- Google Calendar hinzufügen (wenn du Google nutzt)
- Microsoft Graph API für Kalender (wenn du OAuth2 setup hast)

---

## Minimal-Workflow (Produktionsreif)

```
Webhook → Edit Fields → Edit Fields (Email Template) → Send Email (SMTP) → Respond
```

**Das sind nur 5 Nodes und funktioniert garantiert!** 🎯
