import { FormData, LoanTranche, SplitLoanFormData } from "@/constants/loanSchema";
import { LoanResults, TrancheResults, SplitLoanResults } from "@/types/loan";

export const calculateLoan = async (data: FormData): Promise<LoanResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const principal = parseFloat(data.loanAmount);
  const annualRate = parseFloat(data.interestRate) / 100;
  const monthlyRate = annualRate / 12;
  
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  
  // Calculate loan term in months
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const daysDiff = endDate.getDate() - startDate.getDate();
  
  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff > 0) {
    totalMonths += daysDiff / 30; // Approximate additional days as fraction of month
  }
  
  // Monthly payment calculation using standard loan formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    // No interest case
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanTermMonths: Math.round(totalMonths),
  };
};

export const calculateLoanTranche = async (tranche: LoanTranche): Promise<TrancheResults> => {
  const principal = parseFloat(tranche.amount);
  const annualRate = parseFloat(tranche.interestRate) / 100;
  const monthlyRate = annualRate / 12;
  
  const startDate = new Date(tranche.startDate);
  const endDate = new Date(tranche.endDate);
  
  // Calculate loan term in months
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const daysDiff = endDate.getDate() - startDate.getDate();
  
  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff > 0) {
    totalMonths += daysDiff / 30; // Approximate additional days as fraction of month
  }
  
  // Monthly payment calculation using standard loan formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    // No interest case
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    id: tranche.id,
    label: tranche.label,
    principal,
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanTermMonths: Math.round(totalMonths),
  };
};

export const calculateSplitLoan = async (data: SplitLoanFormData): Promise<SplitLoanResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  // Calculate each tranche
  const trancheResults = await Promise.all(
    data.tranches.map(tranche => calculateLoanTranche(tranche))
  );

  // Calculate combined totals
  const totalPrincipal = trancheResults.reduce((sum, tranche) => sum + tranche.principal, 0);
  const totalMonthlyPayment = trancheResults.reduce((sum, tranche) => sum + tranche.monthlyPayment, 0);
  const totalPayment = trancheResults.reduce((sum, tranche) => sum + tranche.totalPayment, 0);
  const totalInterest = trancheResults.reduce((sum, tranche) => sum + tranche.totalInterest, 0);
  
  // Calculate weighted average loan term
  const weightedTermSum = trancheResults.reduce((sum, tranche) => {
    return sum + (tranche.loanTermMonths * tranche.principal);
  }, 0);
  const averageLoanTermMonths = Math.round(weightedTermSum / totalPrincipal);

  return {
    combined: {
      monthlyPayment: totalMonthlyPayment,
      totalPayment,
      totalInterest,
      loanTermMonths: averageLoanTermMonths,
    },
    tranches: trancheResults,
    totalPrincipal,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
