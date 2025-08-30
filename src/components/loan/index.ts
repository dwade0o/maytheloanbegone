// Loan-specific components (now using common base components)
export { default as LoanForm } from './LoanForm';
export { default as LoanResults } from './LoanResults';
export { default as SplitLoanForm } from './SplitLoanForm';
export { default as SplitLoanResults } from './SplitLoanResults';
export { default as LoanTranche } from './LoanTranche';
export { default as FixedPeriodForm } from './FixedPeriodForm';
export { default as FixedPeriodResults } from './FixedPeriodResults';

// Re-export common components for backward compatibility
export { default as LoanFormBase } from '../common/LoanFormBase';
export { default as LoanResultsBase } from '../common/LoanResultsBase';
export { default as FormField } from '../common/FormField';
export { default as FeaturedResult } from '../common/FeaturedResult';
export { default as ResultRow } from '../common/ResultRow';
export { default as DateRange } from '../common/DateRange';
