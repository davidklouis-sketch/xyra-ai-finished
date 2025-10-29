## Xyra.Digital — AI for Music & Creators

A Vite + React + Tailwind landing with i18n (DE-first) focused on the music industry and creator economy. Sections include Hero, Services, Features, Pricing, Contact, and German-compliant legal pages.

### Tech
- React 18, Vite
- TailwindCSS
- Framer Motion
- react-helmet-async (SEO)
- i18n: lightweight custom provider with JSON dictionaries (DE/EN)

### Getting started
```bash
npm install
npm run dev
```

### Environment
- Optional: `VITE_CONTACT_WEBHOOK_URL` to receive contact form submissions and booking requests (POST JSON)

### Project structure
- `src/components/*`: UI sections (Navbar, Hero, Services, Features, Pricing, Contact, Footer)
- `src/i18n/`: i18n provider and translations (`de.json`, `en.json`)
- `public/legal/`: `impressum.html`, `datenschutz.html`, `agb.html`, `cookies.html`

### i18n
- German is default. Language persists in `localStorage` and can be toggled in the navbar.
- Add strings to `src/i18n/translations/*.json`. Arrays/objects are supported.

### Branding & Niche
- Logo: minimal neon ring SVG in `src/components/Logo.jsx`.
- Niche focus: Music and Creator economy (chips and copy in Hero; Services tuned for campaigns, ticketing, merch, fan support, memberships).

### Tailwind theme
- Primary brand green, dark surfaces, subtle accents and aurora/grid backgrounds.

### SEO
- Titles/descriptions set via `Helmet` and `index.html`.

### Accessibility
- Keyboard-focusable controls; navbar supports mobile; form fields include `autocomplete`.

### Legal
- Static German pages under `public/legal/`. Replace placeholder company details in `impressum.html` and `datenschutz.html`.

### Scripts
- ### Webhook payloads
  - Contact/Booking POST example
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "company": "Label GmbH",
    "message": "We want to launch a campaign.",
    "schedule": {
      "datetime": "2025-11-01T10:30",
      "durationMinutes": 30,
      "timezone": "Europe/Berlin",
      "bookDirect": true
    },
    "timestamp": "2025-10-20T12:34:56.000Z"
  }
  ```
- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run preview`: preview production build


