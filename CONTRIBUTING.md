# Contributing · Contribuer

[Français](#français) · [English](#english)

---

## Français

Merci de contribuer à **Sack Me!**

### Prérequis

- Node.js 20+

### Installation

```bash
npm install
npm run dev
# → http://localhost:5174 (5173 reserved for My Pro Hub)
```

### Avant une PR

1. Branche dédiée depuis `main`
2. Contenu jeu : éditer les modules sous `src/data/dataStack/`
3. Checks locaux :
   ```bash
   npm test
   npm run build
   ```
4. **Messages de commit GitHub en anglais uniquement** (impératif : `Add…` / `Fix…` / `Update…`)

### Contenu de jeu

- Source de vérité : [`src/data/dataStack/`](src/data/dataStack/)
- Filiales : [`mutualisEntities.ts`](src/data/dataStack/mutualisEntities.ts)

### Signalement de bugs

Issue avec : OS, navigateur, étapes de reproduction, logs console (sans secrets).

---

## English

Thanks for contributing to **Sack Me!**

### Prerequisites

- Node.js 20+

### Setup

```bash
npm install
npm run dev
# → http://localhost:5174 (5173 reserved for My Pro Hub)
```

### Before a PR

1. Feature branch from `main`
2. Game content: edit modules under `src/data/dataStack/`
3. Local checks:
   ```bash
   npm test
   npm run build
   ```
4. **GitHub commit messages must be English only** (imperative: `Add…` / `Fix…` / `Update…`)

### Game content

- Source of truth: [`src/data/dataStack/`](src/data/dataStack/)
- Subsidiaries: [`mutualisEntities.ts`](src/data/dataStack/mutualisEntities.ts)

### Bug reports

Issue with: OS, browser, repro steps, console logs (no secrets).
