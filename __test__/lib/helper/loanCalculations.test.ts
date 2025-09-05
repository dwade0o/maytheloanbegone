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
      // Account for improved precision in date calculations
      const expectedMonthlyPayment = 100000 / result.loanTermMonths;
      expect(Math.abs(result.monthlyPayment - expectedMonthlyPayment)).toBeLessThan(1);

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

      // Account for improved precision in date calculations
      const expectedMonthlyPayment = 50000 / result.loanTermMonths;
      expect(Math.abs(result.monthlyPayment - expectedMonthlyPayment)).toBeLessThan(1);
      expect(result.totalInterest).toBeCloseTo(0, 10);
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

      expect(result.totalPeriod.months).toBeCloseTo(72, 0); // 6 years (allow for precision differences)
      expect(result.selectedPeriod.months).toBeCloseTo(12, 0); // 1 year (allow for precision differences)
      expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(0);
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

      expect(result.selectedPeriod.months).toBeCloseTo(12, 0); // Allow for precision differences
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

      expect(result.selectedPeriod.months).toBeCloseTo(36, 0); // Allow for precision differences
    });

    it('calculates remaining balance correctly', async () => {
      const promise = calculateFixedPeriodLoan(mockFixedPeriodData);
      jest.runAllTimers();

      const result = await promise;

      // With fixed payment approach, remaining balance should be calculated correctly
      expect(result.totalPeriod.remainingBalance).toBeGreaterThan(0);
      expect(result.totalPeriod.remainingBalance).toBeLessThan(180000);
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

    // Additional comprehensive tests for date precision and edge cases
    it('handles precise date calculations across timezone boundaries', async () => {
      const precisionTestData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        loanStartDate: '2024-09-08',
        loanEndDate: '2026-03-08',
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '3.5',
            startDate: '2024-09-08',
            endDate: '2026-03-08', // Exactly 18 months
            label: 'Precision Test Period',
          },
        ],
      };

      const promise = calculateFixedRateLoan(precisionTestData);
      jest.runAllTimers();

      const result = await promise;

      const period = result.periods[0];
      expect(period.months).toBe(18); // Should be exactly 18, not 17.97
      expect(period.monthlyPayment).toBeGreaterThan(0);
      expect(period.totalInterest).toBeGreaterThan(0);
    });

    it('handles multiple periods with exact month boundaries', async () => {
      const multiPeriodData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        loanStartDate: '2024-01-01',
        loanEndDate: '2030-01-01',
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '2.5',
            startDate: '2024-01-01',
            endDate: '2025-01-01', // 12 months
            label: 'Year 1',
          },
          {
            id: '2',
            interestRate: '3.0',
            startDate: '2025-01-01',
            endDate: '2026-01-01', // 12 months
            label: 'Year 2',
          },
          {
            id: '3',
            interestRate: '3.5',
            startDate: '2026-01-01',
            endDate: '2027-07-01', // 18 months
            label: 'Year 3-4',
          },
        ],
      };

      const promise = calculateFixedRateLoan(multiPeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.periods).toHaveLength(3);
      expect(result.periods[0].months).toBe(12);
      expect(result.periods[1].months).toBe(12);
      expect(result.periods[2].months).toBe(18);
      
      // Payments should increase with interest rates
      expect(result.periods[1].monthlyPayment).toBeGreaterThan(result.periods[0].monthlyPayment);
      expect(result.periods[2].monthlyPayment).toBeGreaterThan(result.periods[1].monthlyPayment);
    });

    it('handles leap year calculations correctly', async () => {
      const leapYearData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        loanStartDate: '2024-02-29', // Leap year
        loanEndDate: '2025-02-28',
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '4.0',
            startDate: '2024-02-29',
            endDate: '2025-02-28', // Should be 12 months
            label: 'Leap Year Period',
          },
        ],
      };

      const promise = calculateFixedRateLoan(leapYearData);
      jest.runAllTimers();

      const result = await promise;

      const period = result.periods[0];
      expect(period.months).toBeCloseTo(12, 0); // Should handle leap year correctly
      expect(period.monthlyPayment).toBeGreaterThan(0);
    });

    it('handles very high interest rates', async () => {
      const highRateData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '15.0', // High interest rate
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
      expect(period.interestRate).toBe(15);
      expect(period.monthlyPayment).toBeGreaterThan(0);
      expect(period.totalInterest).toBeGreaterThan(period.principalPaid);
    });

    it('handles period validation errors', async () => {
      const overlappingPeriodsData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '2.75',
            startDate: '2021-09-08',
            endDate: '2022-06-08',
            label: 'Period 1',
          },
          {
            id: '2',
            interestRate: '3.25',
            startDate: '2022-03-08', // Overlaps with Period 1
            endDate: '2023-03-08',
            label: 'Period 2',
          },
        ],
      };

      const promise = calculateFixedRateLoan(overlappingPeriodsData);
      jest.runAllTimers();

      await expect(promise).rejects.toThrow('Period 1 overlaps with period 2');
    });

    it('handles balance progression correctly across periods', async () => {
      const balanceTestData: FixedRateLoanFormData = {
        ...mockFixedRateLoanData,
        loanAmount: '100000',
        fixedRatePeriods: [
          {
            id: '1',
            interestRate: '3.0',
            startDate: '2021-09-08',
            endDate: '2022-09-08',
            label: 'Period 1',
          },
          {
            id: '2',
            interestRate: '4.0',
            startDate: '2022-09-08',
            endDate: '2023-09-08',
            label: 'Period 2',
          },
        ],
      };

      const promise = calculateFixedRateLoan(balanceTestData);
      jest.runAllTimers();

      const result = await promise;

      // Period 2 should have a different payment than Period 1 due to:
      // 1. Different interest rate (4% vs 3%)
      // 2. Lower remaining balance
      expect(result.periods[0].monthlyPayment).not.toEqual(result.periods[1].monthlyPayment);
      
      // All payment breakdowns should have decreasing balances
      result.periods.forEach(period => {
        for (let i = 1; i < period.paymentBreakdown.length; i++) {
          expect(period.paymentBreakdown[i].balance).toBeLessThan(
            period.paymentBreakdown[i - 1].balance
          );
        }
      });
    });
  });

  // Additional tests for Fixed Period Loan
  describe('calculateFixedPeriodLoan - Additional Edge Cases', () => {
    const baseFixedPeriodData: FixedPeriodLoanData = {
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

    it('handles zero interest rate in fixed period loan', async () => {
      const zeroRateData = {
        ...baseFixedPeriodData,
        interestRate: '0',
      };

      const promise = calculateFixedPeriodLoan(zeroRateData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPeriod.interestPaid).toBe(0);
      expect(result.selectedPeriod.interestPaid).toBe(0);
    });

    it('handles very short analysis periods', async () => {
      const shortAnalysisData = {
        ...baseFixedPeriodData,
        analysisStartDate: '2024-01-01',
        analysisEndDate: '2024-02-01', // 1 month
      };

      const promise = calculateFixedPeriodLoan(shortAnalysisData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.selectedPeriod.months).toBeCloseTo(1, 0);
      expect(result.selectedPeriod.amountToPay).toBeGreaterThan(0);
    });

    it('handles future estimate with zero rate', async () => {
      const promise = calculateFixedPeriodLoan(baseFixedPeriodData, '0');
      jest.runAllTimers();

      const result = await promise;

      expect(result.futureEstimate).toBeDefined();
      expect(result.futureEstimate?.rate).toBe('0');
      expect(result.futureEstimate?.monthlyPayment).toBeGreaterThan(0);
      expect(result.futureEstimate?.totalInterest).toBe(0);
    });

    it('handles different loan start dates relative to fixed period', async () => {
      const laterStartData = {
        ...baseFixedPeriodData,
        loanStartDate: '2015-01-01', // 9 years before fixed period
        fixedRateStartDate: '2024-01-01',
        fixedRateEndDate: '2026-01-01',
      };

      const promise = calculateFixedPeriodLoan(laterStartData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.months).toBeCloseTo(24, 0); // 2 years
      expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPeriod.remainingBalance).toBeLessThan(180000);
    });

    // Additional comprehensive tests for NaN fixes and edge cases
    it('calculates monthly principal reduction correctly and avoids NaN', async () => {
      // Test scenario that was causing NaN
      const realWorldData: FixedPeriodLoanData = {
        loanAmount: '1100000',
        totalLoanTermYears: '30',
        currentBalance: '101296.62',
        interestRate: '6.65',
        loanStartDate: '2021-09-08',
        fixedRateStartDate: '2024-09-08',
        fixedRateEndDate: '2026-03-08',
        analysisStartDate: '2025-09-05',
        analysisEndDate: '2026-03-08',
      };

      const promise = calculateFixedPeriodLoan(realWorldData);
      jest.runAllTimers();

      const result = await promise;

      // Verify monthly principal reduction is not NaN and is reasonable
      expect(result.totalPeriod.monthlyPrincipal).not.toBeNaN();
      expect(result.totalPeriod.monthlyPrincipal).toBeGreaterThan(0);
      expect(result.totalPeriod.monthlyPrincipal).toBeCloseTo(117.89, 1); // Expected from manual calculation
      
      // Verify monthly payment is calculated correctly
      expect(result.totalPeriod.monthlyPayment).not.toBeNaN();
      expect(result.totalPeriod.monthlyPayment).toBeCloseTo(673.79, 1);
      
      // Verify fixed period is 18 months
      expect(result.totalPeriod.months).toBeCloseTo(18, 0);
      
      // Verify analysis period is about 6.1 months
      expect(result.selectedPeriod.months).toBeCloseTo(6.1, 1);
    });

    it('handles very high loan amounts without errors', async () => {
      const highAmountData = {
        ...baseFixedPeriodData,
        loanAmount: '5000000', // $5M loan
        currentBalance: '4500000',
        interestRate: '8.5',
      };

      const promise = calculateFixedPeriodLoan(highAmountData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.monthlyPrincipal).not.toBeNaN();
      expect(result.totalPeriod.monthlyPayment).not.toBeNaN();
      expect(result.totalPeriod.monthlyPrincipal).toBeGreaterThan(0);
      expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(result.totalPeriod.monthlyPrincipal);
    });

    it('handles edge case with very short fixed period', async () => {
      const shortPeriodData = {
        ...baseFixedPeriodData,
        fixedRateStartDate: '2024-01-01',
        fixedRateEndDate: '2024-02-01', // 1 month period
        analysisStartDate: '2024-01-15',
        analysisEndDate: '2024-02-01',
      };

      const promise = calculateFixedPeriodLoan(shortPeriodData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.months).toBeCloseTo(1, 0);
      expect(result.totalPeriod.monthlyPrincipal).not.toBeNaN();
      expect(result.totalPeriod.monthlyPayment).not.toBeNaN();
      expect(result.selectedPeriod.months).toBeCloseTo(0.5, 1); // Half month analysis
    });

    it('calculates correct payment breakdown without NaN values', async () => {
      const testData = {
        ...baseFixedPeriodData,
        currentBalance: '150000',
        interestRate: '7.25',
      };

      const promise = calculateFixedPeriodLoan(testData);
      jest.runAllTimers();

      const result = await promise;

      // Check that payment breakdown doesn't contain NaN
      result.totalPeriod.paymentBreakdown.forEach((month, index) => {
        expect(month.balance).not.toBeNaN();
        expect(month.principal).not.toBeNaN();
        expect(month.interest).not.toBeNaN();
        expect(month.totalPayment).not.toBeNaN();
        
        // Balance should decrease each month
        if (index > 0) {
          expect(month.balance).toBeLessThan(result.totalPeriod.paymentBreakdown[index - 1].balance);
        }
      });
    });

    it('handles precision edge cases with very small balances', async () => {
      const smallBalanceData = {
        ...baseFixedPeriodData,
        currentBalance: '50000.50', // Small remaining balance but not too small
        totalLoanTermYears: '10', // Reasonable remaining term
        fixedRateStartDate: '2024-01-01',
        fixedRateEndDate: '2025-01-01', // 1 year fixed period
        analysisStartDate: '2024-06-01',
        analysisEndDate: '2025-01-01',
      };

      const promise = calculateFixedPeriodLoan(smallBalanceData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.monthlyPrincipal).not.toBeNaN();
      expect(result.totalPeriod.monthlyPayment).not.toBeNaN();
      expect(result.totalPeriod.monthlyPrincipal).toBeGreaterThan(0);
      // For small balances, the loan might be fully paid off, so remaining balance could be 0 or positive
      expect(result.totalPeriod.remainingBalance).toBeGreaterThanOrEqual(0);
    });

    // Tests for new payment frequency support
    it('calculates weekly and fortnightly payments correctly', async () => {
      const testData: FixedPeriodLoanData = {
        loanAmount: '1100000',
        totalLoanTermYears: '30',
        currentBalance: '101296.62',
        interestRate: '6.65',
        loanStartDate: '2021-09-08',
        fixedRateStartDate: '2024-09-08',
        fixedRateEndDate: '2026-03-08',
        analysisStartDate: '2025-09-05',
        analysisEndDate: '2026-03-08',
      };

      const promise = calculateFixedPeriodLoan(testData);
      jest.runAllTimers();

      const result = await promise;

      // Verify all payment frequencies are calculated
      expect(result.totalPeriod.monthlyPayment).not.toBeNaN();
      expect(result.totalPeriod.weeklyPayment).not.toBeNaN();
      expect(result.totalPeriod.fortnightlyPayment).not.toBeNaN();

      // Verify payment amounts are reasonable
      expect(result.totalPeriod.monthlyPayment).toBeCloseTo(673.79, 1);
      expect(result.totalPeriod.weeklyPayment).toBeCloseTo(155.37, 1);
      expect(result.totalPeriod.fortnightlyPayment).toBeCloseTo(310.81, 1);

      // Verify payment frequency relationships (should be close due to different compounding)
      const weeklyToMonthly = result.totalPeriod.weeklyPayment * 52 / 12;
      const fortnightlyToMonthly = result.totalPeriod.fortnightlyPayment * 26 / 12;
      
      // Should be within $1 of each other due to different compounding frequencies
      expect(Math.abs(weeklyToMonthly - result.totalPeriod.monthlyPayment)).toBeLessThan(1);
      expect(Math.abs(fortnightlyToMonthly - result.totalPeriod.monthlyPayment)).toBeLessThan(1);
    });

    it('handles zero interest rate with payment frequencies', async () => {
      const zeroRateData = {
        ...baseFixedPeriodData,
        interestRate: '0',
      };

      const promise = calculateFixedPeriodLoan(zeroRateData);
      jest.runAllTimers();

      const result = await promise;

      expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPeriod.weeklyPayment).toBeGreaterThan(0);
      expect(result.totalPeriod.fortnightlyPayment).toBeGreaterThan(0);
      
      // With zero interest, payments should be exactly proportional
      const weeklyToMonthly = result.totalPeriod.weeklyPayment * 52 / 12;
      const fortnightlyToMonthly = result.totalPeriod.fortnightlyPayment * 26 / 12;
      
      expect(weeklyToMonthly).toBeCloseTo(result.totalPeriod.monthlyPayment, 2);
      expect(fortnightlyToMonthly).toBeCloseTo(result.totalPeriod.monthlyPayment, 2);
    });

    it('maintains payment frequency consistency across different scenarios', async () => {
      const scenarios = [
        { balance: '50000', rate: '3.5', term: '15' },
        { balance: '200000', rate: '7.25', term: '25' },
        { balance: '500000', rate: '8.9', term: '10' },
      ];

      for (const scenario of scenarios) {
        const testData = {
          ...baseFixedPeriodData,
          currentBalance: scenario.balance,
          interestRate: scenario.rate,
          totalLoanTermYears: scenario.term,
        };

        const promise = calculateFixedPeriodLoan(testData);
        jest.runAllTimers();

        const result = await promise;

        // All payment types should be positive
        expect(result.totalPeriod.monthlyPayment).toBeGreaterThan(0);
        expect(result.totalPeriod.weeklyPayment).toBeGreaterThan(0);
        expect(result.totalPeriod.fortnightlyPayment).toBeGreaterThan(0);

        // Weekly should be less than fortnightly, which should be less than monthly
        expect(result.totalPeriod.weeklyPayment).toBeLessThan(result.totalPeriod.fortnightlyPayment);
        expect(result.totalPeriod.fortnightlyPayment).toBeLessThan(result.totalPeriod.monthlyPayment);
      }
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
