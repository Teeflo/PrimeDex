# <p align="center">🎮 PrimeDex</p>

<p align="center">
  <strong>The Ultimate High-Performance Pokémon Dashboard</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

---

## 🌟 Vision

**PrimeDex** isn't just a directory—it's a professional-grade **Gaming Dashboard** designed for competitive trainers and completionists alike. Built with a "Performance-First" mindset, it leverages the latest browser technologies to deliver a buttery-smooth experience with zero compromises on visual fidelity.

> *"A PrimeDex that feels as powerful as a Master Ball."*

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🛡️ Team Architect** | Build your squad of 6. Get deep-tier analysis on shared weaknesses, defensive coverage, and offensive potential. |
| **📊 Comparison Engine** | Side-by-side technical analysis of up to 3 Pokémon with interactive radar charts and physical scale comparisons. |
| **🔍 Quantum Search** | Multi-dimensional filtering across all 9 generations. Filter by BST, height, weight, legendary status, and complex type combinations. |
| **🏆 Trial Chambers** | Three distinct quiz modes: **Time Attack**, **Survival**, and **Marathon**. Climb the local leaderboards! |
| **📦 Living Dex Tracker** | Integrated capture management. Track your journey through every region with persistent state. |
| **🌍 Hyper-Localized** | Fully native experience in 7 languages, including Japanese and Korean, with regional name variants. |

---

## 🛠 Engineering Excellence

The PrimeDex is built on a foundation of strict architectural principles:

- **💎 Visual Polish**: Leveraging **Framer Motion** for glassmorphic transitions and state-aware animations.
- **⚡ Performance Core**: Optimized using **React Server Components (RSC)** for data-heavy sections and aggressive caching via **TanStack Query v5**.
- **💾 Durable State**: Your collection is never lost. We use **Zustand** coupled with **IndexedDB (idb-keyval)** for robust, browser-native persistence.
- **♿ Inclusive Design**: **WCAG 2.2 AA** compliant by default. Fully operable via keyboard with semantic HTML5 landmarks.
- **📏 Type Rigor**: 100% TypeScript coverage with a centralized `Source of Truth` for all Pokémon data structures.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20.x or higher
- **Package Manager**: `npm` or `pnpm`

### Installation
```bash
# 1. Clone & Enter
git clone https://github.com/user/pokedex.git && cd pokedex

# 2. Install dependencies
npm install

# 3. Launch the Dashboard
npm run dev
```

---

## 📂 System Architecture

```text
src/
├── app/              # RSC-first Routing & Layouts
│   ├── compare/      # Technical comparison logic
│   ├── team/         # Architect & Analysis suite
│   └── quiz/         # Gamified knowledge trials
├── components/       # Component Architecture
│   ├── pokemon/      # Domain-specific logic
│   └── ui/           # Atomic shadcn/ui primitives
├── lib/              # The Engine
│   ├── api/          # Dual-client: REST + GraphQL
│   └── i18n.ts       # Localization orchestration
└── store/            # State persistence layers
```

---

## 🧪 Technical Safeguards

We maintain high stability through rigorous testing:

```bash
# Run the full test suite
npx vitest

# Open the Vitest Visual UI
npx vitest --ui

# Audit code quality
npm run lint
```

---

## 🤝 Path to Contribution

1. **Research**: Check [AGENTS.md](./AGENTS.md) for architectural context.
2. **Fork & Branch**: `git checkout -b feat/your-innovation`
3. **Commit**: Follow conventional commits (`feat:`, `fix:`, `refactor:`).
4. **Validation**: Ensure all tests pass before opening a PR.

---

<p align="center">
  Built with ❤️ for the Pokémon Community.<br/>
  <strong>Gotta Code 'Em All!</strong>
</p>
