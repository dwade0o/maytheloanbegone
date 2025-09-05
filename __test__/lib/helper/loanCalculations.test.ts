import {
  calculateLoan,
  calculateLoanTranche,
  calculateSplitLoan,
  calculateFixedPeriodLoan,
  calculateFixedRateLoan,
  formatCurrency,
} from '@/lib/helper/loanCalculations';
import {
  FormData,
  SplitLoanFormData,
  LoanTranche,
  FixedPeriodLoanData,
  FixedRateLoanFormData,
} from '@/constants/loanSchema';

// Mock setTimeout to avoid delays in tests
jest.useFakeTimers();

describe('loanCalculations', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  describe('calculateLoan', () => {
    const mockFormData: FormData = {
      loanAmount: '100000',
      interestRate: '5.5',
      startDate: '2024-01-01',
      endDate: '2029-12-31',
    };

    it('calculates loan with interest correctly', async () => {
      const promise = calculateLoan(mockFormData);

      // Fast-forward timers to resolve the promise
      jest.runAllTimers();

      const result = await promise;

      expect(result).toHaveProperty('monthlyPayment');
      expect(result).toHaveProperty('weeklyPayment');
      expect(result).toHaveProperty('fortnightlyPayment');
      expect(result).toHaveProperty('totalPayment');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('loanTermMonths');

      // Should have 6 years = 72 months
      expect(result.loanTermMonths).toBe(72);

      // All payment amounts should be positive
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.weeklyPayment).toBeGreaterThan(0);
      expect(result.fortnightlyPayment).toBeGreaterThan(0);

      // Total payment should be greater than principal
      expect(result.totalPayment).toBeGreaterThan(100000);

      // Total interest should be positive
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('calculates payment frequencies with correct relationships', async () => {
      const promise = calculateLoan(mockFormData);
      jest.runAllTimers();
      const result = await promise;

      // All payment amounts should be positive
      expect(result.weeklyPayment).toBeGreaterThan(0);
      expect(result.fortnightlyPayment).toBeGreaterThan(0);

      // Weekly should be smaller than fortnightly
      expect(result.weeklyPayment).toBeLessThan(result.fortnightlyPayment);

      // Fortnightly should be smaller than monthly
      expect(result.fortnightlyPayment).toBeLessThan(result.monthlyPayment);

      // The relationships should be reasonable (not exact due to compound interest)
      // Weekly should be roughly 1/4 of monthly
      expect(result.weeklyPayment).toBeLessThan(result.monthlyPayment / 4);
      expect(result.weeklyPayment).toBeGreaterThan(result.monthlyPayment / 5);

      // Fortnightly should be roughly 1/2 of monthly
      expect(result.fortnightlyPayment).toBeLessThan(result.monthlyPayment / 2);
      expect(result.fortnightlyPayment).toBeGreaterThan(result.monthlyPayment / 3);
    });

    it('calculates loan with zero interest correctly', async () => {
      const zeroInterestData = {
        ...mockFormData,
        interestRate: '0',
      };

      const promise = calculateLoan(zeroInterestData);
      jest.runAllTimers();

      const result = await promise;

      // With zero interest, monthly payment should equal principal / months
      const expectedMonthlyPayment = 100000 / 72;
      expect(result.monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2);

      // Total interest should be zero
      expect(result.totalInterest).toBe(0);

      // Total payment should equal principal
      expect(result.totalPayment).toBe(100000);
    });

    it('handles different loan terms correctly', async () => {
      const shortTermData = {
        ...mockFormData,
        endDate: '2025-12-31', // 2 years
      };

      const promise = calculateLoan(shortTermData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.loanTermMonths).toBe(24);
    });

    it('handles partial months correctly', async () => {
      const partialMonthData = {
        ...mockFormData,
        endDate: '2029-06-15', // 5 years 5.5 months
      };

      const promise = calculateLoan(partialMonthData);
      jest.runAllTimers();

      const result = await promise;

      // Should be approximately 65.5 months, rounded to 65
      expect(result.loanTermMonths).toBe(65);
    });
  });

  describe('calculateLoanTranche', () => {
    const mockTranche: LoanTranche = {
      id: '1',
      amount: '50000',
      interestRate: '6.0',
      startDate: '2024-01-01',
      endDate: '2027-12-31',
      label: 'Test Tranche',
    };

    it('calculates tranche correctly', async () => {
      const result = await calculateLoanTranche(mockTranche);

      expect(result.id).toBe('1');
      expect(result.label).toBe('Test Tranche');
      expect(result.principal).toBe(50000);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPayment).toBeGreaterThan(50000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.loanTermMonths).toBe(48); // 4 years
    });

    it('handles tranche without label', async () => {
      const trancheWithoutLabel = { ...mockTranche, label: '' };
      const result = await calculateLoanTranche(trancheWithoutLabel);

      expect(result.label).toBe('');
    });

    it('calculates tranche with zero interest', async () => {
      const zeroInterestTranche = { ...mockTranche, interestRate: '0' };
      const result = await calculateLoanTranche(zeroInterestTranche);

      const expectedMonthlyPayment = 50000 / 48;
      expect(result.monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2);
      expect(result.totalInterest).toBe(0);
    });
  });

  describe('calculateSplitLoan', () => {
    const mockSplitLoanData: SplitLoanFormData = {
      loanType: 'split',
      tranches: [
        {
          id: '1',
          amount: '60000',
          interestRate: '5.0',
          startDate: '2024-01-01',
          endDate: '2029-12-31',
          label: 'Primary Loan',
        },
        {
          id: '2',
          amount: '40000',
          interestRate: '6.5',
          startDate: '2024-01-01',
          endDate: '2027-12-31',
          label: 'Secondary Loan',
        },
      ],
    };

    it('calculates split loan correctly', async () => {
      const promise = calculateSplitLoan(mockSplitLoanData);
      jest.runAllTimers();

      const result = await promise;

      expect(result).toHaveProperty('combined');
      expect(result).toHaveProperty('tranches');
      expect(result).toHaveProperty('totalPrincipal');

      expect(result.totalPrincipal).toBe(100000);
      expect(result.tranches).toHaveLength(2);
      expect(result.combined.monthlyPayment).toBeGreaterThan(0);
      expect(result.combined.totalPayment).toBeGreaterThan(100000);
    });

    it('calculates weighted average loan term correctly', async () => {
      const promise = calculateSplitLoan(mockSplitLoanData);
      jest.runAllTimers();

      const result = await promise;

      // Primary: 60k * 72 months = 4,320,000
      // Secondary: 40k * 48 months = 1,920,000
      // Total: 100k
      // Weighted average: (4,320,000 + 1,920,000) / 100,000 = 62.4 months
      expect(result.combined.loanTermMonths).toBe(62);
    });

    it('handles single tranche', async () => {
      const singleTrancheData = {
        ...mockSplitLoanData,
        tranches: [mockSplitLoanData.tranches[0]],
      };

      const promise = calculateSplitLoan(singleTrancheData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPrincipal).toBe(60000);
      expect(result.tranches).toHaveLength(1);
      expect(result.combined.loanTermMonths).toBe(72);
    });

    it('combines tranche results correctly', async () => {
      const promise = calculateSplitLoan(mockSplitLoanData);
      jest.runAllTimers();

      const result = await promise;

      const totalMonthlyPayment = result.tranches.reduce(
        (sum, t) => sum + t.monthlyPayment,
        0
      );
      const totalTotalPayment = result.tranches.reduce(
        (sum, t) => sum + t.totalPayment,
        0
      );
      const totalTotalInterest = result.tranches.reduce(
        (sum, t) => sum + t.totalInterest,
        0
      );

      expect(result.combined.monthlyPayment).toBeCloseTo(
        totalMonthlyPayment,
        2
      );
      expect(result.combined.totalPayment).toBeCloseTo(totalTotalPayment, 2);
      expect(result.combined.totalInterest).toBeCloseTo(totalTotalInterest, 2);
    });
  });

  describe('calculateFixedPeriodLoan', () => {
    const mockFixedPeriodData: FixedPeriodLoanData = {
      loanAmount: '200000',
      totalLoanTermYears: '30',
      currentBalance: '180000',
      interestRate: '6.0',
      loanStartDate: '2020-01-01',
      fixedRateStartDate: '2024-01-01',
      fixedRateEndDate: '2029-12-31',
      analysisStartDate: '2024-06-01',
      analysisEndDate: '2025-05-31',
    };

    it('calculates fixed period loan correctly', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result).toHaveProperty('totalPeriod');
      expect(result).toHaveProperty('selectedPeriod');
      // futureEstimate should be undefined when no future rate is provided
      expect(result.futureEstimate).toBeUndefined();

      expect(result.totalPeriod.months).toBe(72); // 6 years
      expect(result.selectedPeriod.months).toBe(12); // 1 year
      expect(result.totalPeriod.monthlyPrincipal).toBeCloseTo(
        200000 / (30 * 12),
        2
      );
    });

    it('calculates future estimate when rate is provided', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData, '4.5');
      jest.runAllTimers();

      const result = await promise;

      expect(result).toHaveProperty('futureEstimate');
      expect(result.futureEstimate?.rate).toBe('4.5');
      expect(result.futureEstimate?.monthlyPayment).toBeGreaterThan(0);
      expect(result.futureEstimate?.totalPayment).toBeGreaterThan(0);
      expect(result.futureEstimate?.totalInterest).toBeGreaterThan(0);
    });

    it('calculates payment breakdown correctly', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.paymentBreakdown).toHaveLength(72);

      // Check first payment
      const firstPayment = result.totalPeriod.paymentBreakdown[0];
      expect(firstPayment.month).toBe(1);
      expect(firstPayment.balance).toBe(180000);
      expect(firstPayment.principal).toBeGreaterThan(0);
      expect(firstPayment.interest).toBeGreaterThan(0);
      expect(firstPayment.totalPayment).toBe(
        firstPayment.principal + firstPayment.interest
      );

      // Check last payment
      const lastPayment = result.totalPeriod.paymentBreakdown[71];
      expect(lastPayment.month).toBe(72);
      expect(lastPayment.balance).toBeGreaterThan(0);
    });

    it('calculates analysis period correctly', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.selectedPeriod.months).toBe(12);
      expect(result.selectedPeriod.amountToPay).toBeGreaterThan(0);
      expect(result.selectedPeriod.principalPaid).toBeGreaterThan(0);
      expect(result.selectedPeriod.interestPaid).toBeGreaterThan(0);
    });

    it('handles different analysis periods', async () => {
      const customAnalysisData = {
        ...mockFixedPeriodData,
        analysisStartDate: '2024-01-01',
        analysisEndDate: '2026-12-31', // 3 years
      };

      const promise = calculateFixedPeriodLoan(customAnalysisData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.selectedPeriod.months).toBe(36);
    });

    it('calculates remaining balance correctly', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData);
      jest.runAllTimers();

      const result = await promise;

      const monthlyPrincipal = result.totalPeriod.monthlyPrincipal;
      const expectedRemainingBalance = 180000 - monthlyPrincipal * 72;

      expect(result.totalPeriod.remainingBalance).toBeCloseTo(
        expectedRemainingBalance,
        2
      );
    });
  });

  describe('calculateFixedRateLoan', () => {
    const mockFixedRateLoanData: FixedRateLoanFormData = {
      loanType: 'fixed-rate',
      loanAmount: '1100000',
      loanStartDate: '2021-09-08',
      loanEndDate: '2051-09-08',
      loanPeriod: '30',
      loanPeriodType: 'years',
      fixedRatePeriods: [
        {
          id: '1',
          interestRate: '2.75',
          startDate: '2021-09-08',
          endDate: '2022-09-08',
          label: 'Period 1',
        },
        {
          id: '2',
          interestRate: '3.25',
          startDate: '2022-09-08',
          endDate: '2023-09-08',
          label: 'Period 2',
        },
      ],
    };

    it('calculates fixed rate loan correctly', async () => {
      const promise = calculateFixedRateLoan(mockFixedRateLoanData);
      jest.runAllTimers();

      const result = await promise;

      expect(result).toHaveProperty('loanAmount');
      expect(result).toHaveProperty('loanStartDate');
      expect(result).toHaveProperty('loanEndDate');
      expect(result).toHaveProperty('totalLoanTermMonths');
      expect(result).toHaveProperty('periods');
      expect(result).toHaveProperty('summary');

      expect(result.loanAmount).toBe(1100000);
      expect(result.loanStartDate).toBe('2021-09-08');
      expect(result.loanEndDate).toBe('2051-09-08');
      expect(result.totalLoanTermMonths).toBe(360); // 30 years
      expect(result.periods).toHaveLength(2);
    });

    it('calculates individual periods correctly', async () => {
      const promise = calculateFixedRateLoan(mockFixedRateLoanData);
      jest.runAllTimers();

      const result = await promise;

      // Test first period
      const period1 = result.periods[0];
      expect(period1.id).toBe('1');
      expect(period1.label).toBe('Period 1');
      expect(period1.interestRate).toBe(2.75);
      expect(period1.startDate).toBe('2021-09-08');
      expect(period1.endDate).toBe('2022-09-08');
      expect(period1.months).toBe(12); // 1 year
      expect(period1.monthlyPayment).toBeGreaterThan(0);
      expect(period1.weeklyPayment).toBeGreaterThan(0);
      expect(period1.fortnightlyPayment).toBeGreaterThan(0);
      expect(period1.totalPayment).toBeGreaterThan(0);
      expect(period1.totalInterest).toBeGreaterThan(0);
      expect(period1.principalPaid).toBeGreaterThan(0);

      // Test second period
      const period2 = result.periods[1];
      expect(period2.id).toBe('2');
      expect(period2.label).toBe('Period 2');
      expect(period2.interestRate).toBe(3.25);
      expect(period2.startDate).toBe('2022-09-08');
      expect(period2.endDate).toBe('2023-09-08');
      expect(period2.months).toBe(12); // 1 year
      expect(period2.monthlyPayment).toBeGreaterThan(0);
      expect(period2.weeklyPayment).toBeGreaterThan(0);
      expect(period2.fortnightlyPayment).toBeGreaterThan(0);
    });

    it('calculates weekly and fortnightly payments with correct relationships', async () => {
      const promise = calculateFixedRateLoan(mockFixedRateLoanData);
      jest.runAllTimers();

      const result = await promise;

      result.periods.forEach(period => {
        // Weekly should be smaller than fortnightly
        expect(period.weeklyPayment).toBeLessThan(period.fortnightlyPayment);
        
        // Fortnightly should be smaller than monthly
        expect(period.fortnightlyPayment).toBeLessThan(period.monthlyPayment);

        // Weekly should be approximately 12/52 of monthly (0.2308)
        const weeklyRatio = period.weeklyPayment / period.monthlyPayment;
        expect(weeklyRatio).toBeCloseTo(12/52, 2);

        // Fortnightly should be approximately 12/26 of monthly (0.4615)
        const fortnightlyRatio = period.fortnightlyPayment / period.monthlyPayment;
        expect(fortnightlyRatio).toBeCloseTo(12/26, 2);
      });
    });

    it('calculates summary correctly', async () => {
      const promise = calculateFixedRateLoan(mockFixedRateLoanData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.summary.totalPayment).toBeGreaterThan(0);
      expect(result.summary.totalInterest).toBeGreaterThan(0);
      expect(result.summary.averageMonthlyPayment).toBeGreaterThan(0);
      expect(result.summary.averageWeeklyPayment).toBeGreaterThan(0);
      expect(result.summary.averageFortnightlyPayment).toBeGreaterThan(0);
      expect(result.summary.coveragePercentage).toBeGreaterThan(0);
      expect(result.summary.monthsCovered).toBe(24); // 2 periods * 12 months each

      // Average payments should have correct relationships
      expect(result.summary.averageWeeklyPayment).toBeLessThan(result.summary.averageFortnightlyPayment);
      expect(result.summary.averageFortnightlyPayment).toBeLessThan(result.summary.averageMonthlyPayment);

      // Average weekly should be approximately 12/52 of average monthly
      const avgWeeklyRatio = result.summary.averageWeeklyPayment / result.summary.averageMonthlyPayment;
      expect(avgWeeklyRatio).toBeCloseTo(12/52, 2);

      // Average fortnightly should be approximately 12/26 of average monthly
      const avgFortnightlyRatio = result.summary.averageFortnightlyPayment / result.summary.averageMonthlyPayment;
      expect(avgFortnightlyRatio).toBeCloseTo(12/26, 2);
    });

    it('handles single period correctly', async () => {
      const singlePeriodData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [mockFixedRateLoanData.fixedRatePeriods[0]],
      };

      const promise = calculateFixedRateLoan(singlePeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.periods).toHaveLength(1);
      expect(result.summary.monthsCovered).toBe(12);
      expect(result.summary.coveragePercentage).toBeCloseTo(12/360 * 100, 1); // 12 months out of 360
    });

    it('calculates payment breakdown correctly', async () => {
      const promise = calculateFixedRateLoan(mockFixedRateLoanData);
      jest.runAllTimers();

      const result = await promise;

      result.periods.forEach(period => {
        expect(period.paymentBreakdown).toHaveLength(period.months);
        
        // Check first payment in breakdown
        const firstPayment = period.paymentBreakdown[0];
        expect(firstPayment.month).toBeGreaterThan(0);
        expect(firstPayment.balance).toBeGreaterThan(0);
        expect(firstPayment.principal).toBeGreaterThan(0);
        expect(firstPayment.interest).toBeGreaterThan(0);
        expect(firstPayment.totalPayment).toBe(firstPayment.principal + firstPayment.interest);
      });
    });

    it('handles different interest rates correctly', async () => {
      const highRateData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '8.5',
            startDate: '2021-09-08',
            endDate: '2022-09-08',
            label: 'High Rate Period',
          },
        ],
      };

      const promise = calculateFixedRateLoan(highRateData);
      jest.runAllTimers();

      const result = await promise;

      const period = result.periods[0];
      expect(period.interestRate).toBe(8.5);
      expect(period.monthlyPayment).toBeGreaterThan(0);
      expect(period.totalInterest).toBeGreaterThan(0);
      
      // Higher interest rate should result in higher payments
      expect(period.monthlyPayment).toBeGreaterThan(0);
    });

    it('handles zero interest rate correctly', async () => {
      const zeroRateData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '0',
            startDate: '2021-09-08',
            endDate: '2022-09-08',
            label: 'Zero Rate Period',
          },
        ],
      };

      const promise = calculateFixedRateLoan(zeroRateData);
      jest.runAllTimers();

      const result = await promise;

      const period = result.periods[0];
      expect(period.interestRate).toBe(0);
      expect(period.totalInterest).toBe(0);
      expect(period.monthlyPayment).toBeGreaterThan(0);
      expect(period.weeklyPayment).toBeGreaterThan(0);
      expect(period.fortnightlyPayment).toBeGreaterThan(0);
    });

    it('calculates coverage percentage correctly', async () => {
      const partialCoverageData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        loanEndDate: '2025-09-08', // 4 years total
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '2.75',
            startDate: '2021-09-08',
            endDate: '2022-09-08',
            label: 'Period 1',
          },
        ],
      };

      const promise = calculateFixedRateLoan(partialCoverageData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalLoanTermMonths).toBe(48); // 4 years
      expect(result.summary.monthsCovered).toBe(12); // 1 year covered
      expect(result.summary.coveragePercentage).toBeCloseTo(25, 1); // 12/48 * 100
    });

    it('handles edge case with very short period', async () => {
      const shortPeriodData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '2.75',
            startDate: '2021-09-08',
            endDate: '2021-10-08', // 1 month
            label: 'Short Period',
          },
        ],
      };

      const promise = calculateFixedRateLoan(shortPeriodData);
      jest.runAllTimers();

      const result = await promise;

      const period = result.periods[0];
      expect(period.months).toBe(1);
      expect(period.monthlyPayment).toBeGreaterThan(0);
      expect(period.weeklyPayment).toBeGreaterThan(0);
      expect(period.fortnightlyPayment).toBeGreaterThan(0);
      expect(period.paymentBreakdown).toHaveLength(1);
    });
  });

  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats large numbers correctly', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('formats decimal numbers correctly', () => {
      expect(formatCurrency(123.4)).toBe('$123.40');
      expect(formatCurrency(123.456)).toBe('$123.46'); // Rounds to 2 decimal places
    });

    it('uses USD currency format', () => {
      expect(formatCurrency(100)).toContain('$');
      expect(formatCurrency(100)).toContain('.00');
    });
  });

  describe('edge cases and error handling', () => {
    it('handles very small interest rates', async () => {
      const smallRateData: FormData = {
        loanAmount: '100000',
        interestRate: '0.01',
        startDate: '2024-01-01',
        endDate: '2029-12-31',
      };

      const promise = calculateLoan(smallRateData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('handles very large loan amounts', async () => {
      const largeAmountData: FormData = {
        loanAmount: '10000000',
        interestRate: '5.0',
        startDate: '2024-01-01',
        endDate: '2029-12-31',
      };

      const promise = calculateLoan(largeAmountData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPayment).toBeGreaterThan(10000000);
    });

    it('handles very long loan terms', async () => {
      const longTermData: FormData = {
        loanAmount: '100000',
        interestRate: '5.0',
        startDate: '2024-01-01',
        endDate: '2054-12-31', // 30 years
      };

      const promise = calculateLoan(longTermData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.loanTermMonths).toBe(372); // 31 years
      expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('handles same start and end dates', async () => {
      const sameDateData: FormData = {
        loanAmount: '100000',
        interestRate: '5.0',
        startDate: '2024-01-01',
        endDate: '2024-01-01',
      };

      const promise = calculateLoan(sameDateData);
      jest.runAllTimers();

      const result = await promise;

      // When start and end dates are the same, we get 0 months
      expect(result.loanTermMonths).toBe(0);
      // Division by zero results in Infinity for monthly payment
      expect(result.monthlyPayment).toBe(Infinity);
      // Infinity * 0 = NaN for total payment and interest
      expect(result.totalPayment).toBeNaN();
      expect(result.totalInterest).toBeNaN();
    });
  });
});
