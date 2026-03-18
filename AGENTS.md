# Agent Instructions: PrimeDex

This file contains the core guidelines and context for any AI agent operating in this repository. It combines both structural constraints and style guidelines to ensure a high-performance, strictly typed, and aesthetically pleasing Gaming Dashboard.

## 1. Project Overview & Architecture
- **Framework:** Next.js 16 (App Router)
- **Engine:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 (Theme-first configuration, glassmorphism)
- **State Management:** TanStack Query v5 (Server State) + Zustand (Client Persistence via `idb-keyval`)
- **API Integration:** PokéAPI (Multi-client: REST + GraphQL), centralized in `src/lib/api/`
- **Component Hierarchy:**
  - `src/components/ui/` for base shadcn/ui primitives.
  - `src/components/pokemon/` for Pokémon domain logic (TeamAnalysis, EvolutionChain, etc.).
  - `src/components/layout/` for global Shell, Header, and Settings.
  - `src/store/` for managing persistence and UI State (large blobs are forbidden; store only IDs and primitives).

## 2. Environment & Commands

**Package Manager:** Use `npm` for all operations.

### Standard Commands
- **Install Dependencies:** `npm install`
- **Run Development Server:** `npm run dev`
- **Build Production Bundle:** `npm run build`
- **Start Production Server:** `npm run start`

### File-Scoped Operations
When modifying a file, it is essential to verify changes locally before progressing:
- **Typecheck (Global or Scoped):** 
  ```bash
  npx tsc --noEmit
  npx tsc --noEmit path/to/file.ts
  ```
- **Lint a File:** 
  ```bash
  npx eslint path/to/file.ts
  ```
- **Run Tests:** 
  Run all: `npx vitest`
  Single test: `npx vitest path/to/file.test.ts`
  *(Tests MUST be updated when modifying business logic.)*

### Commit Attribution
All AI-generated commits **MUST** include standard conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`) and the following attribution:
```
Co-authored-by: Gemini CLI <agent@gemini.google.com>
```

## 3. Code Style & Engineering Standards

### 3.1. Type Rigor (TypeScript)
- **Strict Typing Mandatory:** The repository runs with `"strict": true`.
- **Source of Truth:** `src/types/pokemon.ts` is the foundational type system. Reference it extensively.
- **Prohibited:** The use of `any` or loose `Record<string, unknown>` types is strictly prohibited. Define explicit interfaces or types.
- **Exports:** Prefer explicit named exports over default exports (except for Next.js page/layout files).

### 3.2. Naming Conventions & File Structure
- **Components & Interfaces:** PascalCase (e.g., `PokemonCards.tsx`, `interface PokemonData`).
- **Functions, Hooks & Variables:** camelCase (e.g., `usePokemonList`, `fetchPokemonDetails`).
- **Constants & Env Vars:** UPPER_SNAKE_CASE (e.g., `MAX_TEAM_SIZE`, `NEXT_PUBLIC_API_URL`).
- **Files/Directories:** 
  - React Components: PascalCase (e.g., `EvolutionChain.tsx`).
  - Next.js Routes: App Router standard (`page.tsx`, `layout.tsx`).
  - Utilities/Hooks: camelCase (e.g., `idb-keyval.ts`, `useTeamStore.ts`).
- **Imports:** Group external dependencies first, followed by internal absolute imports (`@/` prefix), and lastly styling.

### 3.3. React & Next.js Best Practices
- **Server vs Client Components:**
  - **Performance First:** Default to React Server Components (RSC) for data-heavy sections and layouts.
  - Client components (`"use client"`) should be pushed down to interaction leaf nodes only.
- **Images:** You MUST use Next.js `<Image>` from `next/image`. Standard `<img>` tags are categorically prohibited.
- **Routing:** Follow the App Router (`src/app/`) structure. Ensure proper loading variants (`loading.tsx`) and error boundaries (`error.tsx`).

### 3.4. Styling & Aesthetics 
- **Tailwind CSS v4:** Utilize Tailwind utility classes stringently.
- **Utility:** Use the `cn()` utility (`clsx` + `tailwind-merge`) when conditionally joining classes.
- **Visual Polish:** The aesthetic is dark-mode-first and glassmorphic. Implement smooth page transitions and micro-interactions (hover, tap states) using `framer-motion`.

### 3.5. Internalization (i18n)
- **Hardcoded Strings:** Prohibited for user-facing text.
- **Translation Utility:** All user-facing strings MUST use the `t()` function imported from `src/lib/i18n.ts` or the relevant hook (`useTranslation()`).

### 3.6. Accessibility (A11y)
- **Compliance:** WCAG 2.2 AA standard is mandatory.
- **Requirements:** 
  - Every interactive element (buttons, toggles, icon-only actions) must include an explicit `aria-label`.
  - Every image component must have a descriptive `alt` text. 
  - Ensure logical keyboard navigation and focus management.

### 3.7. Error Handling & Data Fetching
- **Centralized API Logic:** Ensure all external API requests (Axios) route through `src/lib/api/` (REST/GraphQL). Utilize Axios retry mechanisms securely.
- **Caching:** Maximize TanStack Query caching capabilities on the server boundary.
- **Error States:** Do not swallow errors. Log them meaningfully and surface graceful, translated error states to the user via UI components or toast notifications (`sonner`). Protect API keys using `.env` variables.

## 4. Agent Operational Flow (Golden Rules)
1. **Analyze:** Check `AGENTS.md` and `GEMINI.md` to ensure architectural alignment.
2. **Execute:** Modify files using appropriate AST editors or file writing tools. Always check imports natively (using `@/` for internal root directories).
3. **Verify:** Before marking a task complete, seamlessly trigger lint/typecheck on the changed scope (`npx tsc --noEmit` and `npx eslint path/to/file.ts`). If addressing business logic, ensure `npx vitest` passes.
