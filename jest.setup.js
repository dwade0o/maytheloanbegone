// Import Jest DOM matchers
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) =>
      require('react').createElement('div', props, children),
    span: ({ children, ...props }) =>
      require('react').createElement('span', props, children),
    button: ({ children, ...props }) =>
      require('react').createElement('button', props, children),
  },
  AnimatePresence: ({ children }) => children,
}));
