'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Split, CreditCard, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  FormData,
  SplitLoanFormData,
  FixedPeriodLoanData,
} from '@/constants/loanSchema';
import {
  calculateLoan,
  calculateSplitLoan,
  calculateFixedPeriodLoan,
} from '@/lib/helper/loanCalculations';
import {
  LoanForm,
  LoanResults as LoanResultsComponent,
  SplitLoanForm,
  SplitLoanResults as SplitLoanResultsComponent,
  FixedPeriodForm,
  FixedPeriodResults,
} from '@/components/loan';
import {
  CalculatorType,
  LoanResults,
  SplitLoanResults,
  FixedPeriodResults as FixedPeriodResultsType,
} from '@/types/loan';

export default function SplitLoanCalculator() {
  const [calculatorType, setCalculatorType] =
    useState<CalculatorType>('single');
  const [singleResults, setSingleResults] = useState<LoanResults | null>(null);
  const [splitResults, setSplitResults] = useState<SplitLoanResults | null>(
    null
  );
  const [fixedPeriodResults, setFixedPeriodResults] =
    useState<FixedPeriodResultsType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSingleLoanCalculation = async (data: FormData) => {
    setIsCalculating(true);

    try {
      const results = await calculateLoan(data);
      setSingleResults(results);
    } catch (error) {
      console.error('Error calculating loan:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSplitLoanCalculation = async (data: SplitLoanFormData) => {
    setIsCalculating(true);

    try {
      const results = await calculateSplitLoan(data);
      setSplitResults(results);
    } catch (error) {
      console.error('Error calculating split loan:', error);
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
    } catch (error) {
      console.error('Error calculating fixed period loan:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSingleReset = () => {
    setSingleResults(null);
  };

  const handleSplitReset = () => {
    setSplitResults(null);
  };

  const handleFixedPeriodReset = () => {
    setFixedPeriodResults(null);
  };

  const switchCalculatorType = (type: CalculatorType) => {
    setCalculatorType(type);
    // Don't reset form data when switching - only clear results
    setSingleResults(null);
    setSplitResults(null);
    setFixedPeriodResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Advanced Loan Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Calculate payments for single loans, split loans, or fixed period
            loans with realistic rate change scenarios
          </p>

          {/* Calculator Type Selector */}
          <div className="flex justify-center gap-4">
            <Button
              variant={calculatorType === 'single' ? 'default' : 'outline'}
              onClick={() => switchCalculatorType('single')}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Single Loan
              <Badge variant="secondary" className="ml-2">
                Simple
              </Badge>
            </Button>
            <Button
              variant={calculatorType === 'split' ? 'default' : 'outline'}
              onClick={() => switchCalculatorType('split')}
              className="flex items-center gap-2"
            >
              <Split className="h-4 w-4" />
              Split Loan
              <Badge variant="secondary" className="ml-2">
                Advanced
              </Badge>
            </Button>
            <Button
              variant={
                calculatorType === 'fixed-period' ? 'default' : 'outline'
              }
              onClick={() => switchCalculatorType('fixed-period')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Fixed Period
              <Badge variant="secondary" className="ml-2">
                Realistic
              </Badge>
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            {/* Single Loan Form */}
            <div className={calculatorType === 'single' ? 'block' : 'hidden'}>
              <LoanForm
                onSubmit={handleSingleLoanCalculation}
                onReset={handleSingleReset}
                isCalculating={isCalculating && calculatorType === 'single'}
              />
            </div>

            {/* Split Loan Form */}
            <div className={calculatorType === 'split' ? 'block' : 'hidden'}>
              <SplitLoanForm
                onSubmit={handleSplitLoanCalculation}
                onReset={handleSplitReset}
                isCalculating={isCalculating && calculatorType === 'split'}
              />
            </div>

            {/* Fixed Period Form */}
            <div
              className={calculatorType === 'fixed-period' ? 'block' : 'hidden'}
            >
              <FixedPeriodForm
                onSubmit={handleFixedPeriodCalculation}
                onReset={handleFixedPeriodReset}
                isCalculating={
                  isCalculating && calculatorType === 'fixed-period'
                }
              />
            </div>
          </div>

          {/* Results Section */}
          <div>
            {calculatorType === 'single' ? (
              <LoanResultsComponent results={singleResults} />
            ) : calculatorType === 'split' ? (
              <SplitLoanResultsComponent results={splitResults} />
            ) : (
              <FixedPeriodResults results={fixedPeriodResults} />
            )}
          </div>
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Single Loan</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Traditional loan calculation with one amount, interest rate, and
                term. Perfect for mortgages, personal loans, or auto financing.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <Split className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Split Loan</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Break your loan into multiple tranches with different amounts,
                rates, and terms. Ideal for complex financing scenarios.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fixed Period</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Calculate payments for loans with known fixed rates for specific
                periods. Perfect for adjustable-rate mortgages and rate change
                planning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
