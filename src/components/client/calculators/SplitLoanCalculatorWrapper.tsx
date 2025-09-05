'use client';

import dynamic from 'next/dynamic';

// Import the actual calculator component without SSR to prevent hydration issues
const LoanCalculator = dynamic(() => import('./LoanCalculator'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Advanced Loan Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Loading calculator...
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  ),
});

export default LoanCalculator;
