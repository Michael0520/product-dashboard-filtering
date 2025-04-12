# Product Dashboard Filtering System

A high-performance React application implementing advanced filtering capabilities for large-scale product catalogs, featuring responsive design and optimized data handling.

## Core Features

- **Multi-dimensional Filtering Engine**: Filter products by category, keyword search, price range, and inventory status with real-time updates
- **High-performance Data Processing**: Efficiently handles datasets of 10,000+ products with optimized rendering cycles
- **Virtualized Scrolling Implementation**: Renders only visible DOM elements using windowing techniques to maintain 60fps performance
- **Responsive Design Architecture**: Employs table-based layouts for desktop and card-based grid system for mobile devices
- **Persistent State Management**: Preserves user filter preferences using local storage with Zustand persistence middleware

## Technology Stack

- **React 18** with functional components and hooks architecture
- **TypeScript** for type-safe development and enhanced IDE support
- **Vite** for lightning-fast HMR and optimized build process
- **TailwindCSS** for utility-first styling with JIT compilation
- **Shadcn UI** for accessible component primitives
- **Zustand** for lightweight immutable state management
- **TanStack Query** (React Query) for declarative data fetching with automatic caching
- **TanStack Virtual** for efficient viewport-aware rendering optimization
- **ESLint** with TypeScript configuration for code quality enforcement

## Getting Started

1. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn

# Using pnpm (recommended)
pnpm install
```

2. Start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Project Architecture

```
/
├── public/                # Static assets and resources
├── src/
│   ├── api/               # API layer abstraction
│   │   └── productApi.ts  # Product data service implementation
│   ├── components/        # React component library
│   │   └── ui/            # Shadcn UI components with Radix primitives
│   ├── hooks/             # Custom React hooks
│   │   └── useProductList.ts # Product listing and filtering hook
│   ├── pages/             # Page-level components
│   │   └── ProductList.tsx # Product listing interface
│   ├── store/             # State management
│   │   └── productStore.ts # Product filtering state implementation
│   ├── App.tsx            # Application root component
│   ├── main.tsx           # Entry point with provider wrappers
│   └── index.css          # Global styles with TailwindCSS directives
├── index.html             # HTML template
└── config files           # TypeScript, ESLint, Vite, etc.
```

## Architectural Design Patterns

The system implements several modern frontend architecture patterns:

- **Pure Function Filtering Logic**: Implements filter operations as pure functions for improved testability and maintainability
- **Decoupled State Management**: Utilizes Zustand for atomic state updates with selector optimization
- **Data Fetching Optimization**: Implements React Query with stale-while-revalidate caching strategy

## Performance Optimizations

- **DOM Virtualization**: Uses windowing techniques to render only visible rows, reducing DOM node count
- **Memoized Computations**: Leverages `useMemo` to cache filter results and prevent unnecessary recalculations
- **Query Caching**: Implements intelligent data fetching with customized stale times

## Production Build

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

## Deployment

Install Vercel CLI for seamless deployment:
```
npm i -g vercel
```

Deploy to Vercel's edge network:
```
vercel publish
```