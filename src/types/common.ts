// Common type definitions used across components
import { FormData, SplitLoanFormData, LoanTranche } from "@/constants/loanSchema";
import { LoanResults, SplitLoanResults } from "@/types/loan";
import { FieldError } from "react-hook-form";

export interface DateRangeProps {
  startDate: {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
  };
  endDate: {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
  };
  startLabel?: string;
  endLabel?: string;
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
  };
}
