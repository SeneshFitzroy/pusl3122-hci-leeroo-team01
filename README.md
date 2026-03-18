# Lee Roo — Furniture Visualization Platform

[![CI](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml/badge.svg)](https://github.com/SeneshFitzroy/testing1/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Coursework-blue.svg)](https://www.plymouth.ac.uk)

**PUSL3122 HCI, Computer Graphics, and Visualisation** — University of Plymouth  
Term 2 2025–26 | Submission: 19 March 2026

---

## Overview

Lee Roo is a web-based furniture visualization and interior design platform. It enables designers to work with customers to visualize how furniture items would look in rooms, considering room size, shape, and colour scheme. The application supports **2D layout creation** and **3D visualization** for realistic room design presentation.

## Documentation

| Document | Description |
|----------|-------------|
| [Product Images Guide](docs/PRODUCT_IMAGES_GUIDE.md) | Product image setup and asset management |
| [GitHub Repository](https://github.com/SeneshFitzroy/testing1) | Source code repository |

---

## Functional Requirements

### Designer / Admin Side
| Requirement | Implementation |
|-------------|----------------|
| Room specifications | Enter and store room size, shape, colour scheme |
| 2D design creation | Create designs with drag-and-drop furniture placement |
| 3D visualization | Convert designs to immersive 3D views (Three.js/WebGL) |
| Dynamic scaling | Scale furniture items to fit room dimensions |
| Colour & shading | Apply colours to entire design or individual pieces |
| Save & manage | Save, edit, duplicate, delete designs |
| Multi-room support | Design multiple rooms within a project |
| Export | PNG, JPG, PDF export |

### Non-Functional Requirements (HCI/UX)
- **Usability** — Intuitive interface (Nielsen's 10 Heuristics)
- **Performance** — Lazy loading, code splitting, 60fps 3D rendering
- **Accessibility** — WCAG 2.1 AA (skip links, keyboard nav, focus indicators, screen reader)
- **Feedback** — Toast notifications, auto-save indicators, boundary alerts
- **Error prevention** — Undo/redo, confirmation dialogs, form validation
- **Efficiency** — Keyboard shortcuts, templates, drag-and-drop
- **Engagement** — Real-time WebGL, Framer Motion animations
- **Internationalization** — EN, SI, TA, JA, ZH
- **Multi-currency** — USD, EUR, GBP, LKR, JPY, AUD, INR, CNY

### Additional Features
- E-commerce shop with 3D product previews
- Designer consultation booking
- Designer review panel
- Admin dashboard (products, analytics, orders)
- Dark mode
- Firebase Auth (email/password, Google Sign-In)
- Responsive design

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | React 18 |
| Build | Vite 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| Backend | Firebase (Auth, Firestore, Storage) |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| 2D Canvas | Konva, react-konva |
| Animations | Framer Motion 11 |
| i18n | i18next, react-i18next |
| Testing | Vitest, React Testing Library, jsdom |
| Linting | ESLint |

---

## Quick Start

### Prerequisites
- Node.js ≥18.0.0  
- npm ≥9

### Installation
```bash
git clone https://github.com/SeneshFitzroy/testing1.git
cd testing1
npm install
```

### Development
```bash
npm run dev
```
Open `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test
```

### Linting
```bash
npm run lint
```

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **CI** | Push, PR to `main` | Lint, test, build |
| **CD** | Push to `main` | Deploy to Vercel (if configured) |

See `.github/workflows/` for pipeline definitions.

---

## Project Structure

```
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docs/
│   └── PRODUCT_IMAGES_GUIDE.md
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute, RedirectIfDesigner
│   │   ├── editor/         # RoomCanvas2D, RoomViewer3D, panels
│   │   └── layout/         # Layout, Navbar, Footer
│   ├── hooks/
│   ├── lib/                # Firebase, designService, constants, utils
│   ├── pages/              # Route pages
│   ├── store/              # Zustand stores
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests/                  # Test suites
├── jsconfig.json
├── vite.config.js
├── vitest.config.js
└── package.json
```

**Path alias:** `@/` → `src/` (e.g. `import X from '@/components/X'`)

---

## HCI Principles (Nielsen's 10 Heuristics)

1. Visibility of system status  
2. Match between system and real world  
3. User control and freedom  
4. Consistency and standards  
5. Error prevention  
6. Recognition rather than recall  
7. Flexibility and efficiency  
8. Aesthetic and minimalist design  
9. Error recognition and recovery  
10. Help and documentation  

---

## Accessibility

- Skip-to-main-content
- ARIA labels and roles
- Keyboard navigation
- Focus-visible indicators (WCAG 2.1 AA)
- `prefers-reduced-motion` support
- `forced-colors` media query
- Semantic HTML
- Screen reader compatible

---

## Deployment

### Vercel
- SPA routing via `vercel.json`
- Connect GitHub repo for auto-deploys

### Firebase Setup
- Add deployment domains to Firebase **Authentication → Settings → Authorized domains**
- Configure Google Cloud API HTTP referrers for custom domains

---

## Assets & Credits

| Resource | License / Source |
|----------|------------------|
| Unsplash | Product and interior photography |
| Lucide | Icons (MIT) |
| Three.js | 3D rendering (MIT) |
| Firebase | Auth and database |
| Framer Motion | Animation (MIT) |
| Tailwind CSS | Styling (MIT) |
| Konva | 2D canvas (MIT) |

---

## License

Developed as coursework for PUSL3122 at the University of Plymouth.
