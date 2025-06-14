# React + TypeScript + Vite + Tailwind Template

A minimal starter template for React projects with TypeScript, Vite, and Tailwind CSS.

## Features

- ⚡️ [React 18](https://reactjs.org/)
- 🦾 [TypeScript](https://www.typescriptlang.org/)
- 📦 [Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS 4](https://tailwindcss.com/)
- 🎭 CSS variables for theming
- 🌓 Light/dark mode support
- 💡 Component-based architecture

## Getting Started

### Clone and Install

```bash
# Clone the template
git clone https://github.com/yourusername/react-template.git my-project

# Navigate to the project
cd my-project

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Build

```bash
# Build for production
npm run build
# or
pnpm build
# or
yarn build
```

## Project Structure

```
/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── assets/       # Images, fonts, etc.
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles and theme variables
├── index.html        # HTML template
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## CSS Variables

This template uses CSS variables for theming. You can find all the variables in `src/index.css`.

### Theme Colors

- `--color-primary`: Primary brand color
- `--color-primary-hover`: Hover state for primary elements
- `--color-select`: Selection/focus color

### Light/Dark Mode

The template supports light and dark mode through CSS variables:

- Light mode: `--color-background-light`, `--color-surface-light`, etc.
- Dark mode: `--color-background-dark`, `--color-surface-dark`, etc.

## License

MIT
