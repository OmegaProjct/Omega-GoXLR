# Contributing to Omega GoXLR

> [!TIP]
> The full version history lives in [CHANGELOG.md](CHANGELOG.md).

Thanks for contributing to **Omega GoXLR**. This document defines the baseline expectations so the project stays stable, maintainable, and release-ready from the beginning.

## 1. Development Principles

1. **Hardware safety first**: Avoid unnecessary changes to low-level daemon and device behavior unless the benefit is clear and tested.
2. **Clear separation of concerns**: Keep Electron main-process logic, preload bridge code, and React renderer code cleanly separated.
3. **Desktop-first UX**: The app should feel like purpose-built desktop software, not a browser page in a box.
4. **Incremental reliability**: Prefer small, verifiable steps over broad rewrites, especially around daemon integration and state sync.

---

## 2. Pull Request Checklist

Before opening a pull request, please verify the following:

- [ ] TypeScript passes without errors: `npm run typecheck`
- [ ] Production build completes: `npm run build`
- [ ] Temporary files and local runtime data are not committed
- [ ] Changes were manually verified in the desktop app
- [ ] Daemon-facing changes were tested carefully against the live bridge behavior

---

## 3. Local Setup

1. Install **Node.js** (18+ recommended) and **npm**
2. Clone the repository:
   ```bash
   git clone https://github.com/OmegaProjct/Omega-GoXLR.git
   cd Omega-GoXLR
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development:
   ```bash
   npm run dev
   ```

---

## 4. Code & Structure Conventions

- `src/main/`: Electron main-process logic, process lifecycle, trusted system access, daemon integration
- `src/preload/`: secure bridge exposed to the renderer
- `src/renderer/`: React frontend and desktop UX
- `scripts/`: helper scripts for releases and maintenance

Guidelines:

- Keep the renderer free of direct Node or filesystem access.
- Expose only narrow, explicit preload methods.
- Normalize daemon data in the main process before pushing complexity into the renderer.
- Prefer additive, testable bridge methods over giant catch-all APIs.
