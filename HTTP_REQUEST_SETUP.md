# HTTP Request Node - Manuelle Konfiguration

Falls du den HTTP Request Node manuell konfigurieren möchtest statt den Workflow zu importieren:

## 1. HTTP Request Node hinzufügen

1. Lösche den "ChatGPT - Generate Email" Node
2. Füge neuen "HTTP Request" Node zwischen "Extract Form Data" und "Outlook - Send Confirmation" hinzu
3. Benenne ihn um: "HTTP Request - OpenAI"

## 2. Grundeinstellungen

**Method:** `POST`

**URL:** `https://api.openai.com/v1/chat/completions`

**Authentication:** `Predefined Credential Type`
- **Credential Type:** `OpenAI API`
- Wähle deine OpenAI Credentials aus

## 3. Headers

Klicke auf "Add Header":
- **Name:** `Content-Type`
- **Value:** `application/json`

## 4. Body (JSON)

**Send Body:** Aktivieren

**Body Content Type:** `JSON`

**JSON Body:**

```javascript
={{
  {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "Du bist ein professioneller Assistent von Xyra.Digital. Formuliere eine kurze, freundliche Bestätigungs-E-Mail auf Deutsch für Kontaktanfragen. Stil: professionell aber nicht zu förmlich, enthusiastisch über die Zusammenarbeit.\n\nWichtige Punkte:\n- Bestätige den Empfang der Anfrage\n- Bedanke dich für das Interesse\n- Erwähne dass sich David Louis zeitnah meldet (innerhalb 24h)\n- Falls ein Termin gewünscht wurde, bestätige diesen\n- Halte die Mail kurz (max 150 Wörter)\n- Verwende eine warme, persönliche Anrede\n- Signatur: Viele Grüße, Das Xyra.Digital Team"
      },
      {
        "role": "user",
        "content": "Erstelle eine Bestätigungs-E-Mail für folgende Anfrage:\n\nName: " + $json.name + "\nFirma: " + $json.company + "\nNachricht: " + $json.message + "\n" + ($json.bookDirect ? ("Terminwunsch: " + $json.datetime + " (" + $json.durationMinutes + " Minuten, " + $json.timezone + ")") : "Kein direkter Terminwunsch")
      }
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }
}}
```

**WICHTIG:** Das `={{` am Anfang ist n8n Expression Syntax!

## 5. Outlook Node anpassen

Im "Outlook - Send Confirmation" Node:

**Body Content:**

```javascript
={{ $json.choices[0].message.content }}
```

## 6. Testen

1. Aktiviere Workflow
2. Klicke auf "HTTP Request - OpenAI" Node
3. Klicke "Execute Node"
4. Prüfe Output:
   - Status: 200
   - Body enthält `choices[0].message.content` mit generierter E-Mail

## Beispiel Response von OpenAI:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hallo Max Mustermann,\n\nvielen Dank für Ihre Anfrage über xyra.digital! Wir haben Ihre Nachricht erhalten und freuen uns über Ihr Interesse an einer Zusammenarbeit.\n\nDavid Louis wird sich innerhalb der nächsten 24 Stunden persönlich bei Ihnen melden, um die Details zu besprechen.\n\nViele Grüße,\nDas Xyra.Digital Team"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 85,
    "total_tokens": 235
  }
}
```

Der Pfad `$json.choices[0].message.content` holt genau den generierten Text.

## Troubleshooting

### Error: "Unauthorized" (401)
- OpenAI API Key ist falsch oder abgelaufen
- Erstelle neuen Key: https://platform.openai.com/api-keys

### Error: "Model not found" (404)
- Model-Name falsch geschrieben
- Verwende: `gpt-4o-mini` (klein geschrieben!)

### Error: "Rate limit exceeded" (429)
- Zu viele Requests in kurzer Zeit
- Warte 1 Minute oder upgrade OpenAI Plan

### HTTP Request Node zeigt "Cannot read property..."
- Prüfe ob `={{` am Anfang des JSON Body steht
- Expression Mode muss aktiv sein

### Outlook bekommt leeren Body
- Prüfe Response Path: `{{ $json.choices[0].message.content }}`
- Teste HTTP Node einzeln und prüfe Output-Struktur

## Alternative: Statisches Template (ohne API)

Wenn du gar kein ChatGPT willst, ersetze HTTP Request durch "Set" Node:

**Variable Name:** `emailBody`

**Value:**
```javascript
="Hallo " + $json.name + ",\n\nvielen Dank für Ihre Anfrage über xyra.digital!\n\nWir haben Ihre Nachricht erhalten und David Louis wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\n" + ($json.bookDirect ? "Ihr Terminwunsch: " + $json.datetime + " (" + $json.durationMinutes + " Min) wurde vorgemerkt.\n\n" : "") + "Viele Grüße,\nDas Xyra.Digital Team"
```

Im Outlook Node: `={{ $json.emailBody }}`

**Vorteile:**
- Keine API Kosten
- Sofortige Response (kein API Call)
- Keine Rate Limits

**Nachteile:**
- Nicht personalisiert
- Immer gleicher Text
