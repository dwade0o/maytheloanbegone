import {
  FormData,
  SplitLoanFormData,
  LoanTranche,
  FixedPeriodLoanData,
  FixedRateLoanFormData,
} from '@/constants/loanSchema';
import {
  LoanResults,
  TrancheResults,
  SplitLoanResults,
  FixedPeriodResults,
  FixedRateLoanResults,
} from '@/types/loan';

export const calculateLoan = async (data: FormData): Promise<LoanResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const principal = parseFloat(data.loanAmount);
  const annualRate = parseFloat(data.interestRate) / 100;
  const monthlyRate = annualRate / 12;
  const weeklyRate = annualRate / 52;
  const fortnightlyRate = annualRate / 26;

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

  // Calculate total periods for each frequency
  const totalWeeks = totalMonths * (52 / 12); // Approximate weeks in months
  const totalFortnights = totalMonths * (26 / 12); // Approximate fortnights in months

  // Monthly payment calculation using standard loan formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // Weekly payment calculation
  let weeklyPayment: number;
  if (weeklyRate === 0) {
    weeklyPayment = principal / totalWeeks;
  } else {
    weeklyPayment =
      (principal * (weeklyRate * Math.pow(1 + weeklyRate, totalWeeks))) /
      (Math.pow(1 + weeklyRate, totalWeeks) - 1);
  }

  // Fortnightly payment calculation
  let fortnightlyPayment: number;
  if (fortnightlyRate === 0) {
    fortnightlyPayment = principal / totalFortnights;
  } else {
    fortnightlyPayment =
      (principal *
        (fortnightlyRate * Math.pow(1 + fortnightlyRate, totalFortnights))) /
      (Math.pow(1 + fortnightlyRate, totalFortnights) - 1);
  }

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    weeklyPayment,
    fortnightlyPayment,
    totalPayment,
    totalInterest,
    loanTermMonths: Math.round(totalMonths),
  };
};

export const calculateLoanTranche = async (
  tranche: LoanTranche
): Promise<TrancheResults> => {
  const principal = parseFloat(tranche.amount);
  const annualRate = parseFloat(tranche.interestRate) / 100;
  const monthlyRate = annualRate / 12;
  const weeklyRate = annualRate / 52;
  const fortnightlyRate = annualRate / 26;

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

  // Calculate total periods for each frequency
  const totalWeeks = totalMonths * (52 / 12);
  const totalFortnights = totalMonths * (26 / 12);

  // Monthly payment calculation using standard loan formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalMonths;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // Weekly payment calculation
  let weeklyPayment: number;
  if (weeklyRate === 0) {
    weeklyPayment = principal / totalWeeks;
  } else {
    weeklyPayment =
      (principal * (weeklyRate * Math.pow(1 + weeklyRate, totalWeeks))) /
      (Math.pow(1 + weeklyRate, totalWeeks) - 1);
  }

  // Fortnightly payment calculation
  let fortnightlyPayment: number;
  if (fortnightlyRate === 0) {
    fortnightlyPayment = principal / totalFortnights;
  } else {
    fortnightlyPayment =
      (principal *
        (fortnightlyRate * Math.pow(1 + fortnightlyRate, totalFortnights))) /
      (Math.pow(1 + fortnightlyRate, totalFortnights) - 1);
  }

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    id: tranche.id,
    label: tranche.label,
    principal,
    monthlyPayment,
    weeklyPayment,
    fortnightlyPayment,
    totalPayment,
    totalInterest,
    loanTermMonths: Math.round(totalMonths),
  };
};

export const calculateSplitLoan = async (
  data: SplitLoanFormData
): Promise<SplitLoanResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  // Calculate each tranche
  const trancheResults = await Promise.all(
    data.tranches.map(tranche => calculateLoanTranche(tranche))
  );

  // Calculate combined totals
  const totalPrincipal = trancheResults.reduce(
    (sum, tranche) => sum + tranche.principal,
    0
  );
  const totalMonthlyPayment = trancheResults.reduce(
    (sum, tranche) => sum + tranche.monthlyPayment,
    0
  );
  const totalPayment = trancheResults.reduce(
    (sum, tranche) => sum + tranche.totalPayment,
    0
  );
  const totalInterest = trancheResults.reduce(
    (sum, tranche) => sum + tranche.totalInterest,
    0
  );

  // Calculate weighted average loan term
  const weightedTermSum = trancheResults.reduce((sum, tranche) => {
    return sum + tranche.loanTermMonths * tranche.principal;
  }, 0);
  const averageLoanTermMonths = Math.round(weightedTermSum / totalPrincipal);

  return {
    combined: {
      monthlyPayment: totalMonthlyPayment,
      weeklyPayment: totalMonthlyPayment * (12 / 52), // Approximate weekly payment
      fortnightlyPayment: totalMonthlyPayment * (12 / 26), // Approximate fortnightly payment
      totalPayment,
      totalInterest,
      loanTermMonths: averageLoanTermMonths,
    },
    tranches: trancheResults,
    totalPrincipal,
  };
};

