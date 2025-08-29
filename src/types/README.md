# Types Organization

This folder contains all TypeScript type definitions and interfaces used throughout the application.

## Structure

- `loan.ts` - Loan-related types and interfaces
- `common.ts` - Shared component interfaces and common types
- `index.ts` - Barrel exports for easy importing

## Usage

Import types from the main types folder:

```typescript
// Import specific types
import { LoanResults, CalculatorType } from '@/types/loan';
import { DateRangeProps } from '@/types/common';

// Or import all types
import * as Types from '@/types';
```

## Type Categories

### Loan Types (`loan.ts`)
- `LoanResults` - Basic loan calculation results
- `TrancheResults` - Extended results for loan tranches
- `SplitLoanResults` - Combined results for split loans
- `CalculatorType` - Calculator mode ("single" | "split")
- `LoanType` - Loan type enum

### Common Types (`common.ts`)
- `DateRangeProps` - Date range component props
- `LoanFormProps` - Loan form component props
- `LoanResultsProps` - Results display component props
- `SplitLoanFormProps` - Split loan form component props
- `SplitLoanResultsProps` - Split results display component props
- `LoanTrancheProps` - Loan tranche component props

## Notes

- Zod schemas remain in `src/constants/loanSchema.ts` as they are validation schemas, not just types
- All component interfaces have been moved here for better organization
- Types are exported both individually and through the barrel export for flexibility
