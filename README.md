# May The Loan Be Gone 🏦

A sophisticated loan calculator built with React, Next.js, and TypeScript that helps users make informed financial decisions through comprehensive loan analysis.

![Loan Calculator](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Multiple Calculator Types**
  - Single Loan Calculator
  - Split Loan Calculator (multiple tranches)
  - Fixed Period Calculator
  - Fixed Rate Calculator (multiple rate periods)

- **Real-time Validation**
  - Progressive form validation (errors only show after user interaction)
  - Date range validation with automatic period calculation
  - Input validation with helpful error messages

- **Modern UI/UX**
  - Responsive design that works on all devices
  - Dark/light mode support
  - Clean, intuitive interface
  - Real-time calculations

- **Technical Highlights**
  - Built with Next.js 15 and React 18
  - TypeScript for type safety
  - Comprehensive test coverage with Jest
  - Modern CSS with Tailwind
  - Form handling with React Hook Form and Zod validation

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dwade0o/maytheloanbegone.git
   cd maytheloanbegone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint to check for code issues
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode

## 🧪 Testing

This project has comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**

- 249 tests across 16 test suites
- Unit tests for components, hooks, and utilities
- Integration tests for form validation
- Date calculation and loan calculation tests

## 📁 Project Structure

```
maytheloanbegone/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── calculator/         # Calculator-specific components
│   │   ├── common/             # Shared components
│   │   ├── fields/             # Form field components
│   │   ├── loan/               # Loan-specific components
│   │   └── ui/                 # UI component library
│   ├── constants/              # Configuration and schemas
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
├── __test__/                   # Test files
├── public/                     # Static assets
└── ...config files
```

## 🎯 Use Cases

- **Personal loan planning** - Calculate monthly payments and total interest
- **Mortgage calculations** - Plan home purchases with different scenarios
- **Investment property analysis** - Evaluate rental property investments
- **Financial planning** - Compare different loan options
- **Educational tool** - Learn about loan mechanics and amortization

## 🛠️ Tech Stack

- **Frontend:** React 18, Next.js 15, TypeScript
- **Styling:** Tailwind CSS, Lucide React icons
- **Forms:** React Hook Form, Zod validation
- **Testing:** Jest, React Testing Library
- **Development:** ESLint, Prettier, Husky
- **Deployment:** Vercel-ready

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Deploy to Other Platforms

```bash
# Build the project
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/dwade0o/maytheloanbegone/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy calculating! 🧮✨**
