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
    period: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Period must be a positive number'),
    periodType: z.enum(['days', 'months', 'years']).optional(),
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

// Fixed rate period schema for different interest rates over time
export const fixedRatePeriodSchema = z
  .object({
    id: z.string(),
    interestRate: z
      .string()
      .min(1, 'Interest rate is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      }, 'Interest rate must be between 0 and 100'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    period: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Period must be a positive number'),
    periodType: z.enum(['days', 'months', 'years']).optional(),
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

// Fixed rate loan form schema
export const fixedRateLoanFormSchema = z
  .object({
    loanType: z.enum(['single', 'split', 'fixed-period', 'fixed-rate']),
    loanAmount: z
      .string()
      .min(1, 'Loan amount is required')
      .refine(val => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 'Loan amount must be a positive number'),
    loanStartDate: z.string().min(1, 'Loan start date is required'),
    loanEndDate: z.string().min(1, 'Loan end date is required'),
    loanPeriod: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Period must be a positive number'),
    loanPeriodType: z.enum(['days', 'months', 'years']).optional(),
    fixedRatePeriods: z
      .array(fixedRatePeriodSchema)
      .min(1, 'At least one fixed rate period is required'),
  })
  .refine(
    data => {
      const loanStart = new Date(data.loanStartDate);
      const loanEnd = new Date(data.loanEndDate);

      // Loan period must be valid
      if (loanEnd <= loanStart) return false;

      // All fixed rate periods must be within loan period
      for (const period of data.fixedRatePeriods) {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);

        if (periodStart < loanStart || periodEnd > loanEnd) return false;
      }

      // Fixed rate periods should be sequential (no gaps, no overlaps)
      for (let i = 0; i < data.fixedRatePeriods.length - 1; i++) {
        const currentPeriod = data.fixedRatePeriods[i];
        const nextPeriod = data.fixedRatePeriods[i + 1];

        const currentEnd = new Date(currentPeriod.endDate);
        const nextStart = new Date(nextPeriod.startDate);

        // Next period should start exactly when current period ends
        if (currentEnd.getTime() !== nextStart.getTime()) return false;
      }

      return true;
    },
    {
      message: 'Fixed rate periods must be sequential and within loan period',
      path: ['fixedRatePeriods'],
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
    fixedRatePeriod: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Fixed rate period must be a positive number'),
    fixedRatePeriodType: z.enum(['days', 'months', 'years']).optional(),
    analysisStartDate: z.string().min(1, 'Analysis start date is required'),
    analysisEndDate: z.string().min(1, 'Analysis end date is required'),
    analysisPeriod: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Analysis period must be a positive number'),
    analysisPeriodType: z.enum(['days', 'months', 'years']).optional(),
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
    period: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      }, 'Period must be a positive number'),
    periodType: z.enum(['days', 'months', 'years']).optional(),
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
export type FixedRatePeriod = z.infer<typeof fixedRatePeriodSchema>;
export type SplitLoanFormData = z.infer<typeof splitLoanFormSchema>;
export type FormData = z.infer<typeof formSchema>;
export type FixedPeriodLoanData = z.infer<typeof fixedPeriodLoanSchema>;
export type FixedRateLoanFormData = z.infer<typeof fixedRateLoanFormSchema>;
