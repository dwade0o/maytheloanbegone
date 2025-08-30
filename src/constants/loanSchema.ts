import * as z from 'zod';

// Individual loan tranche schema
export const loanTrancheSchema = z
  .object({
    id: z.string(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Amount must be a positive number'),
    interestRate: z
      .string()
      .min(1, 'Interest rate is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      }, 'Interest rate must be between 0 and 100'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    label: z.string().optional(),
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

// Split loan form schema (simplified - no manual total amount)
export const splitLoanFormSchema = z.object({
  loanType: z.enum(['single', 'split', 'fixed-period']),
  tranches: z
    .array(loanTrancheSchema)
    .min(1, 'At least one loan tranche is required'),
});

// Fixed period loan schema with NZ loan structure
export const fixedPeriodLoanSchema = z
  .object({
    loanAmount: z
      .string()
      .min(1, 'Original loan amount is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Original loan amount must be a positive number'),
    totalLoanTermYears: z
      .string()
      .min(1, 'Total loan term is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0 && num <= 50;
      }, 'Total loan term must be between 1 and 50 years'),
    loanStartDate: z.string().min(1, 'Loan start date is required'),
    currentBalance: z
      .string()
      .min(1, 'Current balance is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Current balance must be a positive number'),
    interestRate: z
      .string()
      .min(1, 'Interest rate is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      }, 'Interest rate must be between 0 and 100'),
    fixedRateStartDate: z.string().min(1, 'Fixed rate start date is required'),
    fixedRateEndDate: z.string().min(1, 'Fixed rate end date is required'),
    analysisStartDate: z.string().min(1, 'Analysis start date is required'),
    analysisEndDate: z.string().min(1, 'Analysis end date is required'),
  })
  .refine(
    data => {
      const loanStart = new Date(data.loanStartDate);
      const fixedStart = new Date(data.fixedRateStartDate);
      const fixedEnd = new Date(data.fixedRateEndDate);
      const analysisStart = new Date(data.analysisStartDate);
      const analysisEnd = new Date(data.analysisEndDate);

      // Loan start must be before fixed rate start
      if (fixedStart <= loanStart) return false;

      // Fixed rate period must be valid
      if (fixedEnd <= fixedStart) return false;

      // Analysis period must be within fixed rate period
      if (analysisStart < fixedStart || analysisEnd > fixedEnd) return false;

      // Analysis period must be valid
      if (analysisEnd <= analysisStart) return false;

      return true;
    },
    {
      message:
        'Dates must be in correct order: Loan Start → Fixed Rate Start → Analysis Start → Analysis End → Fixed Rate End',
      path: ['analysisEndDate'],
    }
  );

// Legacy single loan schema for backward compatibility
export const formSchema = z
  .object({
    loanAmount: z
      .string()
      .min(1, 'Loan amount is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Loan amount must be a positive number'),
    interestRate: z
      .string()
      .min(1, 'Interest rate is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      }, 'Interest rate must be between 0 and 100'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type LoanTranche = z.infer<typeof loanTrancheSchema>;
export type SplitLoanFormData = z.infer<typeof splitLoanFormSchema>;
export type FormData = z.infer<typeof formSchema>;
export type FixedPeriodLoanData = z.infer<typeof fixedPeriodLoanSchema>;
