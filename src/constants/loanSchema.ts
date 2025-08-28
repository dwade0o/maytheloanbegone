import * as z from "zod";

// Individual loan tranche schema
export const loanTrancheSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  interestRate: z.string().min(1, "Interest rate is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Interest rate must be between 0 and 100"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  label: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Split loan form schema
export const splitLoanFormSchema = z.object({
  loanType: z.enum(["single", "split"]),
  totalAmount: z.string().optional(),
  tranches: z.array(loanTrancheSchema).min(1, "At least one loan tranche is required"),
}).refine((data) => {
  if (data.loanType === "split") {
    const totalTranches = data.tranches.reduce((sum, tranche) => {
      return sum + parseFloat(tranche.amount || "0");
    }, 0);
    const targetTotal = parseFloat(data.totalAmount || "0");
    
    // Allow some tolerance for floating point precision
    return Math.abs(totalTranches - targetTotal) < 0.01;
  }
  return true;
}, {
  message: "Sum of tranches must equal the total loan amount",
  path: ["tranches"],
});

// Legacy single loan schema for backward compatibility
export const formSchema = z.object({
  loanAmount: z.string().min(1, "Loan amount is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Loan amount must be a positive number"),
  interestRate: z.string().min(1, "Interest rate is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Interest rate must be between 0 and 100"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type LoanTranche = z.infer<typeof loanTrancheSchema>;
export type SplitLoanFormData = z.infer<typeof splitLoanFormSchema>;
export type FormData = z.infer<typeof formSchema>;
