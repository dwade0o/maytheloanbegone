import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanCalculator from '@/components/client/calculators/LoanCalculator';

// Mock the calculator manager hook
jest.mock('@/hooks/useCalculatorManager', () => ({
  useCalculatorManager: () => ({
    calculatorType: 'single',
    switchCalculatorType: jest.fn(),
  }),
}));

// Mock the calculator components
jest.mock('@/components/client/calculator', () => ({
  CalculatorSelector: ({ calculatorType, onCalculatorChange }: any) => (
    <div data-testid="calculator-selector">
      <button
        data-testid="single-calc-btn"
        onClick={() => onCalculatorChange('single')}
        className={calculatorType === 'single' ? 'active' : ''}
      >
        Single Loan
      </button>
      <button
        data-testid="split-calc-btn"
        onClick={() => onCalculatorChange('split')}
        className={calculatorType === 'split' ? 'active' : ''}
      >
        Split Loan
      </button>
    </div>
  ),
  CalculatorForm: ({ calculatorType, onSubmit, onReset, isCalculating }: any) => (
    <div data-testid="calculator-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ principal: 100000, rate: 5, term: 30 });
        }}
      >
        <button type="submit" disabled={isCalculating}>
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </form>
    </div>
  ),
  CalculatorResults: ({ calculatorType, results }: any) => (
    <div data-testid="calculator-results">
      {results ? (
        <div data-testid="results-content">
          <p>Results for {calculatorType} calculator</p>
        </div>
      ) : (
        <p data-testid="no-results">No results yet</p>
      )}
    </div>
  ),
}));

// Mock the features info component
jest.mock('@/components/server/common', () => ({
  FeaturesInfo: () => <div data-testid="features-info">Features Info</div>,
}));

// Mock the loan calculation functions
jest.mock('@/lib/helper/loanCalculations', () => ({
  calculateLoan: jest.fn().mockResolvedValue({
    monthlyPayment: 536.82,
    totalPayment: 193255.2,
    totalInterest: 93255.2,
    loanTermMonths: 360,
  }),
  calculateSplitLoan: jest.fn().mockResolvedValue({
    fixedRate: { monthlyPayment: 400, totalPayment: 144000 },
    variableRate: { monthlyPayment: 200, totalPayment: 72000 },
  }),
  calculateFixedPeriodLoan: jest.fn().mockResolvedValue({
    monthlyPayment: 500,
    totalPayment: 180000,
  }),
  calculateFixedRateLoan: jest.fn().mockResolvedValue({
    monthlyPayment: 450,
    totalPayment: 162000,
  }),
}));

describe('LoanCalculator', () => {
  it('renders without crashing', () => {
    render(<LoanCalculator />);
    expect(screen.getByText('Advanced Loan Calculator')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<LoanCalculator />);
    expect(screen.getByTestId('calculator-selector')).toBeInTheDocument();
    expect(screen.getByTestId('calculator-form')).toBeInTheDocument();
    expect(screen.getByTestId('calculator-results')).toBeInTheDocument();
    expect(screen.getByTestId('features-info')).toBeInTheDocument();
  });

  it('shows no results initially', () => {
    render(<LoanCalculator />);
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<LoanCalculator />);
    
    const calculateButton = screen.getByText('Calculate');
    await user.click(calculateButton);
    
    // Form should be present and functional
    expect(screen.getByTestId('calculator-form')).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    const user = userEvent.setup();
    render(<LoanCalculator />);
    
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);
    
    // Should still show no results after reset
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  it('displays correct header and description', () => {
    render(<LoanCalculator />);
    
    expect(screen.getByText('Advanced Loan Calculator')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Calculate loan payments, compare different scenarios, and make informed financial decisions with our comprehensive loan calculator suite.'
      )
    ).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<LoanCalculator />);
    
    // Check that the main container has the expected classes
    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('bg-gradient-to-br');
  });
});
