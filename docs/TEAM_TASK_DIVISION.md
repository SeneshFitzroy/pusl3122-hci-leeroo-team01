# PUSL3122 HCI, Computer Graphics, and Visualisation — Team Task Division

**Module:** PUSL3122 | **Term:** 2 | **Deadline:** 19 March 2026 | **Group Size:** 4

---

## 1. Team Members & Roles

| Member | Primary Role | Weight |
|--------|--------------|--------|
| **Senesh Fitzroy** | Lead Developer (Core Graphics & Editor) | ~35% |
| **Mandira** | Developer (E-Commerce & Auth) | ~25% |
| **Isidara** | Developer & UI Design (Layout & Shop) | ~20% |
| **Deepti** | Design, Evaluation & Report Coordination | ~20% |

---

## 2. Senesh Fitzroy — Lead Developer (Heavy Development Focus)

### Implementation Ownership

| Area | Files / Components | Description |
|------|--------------------|-------------|
| **Room Editor (2D/3D)** | `RoomEditor.jsx`, `RoomCanvas2D.jsx`, `RoomViewer3D.jsx`, `OptimizedRoomViewer3D.jsx` | 2D Konva canvas, 3D Three.js renderer, view switching, export (PNG/JPG/PDF) |
| **Designer Panel** | `DesignerPanel.jsx` | Design queue, status management, comments, bulk PDF export, share links |
| **3D Graphics Engine** | `FurnitureModel3D.jsx`, `Real3DViewer.jsx`, `Mini3DPreview.jsx`, `ARFurnitureViewer.jsx` | Procedural 3D models (18 types), WebGL rendering, AR via model-viewer, GLTF export |
| **Design Store & Logic** | `useDesignStore.js` | Undo/redo, room management, furniture state, save/load to Firestore |
| **Editor Panels** | `FurniturePanel.jsx`, `PropertiesPanel.jsx`, `RoomSettingsPanel.jsx`, `TemplateSelector.jsx` | Drag-drop catalog, scaling/colour controls, room specs, templates |
| **Firebase Integration** | `firebase.js`, `seedProducts.js`, `setupAdmin.js` | Auth/DB config, product seeding, demo account provisioning |
| **Constants & Data** | `lib/constants.js` | `ROOM_TEMPLATES`, `FURNITURE_ITEMS`, `SHOP_PRODUCTS`, `EDITOR_FURNITURE` |

### Report Contribution

- **Implementation** (Section 6): Document Room Editor architecture, 2D/3D rendering pipeline, Konva vs Three.js usage, design store flow
- Describe computer graphics algorithms used (rasterization, WebGL pipeline, procedural geometry)
- Justify design decisions for 2D/3D editor

### Video Presentation

- **7–12 min video**: Lead the demo of Room Editor (2D ↔ 3D), furniture placement, scaling, colour changes, export
- Explain `RoomCanvas2D.jsx`, `RoomViewer3D.jsx`, and `FurnitureModel3D.jsx` in code walkthrough
- Show Designer Panel and design workflow

### GitHub Commits

- Primary commits for Room Editor, Designer Panel, 3D components, Firebase, design store
- Ensure commits are well-commented and regular (at least weekly)

---

## 3. Mandira — Developer (E-Commerce & Auth)

### Implementation Ownership

