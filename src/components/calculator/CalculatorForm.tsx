'use client';

// Responsive layout is handled by the parent component
import {
  LoanForm,
  SplitLoanForm,
  FixedPeriodForm,
  FixedRateLoanForm,
} from '@/components/loan';
import { CalculatorType } from '@/types/loan';
// Form data types are handled by the individual form components

interface CalculatorFormProps {
  calculatorType: CalculatorType;
  onSubmit: (data: any) => void;
  onReset: () => void;
  isCalculating: boolean;
}

export default function CalculatorForm({
  calculatorType,
  onSubmit,
  onReset,
  isCalculating,
}: CalculatorFormProps) {
  const renderForm = () => {
    switch (calculatorType) {
      case 'single':
        return (
          <LoanForm
            onSubmit={onSubmit}
            onReset={onReset}
            isCalculating={isCalculating}
          />
        );
      case 'split':
        return (
          <SplitLoanForm
            onSubmit={onSubmit}
            onReset={onReset}
            isCalculating={isCalculating}
          />
        );
      case 'fixed-period':
        return (
          <FixedPeriodForm
            onSubmit={onSubmit}
            onReset={onReset}
            isCalculating={isCalculating}
          />
        );
      case 'fixed-rate':
        return (
          <FixedRateLoanForm
            onSubmit={onSubmit}
            onReset={onReset}
            isCalculating={isCalculating}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderForm()}</div>;
}
