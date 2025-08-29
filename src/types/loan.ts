// Loan-related type definitions
export interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanTermMonths: number;
}

export interface TrancheResults extends LoanResults {
  id: string;
  label?: string;
  principal: number;
}

export interface SplitLoanResults {
  combined: LoanResults;
  tranches: TrancheResults[];
  totalPrincipal: number;
}

// Calculator type
export type CalculatorType = "single" | "split";

// Loan type enum
export type LoanType = "single" | "split";
