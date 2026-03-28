# AI Automation for SMEs - Landing Page

Modern landing page for AI automation services targeting SMEs.

## Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Email:** Resend API
- **Deployment:** Vercel

## Features

- Hero section with value proposition
- Feature highlights (cost savings, time savings, ROI)
- Simple pricing display (€500)
- Contact form with Resend integration
- Mobile responsive
- SEO optimized
- Fast load times

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
RESEND_API_KEY=your_key_here
CONTACT_EMAIL=your_email@example.com
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts to deploy. Make sure to add environment variables in Vercel dashboard.

## Project Structure

```
automation-ia/
├── app/
│   ├── api/
│   │   └── contact/route.ts    # Contact form API
│   ├── components/
│   │   └── ContactForm.tsx     # Contact form component
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## License

MIT
