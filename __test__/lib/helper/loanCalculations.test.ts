import {
  calculateLoan,
  calculateLoanTranche,
  calculateSplitLoan,
  calculateFixedPeriodLoan,
  formatCurrency,
} from '@/lib/helper/loanCalculations';
import {
  FormData,
  SplitLoanFormData,
  LoanTranche,
  FixedPeriodLoanData,
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
      expect(result).toHaveProperty('totalPayment');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('loanTermMonths');

      // Should have 6 years = 72 months
      expect(result.loanTermMonths).toBe(72);

      // Monthly payment should be positive
      expect(result.monthlyPayment).toBeGreaterThan(0);

      // Total payment should be greater than principal
      expect(result.totalPayment).toBeGreaterThan(100000);

      // Total interest should be positive
      expect(result.totalInterest).toBeGreaterThan(0);
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
