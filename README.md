# Digital Development Center (DDC) — NBK Subsidiary Website
> A premium, high-performance, and secure institutional web portal for the Digital Development Center (DDC), a subsidiary of the National Bank of Kazakhstan (Национальный Банк Казахстана).

This project represents a world-class digital presence, positioning DDC as a modern, trustworthy, and innovative leader in Central Asia's financial technology landscape. The website's aesthetics combine institutional trust (referencing the National Bank of Kazakhstan, BlackRock, and Bank of England) with modern product polish (Stripe and Apple).

---

## 🏛️ Brand & Concept: "The Saka Heritage & Digital Future"
The visual identity is anchored on the blend between Kazakhstan's historical legacy and future-forward digital systems:
- **Primary Brand Color**: Deep Forest Green (`#1A3D2B`), symbolizing stability and growth.
- **Accents**: Premium Gold (`#C9A84C`), symbolizing institutional authority and prosperity.
- **Saka Art (Сакский Стиль)**: Abstract 3D representations of national motifs (torus, icosahedron) rendered dynamically using WebGL.

---

## 🛠️ Technical Stack
The website is engineered for extreme performance, smoothness, and accessibility:

### Core Frameworks
* **Next.js 16 (App Router)**: Utilizing React 19 features, static site generation, and optimized image/font loading.
* **TypeScript (Strict Mode)**: Full type-safety across elements and animation components.
* **Tailwind CSS v4 + PostCSS**: High-performance atomic utility styling paired with modern CSS variables.

### Animation & 3D Experiences
* **Three.js & React Three Fiber (R3F)**: Powering a fully interactive 3D Hero scene with dynamic floating geometries, light refraction, and interactive mouse-tracked particle fields.
* **Framer Motion**: Custom-made staggered entrance transitions, slide-ins, and complex page wipes.
* **Lenis Smooth Scroll**: Elegant scrolling mechanics with configurable physics and inertia.
* **GSAP & ScrollTrigger**: Precision scroll-linked animations for timelines, stats, and parallax layouts.

### Forms & Validation
* **React Hook Form**: Form state management with zero unnecessary re-renders.
* **Zod**: Robust client-side validation schemes for contact forms and inquiries.

### Development Quality & CI/CD
* **ESLint & Prettier**: Automated linting and formatting workflows.
* **GitHub Actions CI**: Continuous Integration workflow that runs compilation and validation builds on every push to `develop` and `main`.
* **Vercel Deployments**: Multi-environment preview and production pipeline.

---

## 📁 Repository Directory Structure

```text
ddc-nbk-website/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline
├── app/
│   ├── (marketing)/
│   │   ├── about/               # Organization mission, team, and timeline
│   │   ├── careers/             # Job vacancies and opportunities
│   │   ├── contact/             # Contact forms and map integration
│   │   ├── digital/             # Showcase of DDC products
│   │   ├── faq/                 # Interactive accordions for FAQ
│   │   ├── news/                # CMS-ready news and media template
│   │   ├── security/            # Security certificates & regulatory framework
│   │   ├── services/            # Interactive services showcase
│   │   └── page.tsx             # Cinematic Home Landing page
│   ├── globals.css              # Main tailwind imports & standard animations
│   ├── layout.tsx               # Root layout with navbar/footer
│   └── not-found.tsx            # Branded custom 404 page
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Logo, nav menu, and language toggler
│   │   ├── Footer.tsx           # Multi-column footer & copyright
│   │   └── SmoothScroll.tsx     # Lenis provider for smooth scrolling
│   ├── motion/
│   │   └── ScrollReveal.tsx     # Framer motion helper for scroll reveals
│   ├── sections/
│   │   ├── About.tsx            # Interactive about component with timeline
│   │   ├── CTA.tsx              # Beautiful call-to-action banner
│   │   ├── DigitalShowcase.tsx  # Tabs interface showing digital projects
│   │   ├── Hero.tsx             # Rich hero copy overlay with text reveals
│   │   ├── News.tsx             # News grid with dynamic hover zooming
│   │   ├── Security.tsx         # Interactive security checks and logos
│   │   ├── Services.tsx         # 3D Tilt glass cards showcasing services
│   │   └── Stats.tsx            # Animated counters of assets and milestones
│   ├── three/
│   │   ├── HeroScene.tsx        # Canvas wrapper with suspense limits
│   │   ├── ParticleField.tsx    # Interactive mouse-tracked particles
│   │   └── SakaGeometry.tsx     # Dynamic 3D shapes with refraction and tilt
│   └── ui/
│       ├── Badge.tsx            # Micro-tag component
│       ├── Button.tsx           # Type-safe premium button with micro-motion
│       └── GlassCard.tsx        # 3D interactive tilting glass card container
├── lib/
│   └── utils.ts                 # Formatting & class merging utilities
├── public/
│   ├── images/                  # High-quality optimized graphics
│   └── favicon.ico
├── styles/
│   └── tokens.css               # Design System global CSS variables
├── ARCHITECTURE.md              # Detailed information architecture
├── DESIGN_SYSTEM.md             # Color palettes, spacing scales, and fonts
├── FULL_PLAN.md                 # Complete implementation roadmap
├── tsconfig.json                # TypeScript compiler config
└── package.json                 # Dependency manifests
```

---

## ⚡ Design System & Styling Tokens
All core elements are driven by CSS custom properties located in `styles/tokens.css` and integrated into Tailwind CSS:
- **Typography Display**: *Cormorant Garamond* (Serif font family representing Kazakhstani national heritage and premium institutional design).
- **Typography UI**: *Inter* (San-serif font family optimized for readability and technical precision).
- **Borders & Radii**: Glassmorphic styles using transparent borders `rgba(255,255,255,0.12)`, dynamic backdrop blur filters, and fluid radius scaling (e.g. `--radius-lg: 16px`).
- **Shadows**: Premium gold reflection glow (`--shadow-gold: 0 8px 32px rgba(201,168,76,0.25)`) and institutional green depths.

---

## 🚀 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js 18.x+](https://nodejs.org) and `npm` installed.

### 1. Clone & Navigate
```bash
git clone https://github.com/mrnamazbek/ddc-nbk-website.git
cd ddc-nbk-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Build Production Bundle
To compile and optimize the site for deployment (checking strict lint and TypeScript builds):
```bash
npm run build
```

---

## 🌐 Deployment to Vercel
The website is pre-configured for automatic deployment to Vercel via Git hook connections:
1. Connect your repository `mrnamazbek/ddc-nbk-website` to the Vercel dashboard.
2. Vercel automatically detects Next.js settings.
3. Every push to the `develop` branch creates a *preview environment*.
4. Merges into the `main` branch trigger automated production rollouts.

---

## ♿ Accessibility & Performance Audits
Designed with strict compliance for **WCAG 2.1 AA** standards:
* **Contrast Ratios**: Core colors guarantee a minimum 4.5:1 contrast against text.
* **Keyboard Navigation**: Complete support for interactive buttons, links, and accordion items using native browser focus rings.
* **Prefers Reduced Motion**: System animation curves check `prefers-reduced-motion` media queries and degrade to static layouts automatically when requested by the OS.
* **Performance Budget**: Under 2.0MB initial bundle sizes, utilizing next-gen image formats (`AVIF`/`WebP`) and lazy-loaded WebGL canvas scenes.