export const calculateFixedPeriodLoan = async (
  data: FixedPeriodLoanData,
  futureRate?: string
): Promise<FixedPeriodResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const originalLoanAmount = parseFloat(data.loanAmount);
  const totalLoanTermYears = parseFloat(data.totalLoanTermYears);
  const currentBalance = parseFloat(data.currentBalance);
  const annualRate = parseFloat(data.interestRate) / 100;
  const monthlyRate = annualRate / 12;

  const loanStartDate = new Date(data.loanStartDate);
  const fixedStartDate = new Date(data.fixedRateStartDate);
  const fixedEndDate = new Date(data.fixedRateEndDate);
  const analysisStartDate = new Date(data.analysisStartDate);
  const analysisEndDate = new Date(data.analysisEndDate);

  // Calculate total loan term in months
  const totalLoanTermMonths = totalLoanTermYears * 12;

  // Calculate fixed rate period in months
  const totalFixedMonths = calculateMonthsBetween(fixedStartDate, fixedEndDate);

  // Calculate analysis period in months
  const analysisMonths = calculateMonthsBetween(
    analysisStartDate,
    analysisEndDate
  );

  // Calculate monthly principal reduction (fixed amount)
  const monthlyPrincipal = originalLoanAmount / totalLoanTermMonths;

  // Calculate payment breakdown for fixed rate period
  let remainingBalance = currentBalance;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  const paymentBreakdown = [];

  for (let month = 0; month < totalFixedMonths; month++) {
    const monthInterest = remainingBalance * monthlyRate;
    const monthPrincipalPaid = monthlyPrincipal;
    const totalPayment = monthPrincipalPaid + monthInterest;

    paymentBreakdown.push({
      month: month + 1,
      balance: remainingBalance,
      principal: monthPrincipalPaid,
      interest: monthInterest,
      totalPayment: totalPayment,
    });

    totalPrincipalPaid += monthPrincipalPaid;
    totalInterestPaid += monthInterest;
    remainingBalance -= monthPrincipalPaid;
  }

  const totalPaid = totalPrincipalPaid + totalInterestPaid;

  // Calculate analysis period results
  const analysisStartMonth = calculateMonthsBetween(
    fixedStartDate,
    analysisStartDate
  );
  const analysisEndMonth = calculateMonthsBetween(
    fixedStartDate,
    analysisEndDate
  );

  let analysisPrincipalPaid = 0;
  let analysisInterestPaid = 0;
  let analysisBalance = currentBalance;

  // Calculate principal and interest for analysis period
  for (let month = 0; month < analysisEndMonth; month++) {
    const monthInterest = analysisBalance * monthlyRate;
    const monthPrincipalPaid = monthlyPrincipal;

    if (month >= analysisStartMonth) {
      analysisPrincipalPaid += monthPrincipalPaid;
      analysisInterestPaid += monthInterest;
    }

    analysisBalance -= monthPrincipalPaid;
  }

  const analysisAmountToPay =
    monthlyPrincipal * analysisMonths + analysisInterestPaid;

  // Calculate future estimate if rate provided
  let futureEstimate;
  if (futureRate) {
    const futureAnnualRate = parseFloat(futureRate) / 100;
    const futureMonthlyRate = futureAnnualRate / 12;

    // Calculate remaining payments after fixed period
    const remainingMonths =
      totalLoanTermMonths - calculateMonthsBetween(loanStartDate, fixedEndDate);

    let futureTotalInterest = 0;
    let futureBalance = remainingBalance;

    for (let month = 0; month < remainingMonths; month++) {
      const monthInterest = futureBalance * futureMonthlyRate;
      futureTotalInterest += monthInterest;
      futureBalance -= monthlyPrincipal;
    }

    const futureTotalPayment =
      monthlyPrincipal * remainingMonths + futureTotalInterest;

    futureEstimate = {
      rate: futureRate,
      monthlyPayment: monthlyPrincipal + remainingBalance * futureMonthlyRate,
      totalPayment: futureTotalPayment,
      totalInterest: futureTotalInterest,
    };
  }

  return {
    totalPeriod: {
      startDate: data.fixedRateStartDate,
      endDate: data.fixedRateEndDate,
      months: totalFixedMonths,
      monthlyPrincipal,
      totalPaid,
      principalPaid: totalPrincipalPaid,
      interestPaid: totalInterestPaid,
      remainingBalance,
      paymentBreakdown,
    },
    selectedPeriod: {
      startDate: data.analysisStartDate,
      endDate: data.analysisEndDate,
      months: analysisMonths,
      amountToPay: analysisAmountToPay,
      principalPaid: analysisPrincipalPaid,
      interestPaid: analysisInterestPaid,
    },
    futureEstimate,
  };
};