| Area | Files / Components | Description |
|------|--------------------|-------------|
| **E-Commerce Core** | `Shop.jsx`, `Cart.jsx`, `Checkout.jsx` | Product catalog, filters, quick filters, cart, 3-step checkout |
| **Product Detail** | `ProductDetail.jsx` | Product view, 3D preview, AR viewer, colour overlay, tabs |
| **Cart & Wishlist Store** | `useCartStore.js` | Cart/wishlist state, Firestore sync, persistence |
| **Authentication** | `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `AdminLogin.jsx` | Email/password, Google Sign-In, password reset, role redirects |
| **Auth Store & Guards** | `useAuthStore.js`, `ProtectedRoute.jsx`, `RedirectIfDesigner.jsx` | Session management, role checks, protected routes |
| **User Dashboard** | `Dashboard.jsx` | Stats, recent designs, quick actions |
| **My Designs** | `MyDesigns.jsx` | List, search, sort, edit/duplicate/delete saved designs |

### Report Contribution

- **Implementation** (Section 6): Document E-commerce flow, cart logic, checkout steps
- Describe auth flow, role-based access, Firebase Auth integration
- Screenshots and code links for Shop, Cart, Checkout, Login/Register

### Video Presentation

- Demo Shop (search, filters, add to cart), Cart, Checkout
- Demo Login, Register, role-based redirects (user vs designer vs admin)
- Explain `useCartStore.js`, `useAuthStore.js`, `Checkout.jsx` in code walkthrough

---

## 4. Isidara — Developer & UI Design (Layout, Shop & UX)

### Implementation Ownership

| Area | Files / Components | Description |
|------|--------------------|-------------|
| **Layout & Navigation** | `Layout.jsx`, `Navbar.jsx`, `Footer.jsx` | Shell layout, nav links, language/currency, dark mode toggle |
| **Landing Page** | `Landing.jsx` | Hero video, categories, new arrivals, best sellers, brand story |
| **Wishlist** | `Wishlist.jsx` | Wishlist page, add to cart, remove |
| **Admin** | `AdminDashboard.jsx`, `AdminProducts.jsx` | Admin stats, product management |
| **Common UI** | `ConfirmDialog.jsx`, `CookieConsent.jsx`, `RegionModal.jsx`, `JustInTimePopup.jsx` | Modals, consent, region picker |
| **Theme Store** | `useThemeStore.js` | Dark mode, currency, language, a11y settings |
| **App Shell** | `App.jsx`, `main.jsx` | Routing, lazy loading, splash, Toaster |
| **Design & Prototypes** | Low-fi and high-fi prototypes (Figma) | UI design artefacts for report |

### Report Contribution

- **Design** (Section 5): Personas, user stories, storyboards, low-fi and high-fi prototypes
- **Implementation** (Section 6): Layout architecture, responsive design, dark/light mode, i18n
- Explain HCI principles applied (Nielsen heuristics, accessibility, feedback)

### Video Presentation

- Demo Landing, Navbar/Footer, Shop browse experience
- Show design process: low-fi → high-fi → implemented
- Explain `Layout.jsx`, `Navbar.jsx`, `useThemeStore.js`

---

## 5. Deepti — Design, Evaluation & Report Coordination

### Implementation Ownership

| Area | Files / Components | Description |
|------|--------------------|-------------|
| **Accessibility & UX** | `AccessibilityToggle.jsx`, `SplashScreen.jsx` | A11y panel (contrast, font size, colour-blind modes), splash |
| **Onboarding** | `OnboardingTour.jsx`, `KeyboardShortcutsPanel.jsx` | Editor tour, shortcuts modal |
| **Settings & Misc** | `Settings.jsx`, `MeetDesigner.jsx`, `TrackDelivery.jsx`, `FurnitureCatalog.jsx` | User settings, consultation booking, delivery tracking |
| **Utilities** | `lib/utils.js`, `lib/iconMap.jsx`, `lib/geolocation.js` | Helpers, icon mapping, geolocation |
| **i18n** | `i18n.js` | 5 languages (EN, SI, TA, JA, ZH), translation strings |

### Report Contribution

- **Introduction** (Section 1): Signpost, GitHub and YouTube links
- **Background** (Section 2): Scenario, users, application context
- **Gathering Data** (Section 4): Requirements methods, techniques, analysis
- **Evaluation** (Section 7): User study design, participants (anonymised), methods, results, recommendations
- **Summary** (Section 9): Main points
- **References** (Section 10): All citations
- **Report coordination**: Collate sections, ensure ~2000 words, formatting, final PDF

### Video Presentation

- Present evaluation study: how it was designed, run, and what feedback was gathered
- Demo accessibility features, onboarding, settings
- Explain how user feedback was incorporated into the solution

---

## 6. Shared Responsibilities (All 4)

| Task | Owner | Support |
|------|-------|---------|
| **User Testing** | Deepti (lead) | All: recruit 2+ participants each, run sessions, document feedback |
| **Report PDF** | Deepti (coordinator) | All: contribute their sections, proofread |
| **Video** | All 4 appear | Each explains their area (7–12 min total) |
| **GitHub** | All 4 | Commit regularly; Senesh and Mandira main code contributors |
| **README** | Senesh or Mandira | Credits, setup, deployment instructions |

---

## 7. Workload Summary

| Member | Dev Files | Report Sections | Video Segment |
|--------|-----------|-----------------|---------------|
| **Senesh Fitzroy** | 18+ files (Editor, 3D, Designer, Firebase) | Implementation (2D/3D, graphics) | Room Editor + 3D (3–4 min) |
| **Mandira** | 12+ files (Shop, Cart, Auth, Dashboard) | Implementation (E-commerce, auth) | Shop + Auth (2–3 min) |
| **Isidara** | 12+ files (Layout, Landing, Admin, UI) | Design + Implementation (UI) | Layout + Design (2–3 min) |
| **Deepti** | 8+ files (A11y, Settings, i18n, utils) | Intro, Background, Data, Evaluation, Summary, Refs | Evaluation + A11y (2–3 min) |

---

## 8. Checklist for Report (PDF ~2000 words)

- [ ] 1. Introduction — Deepti
- [ ] 2. Background — Deepti
- [ ] 4. Gathering Data — Deepti
- [ ] 5. Design (personas, stories, prototypes) — Isidara (main), all
- [ ] 6. Implementation (screenshots + GitHub links) — Senesh, Mandira, Isidara
- [ ] 7. Evaluation (user studies) — Deepti (main), all
- [ ] 8. Summary — Deepti
- [ ] 9. References — Deepti
- [ ] GitHub link — accessible and up to date
- [ ] YouTube/OneDrive video link — 7–12 min, all 4 visible

---

## 9. Checklist for Video (MP4 7–12 min)

- [ ] Senesh: Room Editor demo + code (2D/3D, scaling, export)
- [ ] Mandira: Shop/Cart/Checkout + Auth demo + code
- [ ] Isidara: Landing, Navbar, design process
- [ ] Deepti: User study, evaluation, accessibility
- [ ] All 4 visible, normal speed, 720p/1080p, H.264

---

## 10. GitHub Commit Guidelines

- Commit at least **once per week** per person
- Use clear messages: `feat: add room templates`, `fix: cart sync`
- No `.zip` or old project versions in repo
- README must credit all resources (art, sounds, libraries)

---

*Last updated: March 2026 — PUSL3122 Group Coursework*
