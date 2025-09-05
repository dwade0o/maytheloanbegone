'use client';

// Responsive layout is handled by the parent component
import {
  LoanResults as LoanResultsComponent,
  SplitLoanResults as SplitLoanResultsComponent,
  FixedPeriodResults,
  FixedRateLoanResults,
} from '@/components/server/loan';
import {
  CalculatorType,
  LoanResults,
  SplitLoanResults,
  FixedPeriodResults as FixedPeriodResultsType,
  FixedRateLoanResults as FixedRateLoanResultsType,
} from '@/types/loan';

interface CalculatorResultsProps {
  calculatorType: CalculatorType;
  results:
    | LoanResults
    | SplitLoanResults
    | FixedPeriodResultsType
    | FixedRateLoanResultsType
    | null;
}

export default function CalculatorResults({
  calculatorType,
  results,
}: CalculatorResultsProps) {
  const renderResults = () => {
    if (!results) return null;

    switch (calculatorType) {
      case 'single':
        return <LoanResultsComponent results={results as LoanResults} />;
      case 'split':
        return (
          <SplitLoanResultsComponent results={results as SplitLoanResults} />
        );
      case 'fixed-period':
        return (
          <FixedPeriodResults results={results as FixedPeriodResultsType} />
        );
      case 'fixed-rate':
        return (
          <FixedRateLoanResults results={results as FixedRateLoanResultsType} />
        );
      default:
        return null;
    }
  };

  return <div>{renderResults()}</div>;
}