// Helper function to calculate months between two dates
const calculateMonthsBetween = (startDate: Date, endDate: Date): number => {
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const daysDiff = endDate.getDate() - startDate.getDate();

  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff > 0) {
    totalMonths += daysDiff / 30; // Approximate additional days as fraction of month
  }

  return Math.round(totalMonths);
};

export const calculateFixedRateLoan = async (
  data: FixedRateLoanFormData
): Promise<FixedRateLoanResults> => {
  // Simulate calculation delay for smooth UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const loanAmount = parseFloat(data.loanAmount);
  const loanStartDate = new Date(data.loanStartDate);
  const loanEndDate = new Date(data.loanEndDate);
  const totalLoanTermMonths = calculateMonthsBetween(
    loanStartDate,
    loanEndDate
  );

  // Calculate monthly principal reduction (fixed amount)
  const monthlyPrincipal = loanAmount / totalLoanTermMonths;

  const periods = data.fixedRatePeriods.map(period => {
    const periodStartDate = new Date(period.startDate);
    const periodEndDate = new Date(period.endDate);
    const periodMonths = calculateMonthsBetween(periodStartDate, periodEndDate);
    const annualRate = parseFloat(period.interestRate) / 100;
    const monthlyRate = annualRate / 12;

    let remainingBalance = loanAmount;
    let totalInterest = 0;
    const paymentBreakdown = [];

    // Calculate balance at start of this period
    const monthsFromLoanStart = calculateMonthsBetween(
      loanStartDate,
      periodStartDate
    );
    for (let month = 0; month < monthsFromLoanStart; month++) {
      remainingBalance -= monthlyPrincipal;
    }

    // Calculate payments for this period
    for (let month = 0; month < periodMonths; month++) {
      const monthInterest = remainingBalance * monthlyRate;
      const monthPrincipalPaid = monthlyPrincipal;
      const totalPayment = monthPrincipalPaid + monthInterest;

      paymentBreakdown.push({
        month: monthsFromLoanStart + month + 1,
        balance: remainingBalance,
        principal: monthPrincipalPaid,
        interest: monthInterest,
        totalPayment,
      });

      totalInterest += monthInterest;
      remainingBalance -= monthPrincipalPaid;
    }

    const totalPayment = monthlyPrincipal * periodMonths + totalInterest;
    const monthlyPayment = totalPayment / periodMonths;

    // Calculate weekly and fortnightly payments
    const weeklyRate = annualRate / 52;
    const fortnightlyRate = annualRate / 26;
    const totalWeeks = periodMonths * (52 / 12);
    const totalFortnights = periodMonths * (26 / 12);

    // Calculate weekly payment
    let weeklyPayment: number;
    if (weeklyRate === 0) {
      weeklyPayment = monthlyPrincipal / (52 / 12);
    } else {
      weeklyPayment =
        (monthlyPrincipal *
          (weeklyRate * Math.pow(1 + weeklyRate, totalWeeks))) /
        (Math.pow(1 + weeklyRate, totalWeeks) - 1);
    }

    // Calculate fortnightly payment
    let fortnightlyPayment: number;
    if (fortnightlyRate === 0) {
      fortnightlyPayment = monthlyPrincipal / (26 / 12);
    } else {
      fortnightlyPayment =
        (monthlyPrincipal *
          (fortnightlyRate * Math.pow(1 + fortnightlyRate, totalFortnights))) /
        (Math.pow(1 + fortnightlyRate, totalFortnights) - 1);
    }

    return {
      id: period.id,
      label: period.label,
      startDate: period.startDate,
      endDate: period.endDate,
      months: periodMonths,
      interestRate: annualRate * 100,
      monthlyPayment,
      weeklyPayment,
      fortnightlyPayment,
      totalPayment,
      totalInterest,
      principalPaid: monthlyPrincipal * periodMonths,
      paymentBreakdown,
    };
  });

  // Calculate summary
  const totalPayment = periods.reduce(
    (sum, period) => sum + period.totalPayment,
    0
  );
  const totalInterest = periods.reduce(
    (sum, period) => sum + period.totalInterest,
    0
  );
  const totalMonthsCovered = periods.reduce(
    (sum, period) => sum + period.months,
    0
  );
  const averageMonthlyPayment = totalPayment / totalMonthsCovered;
  const averageWeeklyPayment = averageMonthlyPayment * (12 / 52);
  const averageFortnightlyPayment = averageMonthlyPayment * (12 / 26);
  const coveragePercentage = (totalMonthsCovered / totalLoanTermMonths) * 100;

  return {
    loanAmount,
    loanStartDate: data.loanStartDate,
    loanEndDate: data.loanEndDate,
    totalLoanTermMonths,
    periods,
    summary: {
      totalPayment,
      totalInterest,
      averageMonthlyPayment,
      averageWeeklyPayment,
      averageFortnightlyPayment,
      coveragePercentage,
      monthsCovered: totalMonthsCovered,
    },
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
