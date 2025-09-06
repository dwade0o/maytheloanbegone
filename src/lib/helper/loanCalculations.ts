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

  // Calculate loan term in months using improved precision
  const totalMonths = calculateMonthsBetween(startDate, endDate);

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

  // Calculate loan term in months using improved precision
  const totalMonths = calculateMonthsBetween(startDate, endDate);

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

  // const originalLoanAmount = parseFloat(data.loanAmount);
  const totalLoanTermYears = parseFloat(data.totalLoanTermYears);
  const currentBalance = parseFloat(data.currentBalance);
  const annualRate = parseFloat(data.interestRate) / 100;
  const monthlyRate = annualRate / 12;
  const weeklyRate = annualRate / 52;
  const fortnightlyRate = annualRate / 26;

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

  // Calculate fixed monthly payment using remaining loan term
  // This ensures the payment is realistic for the remaining loan period
  const remainingMonthsFromLoanStart =
    totalLoanTermMonths - calculateMonthsBetween(loanStartDate, fixedStartDate);

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = currentBalance / remainingMonthsFromLoanStart;
  } else {
    monthlyPayment =
      (currentBalance *
        (monthlyRate *
          Math.pow(1 + monthlyRate, remainingMonthsFromLoanStart))) /
      (Math.pow(1 + monthlyRate, remainingMonthsFromLoanStart) - 1);
  }

  // Calculate weekly and fortnightly payments using the same approach
  const remainingWeeksFromLoanStart = remainingMonthsFromLoanStart * (52 / 12);
  const remainingFortnightsFromLoanStart =
    remainingMonthsFromLoanStart * (26 / 12);

  let weeklyPayment: number;
  if (weeklyRate === 0) {
    weeklyPayment = currentBalance / remainingWeeksFromLoanStart;
  } else {
    weeklyPayment =
      (currentBalance *
        (weeklyRate * Math.pow(1 + weeklyRate, remainingWeeksFromLoanStart))) /
      (Math.pow(1 + weeklyRate, remainingWeeksFromLoanStart) - 1);
  }

  let fortnightlyPayment: number;
  if (fortnightlyRate === 0) {
    fortnightlyPayment = currentBalance / remainingFortnightsFromLoanStart;
  } else {
    fortnightlyPayment =
      (currentBalance *
        (fortnightlyRate *
          Math.pow(1 + fortnightlyRate, remainingFortnightsFromLoanStart))) /
      (Math.pow(1 + fortnightlyRate, remainingFortnightsFromLoanStart) - 1);
  }

  // Calculate payment breakdown for fixed rate period
  let remainingBalance = currentBalance;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  const paymentBreakdown = [];

  for (let month = 0; month < totalFixedMonths; month++) {
    const monthInterest = remainingBalance * monthlyRate;
    const monthPrincipalPaid = monthlyPayment - monthInterest;
    const totalPayment = monthlyPayment;

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

  // Calculate principal and interest for analysis period using fixed payment
  for (let month = 0; month < analysisEndMonth; month++) {
    const monthInterest = analysisBalance * monthlyRate;
    const monthPrincipalPaid = monthlyPayment - monthInterest;

    if (month >= analysisStartMonth) {
      analysisPrincipalPaid += monthPrincipalPaid;
      analysisInterestPaid += monthInterest;
    }

    analysisBalance -= monthPrincipalPaid;
  }

  const analysisAmountToPay = monthlyPayment * analysisMonths;

  // Calculate future estimate if rate provided
  let futureEstimate;
  if (futureRate) {
    const futureAnnualRate = parseFloat(futureRate) / 100;
    const futureMonthlyRate = futureAnnualRate / 12;

    // Calculate remaining payments after fixed period
    const remainingMonths =
      totalLoanTermMonths - calculateMonthsBetween(loanStartDate, fixedEndDate);

    // Calculate fixed payment for remaining period using future rate
    let futureMonthlyPayment: number;
    if (futureMonthlyRate === 0) {
      futureMonthlyPayment = remainingBalance / remainingMonths;
    } else {
      futureMonthlyPayment =
        (remainingBalance *
          (futureMonthlyRate *
            Math.pow(1 + futureMonthlyRate, remainingMonths))) /
        (Math.pow(1 + futureMonthlyRate, remainingMonths) - 1);
    }

    const futureTotalPayment = futureMonthlyPayment * remainingMonths;
    const futureTotalInterest = futureTotalPayment - remainingBalance;

    futureEstimate = {
      rate: futureRate,
      monthlyPayment: futureMonthlyPayment,
      totalPayment: futureTotalPayment,
      totalInterest: futureTotalInterest,
    };
  }

  // Calculate average monthly principal reduction over the fixed period
  const averageMonthlyPrincipal = totalPrincipalPaid / totalFixedMonths;

  return {
    totalPeriod: {
      startDate: data.fixedRateStartDate,
      endDate: data.fixedRateEndDate,
      months: totalFixedMonths,
      monthlyPayment,
      weeklyPayment,
      fortnightlyPayment,
      monthlyPrincipal: averageMonthlyPrincipal,
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

// Helper function to calculate months between two dates with improved precision
const calculateMonthsBetween = (startDate: Date, endDate: Date): number => {
  // Use UTC to avoid timezone issues, consistent with dateCalculations.ts
  const start = new Date(
    startDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
  );
  const end = new Date(endDate.toISOString().split('T')[0] + 'T00:00:00.000Z');

  const yearsDiff = end.getUTCFullYear() - start.getUTCFullYear();
  const monthsDiff = end.getUTCMonth() - start.getUTCMonth();
  const daysDiff = end.getUTCDate() - start.getUTCDate();

  let totalMonths = yearsDiff * 12 + monthsDiff;

  // More precise day calculation using actual days in the month
  if (daysDiff > 0) {
    const daysInStartMonth = new Date(
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      0
    ).getUTCDate();
    totalMonths += daysDiff / daysInStartMonth;
  } else if (daysDiff < 0) {
    const daysInEndMonth = new Date(
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      0
    ).getUTCDate();
    totalMonths += daysDiff / daysInEndMonth;
  }

  return Math.round(totalMonths * 100) / 100; // Round to 2 decimal places for precision
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

  // Validate periods for overlaps and gaps
  const sortedPeriods = [...data.fixedRatePeriods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Check for overlaps
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const currentEnd = new Date(sortedPeriods[i].endDate);
    const nextStart = new Date(sortedPeriods[i + 1].startDate);
    if (currentEnd > nextStart) {
      throw new Error(`Period ${i + 1} overlaps with period ${i + 2}`);
    }
  }

  // Track running balance across all periods
  let runningBalance = loanAmount;
  const periods = sortedPeriods.map(period => {
    const periodStartDate = new Date(period.startDate);
    const periodEndDate = new Date(period.endDate);
    const periodMonths = calculateMonthsBetween(periodStartDate, periodEndDate);
    const annualRate = parseFloat(period.interestRate) / 100;
    const monthlyRate = annualRate / 12;

    // Calculate the remaining months after this period for proper amortization
    const monthsFromLoanStart = calculateMonthsBetween(
      loanStartDate,
      periodStartDate
    );
    const remainingMonthsAfterThisPeriod =
      totalLoanTermMonths - monthsFromLoanStart;

    // Calculate fixed payment for this period based on remaining balance
    // but amortized over the remaining loan term (not just this period)
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = runningBalance / remainingMonthsAfterThisPeriod;
    } else {
      monthlyPayment =
        (runningBalance *
          (monthlyRate *
            Math.pow(1 + monthlyRate, remainingMonthsAfterThisPeriod))) /
        (Math.pow(1 + monthlyRate, remainingMonthsAfterThisPeriod) - 1);
    }

    // Calculate weekly and fortnightly payments using the same approach
    const weeklyRate = annualRate / 52;
    const fortnightlyRate = annualRate / 26;
    const remainingWeeksAfterThisPeriod =
      remainingMonthsAfterThisPeriod * (52 / 12);
    const remainingFortnightsAfterThisPeriod =
      remainingMonthsAfterThisPeriod * (26 / 12);

    let weeklyPayment: number;
    let fortnightlyPayment: number;

    if (weeklyRate === 0) {
      weeklyPayment = runningBalance / remainingWeeksAfterThisPeriod;
    } else {
      weeklyPayment =
        (runningBalance *
          (weeklyRate *
            Math.pow(1 + weeklyRate, remainingWeeksAfterThisPeriod))) /
        (Math.pow(1 + weeklyRate, remainingWeeksAfterThisPeriod) - 1);
    }

    if (fortnightlyRate === 0) {
      fortnightlyPayment = runningBalance / remainingFortnightsAfterThisPeriod;
    } else {
      fortnightlyPayment =
        (runningBalance *
          (fortnightlyRate *
            Math.pow(
              1 + fortnightlyRate,
              remainingFortnightsAfterThisPeriod
            ))) /
        (Math.pow(1 + fortnightlyRate, remainingFortnightsAfterThisPeriod) - 1);
    }

    // Calculate payment breakdown for this period
    let periodBalance = runningBalance;
    let totalInterest = 0;
    let totalPrincipalPaid = 0;
    const paymentBreakdown = [];

    for (let month = 0; month < periodMonths; month++) {
      const monthInterest = periodBalance * monthlyRate;
      const monthPrincipalPaid = monthlyPayment - monthInterest;
      const totalPayment = monthlyPayment;

      paymentBreakdown.push({
        month:
          calculateMonthsBetween(loanStartDate, periodStartDate) + month + 1,
        balance: periodBalance,
        principal: monthPrincipalPaid,
        interest: monthInterest,
        totalPayment: totalPayment,
      });

      totalInterest += monthInterest;
      totalPrincipalPaid += monthPrincipalPaid;
      periodBalance -= monthPrincipalPaid;
    }

    // Update running balance for next period
    runningBalance = periodBalance;

    const totalPayment = monthlyPayment * periodMonths;

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
      principalPaid: totalPrincipalPaid,
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
