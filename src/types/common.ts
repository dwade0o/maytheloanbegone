// Common type definitions used across components
import {
  FormData,
  SplitLoanFormData,
  LoanTranche,
  FixedPeriodLoanData,
  FixedRateLoanFormData,
  FixedRatePeriod,
} from '@/constants/loanSchema';
import {
  LoanResults,
  SplitLoanResults,
  FixedPeriodResults,
} from '@/types/loan';
import { FieldError } from 'react-hook-form';

export interface DateRangeProps {
  startDate: {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
    disabled?: boolean;
  };
  endDate: {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
    disabled?: boolean;
  };
  period?: {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
  };
  periodType?: {
    value: 'days' | 'months' | 'years';
    onChange: (value: 'days' | 'months' | 'years') => void;
  };
  startLabel?: string;
  endLabel?: string;
  periodLabel?: string;
  className?: string;
}

export interface LoanFormProps {
  onSubmit: (data: FormData) => void;
  onReset: () => void;
  isCalculating?: boolean;
}

export interface LoanResultsProps {
  results: LoanResults | null;
  isCalculating?: boolean;
}

export interface SplitLoanFormProps {
  onSubmit: (data: SplitLoanFormData) => void;
  onReset: () => void;
  isCalculating?: boolean;
}

export interface SplitLoanResultsProps {
  results: SplitLoanResults | null;
  isCalculating?: boolean;
}

export interface FixedPeriodFormProps {
  onSubmit: (data: FixedPeriodLoanData & { futureRate?: string }) => void;
  onReset: () => void;
  isCalculating?: boolean;
}

export interface FixedPeriodResultsProps {
  results: FixedPeriodResults | null;
  isCalculating?: boolean;
}

export interface FixedRateLoanFormProps {
  onSubmit: (data: FixedRateLoanFormData) => void;
  onReset: () => void;
  isCalculating?: boolean;
}

export interface FixedRatePeriodProps {
  period: FixedRatePeriod;
  index: number;
  onUpdate: (fieldName: keyof FixedRatePeriod, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  isStartDateDisabled?: boolean;
  errors?: {
    interestRate?: FieldError;
    startDate?: FieldError;
    endDate?: FieldError;
    period?: FieldError;
  };
}

export interface LoanTrancheProps {
  tranche: LoanTranche;
  index: number;
  onUpdate: (field: keyof LoanTranche, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: {
    amount?: FieldError;
    interestRate?: FieldError;
    startDate?: FieldError;
    endDate?: FieldError;
    period?: FieldError;
  };
}
