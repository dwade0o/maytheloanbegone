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
export type CalculatorType = "single" | "split" | "fixed-period";

// Loan type enum
export type LoanType = "single" | "split" | "fixed-period";

// Fixed period loan data with NZ loan structure
export interface FixedPeriodLoanData {
  loanAmount: string;
  totalLoanTermYears: string; // Total loan term (e.g., 30 years)
  loanStartDate: string; // When loan was first taken out
  currentBalance: string; // Current remaining balance
  interestRate: string; // Fixed rate during the period
  fixedRateStartDate: string; // When fixed rate begins
  fixedRateEndDate: string; // When fixed rate ends
  analysisStartDate: string; // User's selected start date
  analysisEndDate: string; // User's selected end date
}

// Fixed period results with NZ loan structure
export interface FixedPeriodResults {
  totalPeriod: {
    // Complete fixed rate period
    startDate: string;
    endDate: string;
    months: number;
    monthlyPrincipal: number;
    totalPaid: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
    paymentBreakdown: Array<{
      month: number;
      balance: number;
      principal: number;
      interest: number;
      totalPayment: number;
    }>;
  };
  selectedPeriod: {
    // User's selected time frame
    startDate: string;
    endDate: string;
    months: number;
    amountToPay: number;
    principalPaid: number;
    interestPaid: number;
  };
  futureEstimate?: {
    rate: string;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  };
}
