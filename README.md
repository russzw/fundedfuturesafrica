

# Funded Futures Africa

**A modern scholarship platform connecting African students with educational funding opportunities.**

Built with Next.js 14, TypeScript, Firebase, and Tailwind CSS. Features a public scholarship directory, admin dashboard with web scraping, and a full light/dark/darker theme system.

## Features

### Public Platform
- **Scholarship Directory:** Searchable and filterable list of scholarships with degree level, location, and deadline filters
- **Detailed Views:** Each listing includes provider, funding amount, deadline, description, and direct link to the external application
- **Social Sharing:** Share scholarships via Facebook, Twitter, LinkedIn, WhatsApp, or copy link
- **Education Imagery:** Curated education-related placeholder images for scholarships without custom images

### Admin Dashboard
- **Secure Login:** Firebase authentication with inactivity timeout (auto-logout after 10 minutes)
- **CRUD Operations:** Add, edit, and delete scholarship listings
- **Web Scraping:** Scrape scholarship listings from any webpage using a URL. Extracted data (title, provider, location, deadline, funding, description) is editable before posting
- **Demo Mode:** Works without Firebase configured using localStorage

### Theme System
- **3 Modes:** Light (default), Dark (slate-based), Darker (pure black / OLED-friendly)
- **Persistent:** Theme preference saved to localStorage
- **OS Detection:** Respects system preference on first visit

### Resources Center
- **Application Tips:** Detailed guide covering personal statements, recommendation letters, and proofreading
- **Interview Prep:** STAR method, common questions, virtual interview tips, follow-up guidance
- **Application Checklist:** Comprehensive document checklist with deadlines and submission tips
- **Key Resources:** Links to external scholarship databases (Fulbright, Chevening, DAAD, etc.)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```bash
git clone https://github.com/russzw/fundedfuturesafrica.git
cd fundedfuturesafrica/fundedfutures
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

> The app runs in **Demo Mode** (localStorage) if Firebase is not configured.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework (Pages Router) |
| TypeScript | Type-safe development |
| Firebase | Authentication and Firestore database |
| Tailwind CSS | Utility-first styling |
| Cheerio | Server-side HTML parsing for web scraping |
| Lucide React | Icon library |

## Project Structure

```
fundedfutures/
├── components/
│   ├── Footer.tsx          # 4-column footer with brand and links
│   ├── Navbar.tsx           # Sticky nav with blur backdrop, search, theme toggle
│   ├── ScholarshipCard.tsx  # Scholarship listing card with badges
│   ├── ScrapeModal.tsx      # Web scraping UI with editable results
│   ├── ThemeToggle.tsx      # Light/Dark/Darker mode toggle
│   └── WhatsappIcon.tsx     # WhatsApp share icon
├── contexts/
│   └── ThemeContext.tsx      # Theme provider with localStorage persistence
├── pages/
│   ├── api/scrape.ts        # Server-side scraping API
│   ├── index.tsx            # Homepage with hero, featured, how-it-works
│   ├── admin.tsx            # Admin dashboard with auth and CRUD
│   ├── about/index.tsx      # About page with mission, vision, impact
│   ├── resources/index.tsx  # Application tips, interview prep, checklist
│   └── scholarships/
│       ├── index.tsx        # Browse with sidebar filters
│       └── [id].tsx         # Detail page with sharing
├── services/
│   └── firebase.ts          # Firebase config and Firestore CRUD
├── utils/
│   └── placeholderImages.ts # Education-related placeholder images
├── globals.css              # Design system, dark mode, component classes
├── tailwind.config.js       # Brand colors, fonts, shadows
└── types.ts                 # TypeScript interfaces
```

## Admin Access

**Demo Mode (no Firebase):**
- Email: `admin@fundedfuturesafrica.com`
- Password: `sudoAfrica!`

**Firebase Mode:** Use your configured Firebase credentials.

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/russzw/fundedfuturesafrica)

### Other Platforms

Compatible with any Node.js hosting (Netlify, Railway, Firebase Hosting, etc.).

## License

This project is open source. See the repository for license details.

## Author

Built by [devruss](https://www.devruss.site/)
