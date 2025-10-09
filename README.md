# BizScout Frontend

![CI Pipeline](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/actions/workflows/ci.yml/badge.svg)
![PR Checks](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/actions/workflows/pr-checks.yml/badge.svg)
[![codecov](https://codecov.io/gh/ShehzanChowdhury/assesment-bizscout-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/ShehzanChowdhury/assesment-bizscout-frontend)

A modern, real-time monitoring dashboard for API response tracking and analytics. Built with Next.js 15, React 19, and TypeScript.

## 📋 Table of Contents

- [Features](#-features)
- [Setup Instructions](#-setup-instructions)
- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [Testing Strategy](#-testing-strategy)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)

---

## ✨ Features

- 📊 **Real-time Dashboard** - Live API response monitoring with WebSocket updates
- 📈 **Statistics Overview** - Total requests, success rate, average latency, and last ping time
- 📋 **Response Table** - Paginated, sortable table with detailed response information
- 🔍 **Response Details** - Expandable modal with full request/response payloads
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- ⚡ **Performance Optimized** - Server-side rendering, code splitting, and optimized bundle size
- 🧪 **Fully Tested** - 100% test coverage with Jest and React Testing Library
- 🚀 **CI/CD Pipeline** - Automated testing, linting, and deployment

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running on port 3001 (or configured port)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShehzanChowdhury/assesment-bizscout-frontend.git
   cd assesment-bizscout-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_WS_BASE_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js 15 App                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Server     │    │   Client     │    │  WebSocket   │  │
│  │  Components  │───▶│  Components  │◀───│   Handler    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   HTTP API   │    │     SWR      │    │ Socket.IO    │  │
│  │   Service    │    │   (Cache)    │    │   Client     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼──────────┘
          │                    │                    │
          └────────────────────┴────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Backend API        │
                    │   (Port 3001)        │
                    └──────────────────────┘
```

### Directory Structure

```
src/
├── @components/          # Reusable UI components
│   ├── common/          # Common components (Badge, Card, etc.)
│   └── ui/              # shadcn/ui components
├── @config/             # Global configuration
├── @hooks/              # Custom React hooks
│   ├── useWebSocket.ts  # WebSocket connection management
│   └── useResponseData.ts # Data fetching and state management
├── @icons/              # Custom icon components
├── @services/           # API service layer
│   └── http.ts          # HTTP client with error handling
├── @utils/              # Utility functions
├── app/                 # Next.js App Router
│   ├── page.tsx         # Home page (Server Component)
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── features/            # Feature-based modules
│   └── dashboard/       # Dashboard feature
│       ├── DashboardClient.tsx
│       ├── ResponseTable.tsx
│       ├── StatsSection.tsx
│       └── __tests__/   # Feature tests
└── types/               # TypeScript type definitions
```

### Data Flow

1. **Initial Load (SSR)**
   - Server Component (`page.tsx`) fetches initial stats via HTTP
   - Pre-rendered HTML sent to client with data
   - Hydration occurs with initial state

2. **Real-time Updates (WebSocket)**
   - Client establishes WebSocket connection via `useWebSocket` hook
   - New responses trigger `newResponse` event
   - UI re-renders with optimistic updates

3. **Pagination & Filtering**
   - Client-side state management via SWR
   - Cached responses for instant navigation
   - Background revalidation for fresh data

### Key Design Patterns

- **Server-First Rendering**: Leverage Next.js 15 Server Components for initial data
- **Progressive Enhancement**: Works without JavaScript, enhanced with real-time updates
- **Local State Management**: Component-level state with React hooks, no global state needed
- **SWR Caching**: Smart client-side caching with automatic revalidation
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data layers
- **Type Safety**: End-to-end TypeScript for compile-time safety

---

## 🛠️ Technology Stack

### Core Framework & Language

- **Next.js 15.5.4** - React framework with App Router
  - *Why*: Server Components, streaming SSR, built-in routing, and excellent DX
  - *Benefits*: SEO-friendly, fast initial loads, automatic code splitting
  
- **React 19.1.0** - UI library
  - *Why*: Latest features including improved Suspense and Server Components
  - *Benefits*: Component-based architecture, rich ecosystem

- **TypeScript 5** - Type-safe JavaScript
  - *Why*: Catch errors at compile-time, better IDE support, self-documenting code
  - *Benefits*: Reduced runtime errors, improved maintainability

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
  - *Why*: Rapid development, consistent design system, small bundle size
  - *Benefits*: No CSS naming conflicts, tree-shakeable, responsive by default

- **Radix UI** - Headless UI primitives
  - *Why*: Accessible, unstyled components with full keyboard navigation
  - *Benefits*: ARIA-compliant, customizable, production-ready

- **Lucide React** - Icon library
  - *Why*: Modern, consistent icons with tree-shaking support
  - *Benefits*: Lightweight, customizable, extensive icon set

### State Management & Data Fetching

- **SWR 2.3.6** - React Hooks for data fetching
  - *Why*: Built-in caching, revalidation, and optimistic updates
  - *Benefits*: Automatic request deduplication, focus revalidation, offline support

- **React useState** - Local component state
  - *Why*: Simple, built-in, sufficient for component-level state
  - *Benefits*: No external dependencies, predictable, easy to debug

### Real-time Communication

- **Socket.IO Client 4.8.1** - WebSocket library
  - *Why*: Reliable real-time bidirectional communication
  - *Benefits*: Automatic reconnection, fallback transports, room support

### Testing

- **Jest 30.2.0** - Testing framework
  - *Why*: Industry standard, great mocking support, snapshot testing
  - *Benefits*: Fast, parallel test execution, extensive matchers

- **React Testing Library 16.3.0** - Component testing
  - *Why*: Encourages testing user behavior over implementation details
  - *Benefits*: Accessible queries, realistic user interactions

- **@testing-library/user-event 14.6.1** - User interaction simulation
  - *Why*: More realistic user interactions than fireEvent
  - *Benefits*: Async event handling, keyboard navigation testing

### Development Tools

- **ESLint 9** - Code linting
  - *Why*: Enforce code quality and consistency
  - *Benefits*: Catch bugs early, consistent code style

- **Turbopack** - Next.js bundler
  - *Why*: Faster builds and HMR than Webpack
  - *Benefits*: Incremental compilation, optimized for Next.js

### Utility Libraries

- **date-fns 4.1.0** - Date manipulation
  - *Why*: Modular, tree-shakeable, immutable
  - *Benefits*: Smaller bundle size than Moment.js, TypeScript support

- **clsx 2.1.1** - Conditional className utility
  - *Why*: Tiny, fast, works with Tailwind
  - *Benefits*: Clean conditional styling, minimal overhead

---

## 🧪 Testing Strategy

### Test Coverage Goals

- **Target**: 80%+ code coverage
- **Current**: 100% (see badge above)
- **Coverage Areas**: Statements, branches, functions, lines

### Testing Pyramid

```
        ┌─────────────────┐
        │   E2E Tests     │  (Planned)
        │   (Playwright)  │
        └─────────────────┘
       ┌───────────────────┐
       │ Integration Tests │  (Current)
       │  Component + API  │
       └───────────────────┘
      ┌─────────────────────┐
      │    Unit Tests       │  (Current)
      │  Hooks, Utils, UI   │
      └─────────────────────┘
```

### Core Components to Test

#### 1. **Dashboard Feature** (`src/features/dashboard/`)
   - **DashboardClient.tsx** - Main orchestrator
     - WebSocket connection lifecycle
     - Real-time data updates
     - Error boundary handling
   
   - **ResponseTable.tsx** - Data display
     - Sorting functionality
     - Pagination controls
     - Loading states
   
   - **StatsSection.tsx** - Metrics display
     - Real-time stat updates
     - Formatting (numbers, dates)
     - Empty states

#### 2. **Custom Hooks** (`src/@hooks/`)
   - **useWebSocket.ts** - WebSocket management
     - Connection establishment
     - Reconnection logic
     - Event handling
     - Cleanup on unmount
   
   - **useResponseData.ts** - Data fetching
     - SWR integration
     - Cache invalidation
     - Error handling

#### 3. **API Services** (`src/@services/`)
   - **http.ts** - HTTP client
     - Request/response handling
     - Error transformation
     - Type safety

#### 4. **UI Components** (`src/@components/`)
   - **Badge.tsx** - Status indicators
   - **Card.tsx** - Container component
   - **Pagination.tsx** - Navigation controls

### Test Types

#### Unit Tests
```bash
npm test -- useWebSocket.test.ts
```
- Test individual functions and hooks in isolation
- Mock external dependencies
- Fast execution (<1s per test)

#### Integration Tests
```bash
npm test -- ResponseTableSection.integration.test.tsx
```
- Test component interactions with real data flow
- Mock only external APIs and WebSocket
- Verify end-to-end user workflows

#### Coverage Reports
```bash
npm run test:coverage
```
- Generate HTML coverage report in `coverage/` directory
- View detailed line-by-line coverage
- Identify untested code paths

### Testing Best Practices

1. **User-Centric Testing**
   - Test what users see and do, not implementation details
   - Use accessible queries (`getByRole`, `getByLabelText`)
   - Simulate real user interactions

2. **Test Isolation**
   - Each test should be independent
   - Clean up after each test
   - Avoid shared state

3. **Meaningful Assertions**
   - Test behavior, not implementation
   - Use descriptive test names
   - One logical assertion per test

### CI/CD Integration

- **Automated Testing**: All tests run on every PR
- **Coverage Enforcement**: Fail if coverage drops below threshold
- **Parallel Execution**: Tests run in parallel for speed
- **Coverage Reports**: Uploaded to Codecov for tracking

---

## 🚀 Future Improvements

### Performance Optimizations

- [ ] **Virtual Scrolling** - Handle 10,000+ rows without performance degradation
  - Use `react-window` or `@tanstack/react-virtual`
  - Render only visible rows
  
- [ ] **Service Worker** - Offline support and background sync
  - Cache API responses
  - Queue failed requests

### Feature Enhancements

- [ ] **Advanced Filtering** - Multi-column filtering and search
  - Filter by status code, method, date range
  - Full-text search in request/response bodies
  
- [ ] **Data Export** - Export data to CSV/JSON
  - Batch export with filters
  - Scheduled exports
  
- [ ] **Alerts & Notifications** - Real-time alerts for errors
  - Browser notifications
  - Email/Slack integration
  
- [ ] **Analytics Dashboard** - Visualize trends over time
  - Charts with Recharts or Chart.js
  - Response time trends
  - Error rate monitoring

### Developer Experience

- [ ] **Storybook** - Component documentation and visual testing
  - Isolated component development
  - Visual regression testing
  
- [ ] **E2E Testing** - Playwright for end-to-end tests
  - Critical user flows
  - Cross-browser testing
  
- [ ] **Performance Monitoring** - Integrate Sentry or LogRocket
  - Error tracking
  - Performance metrics
  - User session replay

### Accessibility

- [ ] **WCAG 2.1 AA Compliance** - Full accessibility audit
  - Keyboard navigation
  - Screen reader support
  - Color contrast improvements

---

## 🧪 Testing Strategy

### Overview

The project follows a comprehensive testing strategy with **80% code coverage** to ensure reliability and maintainability.

### Test Infrastructure

- **Framework**: Jest 30.2.0 with jsdom environment
- **Testing Library**: React Testing Library 16.3.0
- **Coverage Tool**: Istanbul (built into Jest)
- **CI Integration**: Automated tests on every PR via GitHub Actions

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- ResponseTable.test.tsx
```

### Coverage Reports

Coverage reports are automatically:
- Generated in `coverage/` directory
- Uploaded to Codecov on every CI run
- Displayed in PR comments
- Tracked over time for regression detection

View local coverage:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure ESLint passes (`npm run lint`)

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code coverage maintained or improved
- [ ] ESLint warnings resolved
- [ ] Documentation updated
- [ ] No console errors or warnings

## 📞 Support

For questions or issues:
- 📧 Email: support@bizscout.com
- 💬 GitHub Issues: [Create an issue](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/issues)
- 📖 Documentation: [View docs](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/wiki)

---

**Built with ❤️ by the BizScout Team**
