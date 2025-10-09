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

## 📞 Support

For questions or issues:
- 📧 Email: support@bizscout.com
- 💬 GitHub Issues: [Create an issue](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/issues)
- 📖 Documentation: [View docs](https://github.com/ShehzanChowdhury/assesment-bizscout-frontend/wiki)

---

**Built with ❤️ by the BizScout Team**
