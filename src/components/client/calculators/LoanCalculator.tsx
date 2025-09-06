'use client';

import { useState } from 'react';
import { useCalculatorManager } from '@/hooks/useCalculatorManager';
import {
  CalculatorSelector,
  CalculatorForm,
  CalculatorResults,
} from '@/components/client/calculator';
import { FeaturesInfo } from '@/components/server/common';
import FAQSection from '@/components/shared/FAQSection';
import {
  ResponsiveAdSenseAd,
  AdSenseRectangleAd,
  AdSenseBannerAd,
} from '@/components/shared/AdSenseAd';
import { getAdSenseSettings } from '@/config/adsense';
import {
  FormData,
  SplitLoanFormData,
  FixedPeriodLoanData,
  FixedRateLoanFormData,
} from '@/constants/loanSchema';
import {
  calculateLoan,
  calculateSplitLoan,
  calculateFixedPeriodLoan,
  calculateFixedRateLoan,
} from '@/lib/helper/loanCalculations';
import {
  LoanResults,
  SplitLoanResults,
  FixedPeriodResults as FixedPeriodResultsType,
  FixedRateLoanResults as FixedRateLoanResultsType,
} from '@/types/loan';

export default function LoanCalculator() {
  const { calculatorType, switchCalculatorType } = useCalculatorManager();
  const adSenseSettings = getAdSenseSettings();

  // Results state
  const [singleResults, setSingleResults] = useState<LoanResults | null>(null);
  const [splitResults, setSplitResults] = useState<SplitLoanResults | null>(
    null
  );
  const [fixedPeriodResults, setFixedPeriodResults] =
    useState<FixedPeriodResultsType | null>(null);
  const [fixedRateResults, setFixedRateResults] =
    useState<FixedRateLoanResultsType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculation handlers
  const handleSingleLoanCalculation = async (data: FormData) => {
    setIsCalculating(true);
    try {
      const results = await calculateLoan(data);
      setSingleResults(results);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSplitLoanCalculation = async (data: SplitLoanFormData) => {
    setIsCalculating(true);
    try {
      const results = await calculateSplitLoan(data);
      setSplitResults(results);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFixedPeriodCalculation = async (
    data: FixedPeriodLoanData & { futureRate?: string }
  ) => {
    setIsCalculating(true);
    try {
      const results = await calculateFixedPeriodLoan(data, data.futureRate);
      setFixedPeriodResults(results);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFixedRateCalculation = async (data: FixedRateLoanFormData) => {
    setIsCalculating(true);
    try {
      const results = await calculateFixedRateLoan(data);
      setFixedRateResults(results);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsCalculating(false);
    }
  };

  // Reset handlers
  const handleSingleReset = () => setSingleResults(null);
  const handleSplitReset = () => setSplitResults(null);
  const handleFixedPeriodReset = () => setFixedPeriodResults(null);
  const handleFixedRateReset = () => setFixedRateResults(null);

  // Get current results and handler
  const getCurrentResults = () => {
    switch (calculatorType) {
      case 'single':
        return singleResults;
      case 'split':
        return splitResults;
      case 'fixed-period':
        return fixedPeriodResults;
      case 'fixed-rate':
        return fixedRateResults;
      default:
        return null;
    }
  };

  const getCurrentHandler = () => {
    switch (calculatorType) {
      case 'single':
        return handleSingleLoanCalculation;
      case 'split':
        return handleSplitLoanCalculation;
      case 'fixed-period':
        return handleFixedPeriodCalculation;
      case 'fixed-rate':
        return handleFixedRateCalculation;
      default:
        return () => {};
    }
  };

  const getCurrentResetHandler = () => {
    switch (calculatorType) {
      case 'single':
        return handleSingleReset;
      case 'split':
        return handleSplitReset;
      case 'fixed-period':
        return handleFixedPeriodReset;
      case 'fixed-rate':
        return handleFixedRateReset;
      default:
        return () => {};
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            May the loan be gone
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Free Online Loan Calculator
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Calculate loan payments, compare different scenarios, and make
            informed financial decisions with our comprehensive loan calculator
            suite. Support for single loans, split loans, fixed period, and
            fixed rate loans.
          </p>
        </header>

        {/* Calculator Selector */}
        <CalculatorSelector
          calculatorType={calculatorType}
          onCalculatorChange={switchCalculatorType}
        />

        {/* Above-the-fold Ad - AdSense (Hidden for now) */}
        {/* <div className="mb-8">
          <ResponsiveAdSenseAd
            clientId={adSenseSettings.clientId}
            slotId={adSenseSettings.slots.TOP_BANNER}
          />
        </div> */}

        {/* Calculator Form and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CalculatorForm
            calculatorType={calculatorType}
            onSubmit={getCurrentHandler()}
            onReset={getCurrentResetHandler()}
            isCalculating={isCalculating}
          />

          <CalculatorResults
            calculatorType={calculatorType}
            results={getCurrentResults()}
          />
        </div>

        {/* Between Content Ad - AdSense Rectangle (Hidden for now) */}
        {/* <div className="my-8 flex justify-center">
          <AdSenseRectangleAd
            clientId={adSenseSettings.clientId}
            slotId={adSenseSettings.slots.MIDDLE_RECTANGLE}
          />
        </div> */}

        {/* Features Info - Server Component */}
        <FeaturesInfo />

        {/* FAQ Section for SEO */}
        <FAQSection />

        {/* Bottom Ad - AdSense Banner (Hidden for now) */}
        {/* <div className="mt-8">
          <AdSenseBannerAd
            clientId={adSenseSettings.clientId}
            slotId={adSenseSettings.slots.BOTTOM_BANNER}
          />
        </div> */}
      </div>
    </div>
  );
}
