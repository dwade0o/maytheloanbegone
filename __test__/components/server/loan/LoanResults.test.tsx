import React from 'react';
import { render, screen } from '@testing-library/react';
import LoanResults from '@/components/server/loan/LoanResults';

// Mock the common components
jest.mock('@/components/shared/LoanResultsBase', () => ({
  __esModule: true,
  default: ({
    title,
    description,
    icon,
    results,
    emptyStateDescription,
    children,
  }: any) => (
    <div data-testid="loan-results-base">
      <h2 data-testid="title">{title}</h2>
      <p data-testid="description">{description}</p>
      <div data-testid="icon">{icon}</div>
      {results ? (
        <div data-testid="results-content">{children}</div>
      ) : (
        <p data-testid="empty-state">{emptyStateDescription}</p>
      )}
    </div>
  ),
}));

jest.mock('@/components/shared/FeaturedResult', () => ({
  __esModule: true,
  default: ({ label, value }: any) => (
    <div data-testid="featured-result">
      <span data-testid="featured-label">{label}</span>
      <span data-testid="featured-value">{value}</span>
    </div>
  ),
}));

jest.mock('@/components/shared/ResultRow', () => ({
  __esModule: true,
  default: ({ label, value, valueColor, badge }: any) => (
    <div data-testid="result-row">
      <span data-testid="row-label">{label}</span>
      <span data-testid="row-value" className={valueColor}>
        {value}
      </span>
      {badge && (
        <span data-testid="row-badge" className={badge.className}>
          {badge.text}
        </span>
      )}
    </div>
  ),
}));

// Mock the helper function
jest.mock('@/lib/helper/loanCalculations', () => ({
  formatCurrency: (value: number) => `$${value.toFixed(2)}`,
}));

describe('LoanResults', () => {
  const mockResults = {
    monthlyPayment: 1500.5,
    totalPayment: 180060.0,
    totalInterest: 30060.0,
    loanTermMonths: 120,
  };

  it('renders without crashing', () => {
    render(<LoanResults results={mockResults} />);
    expect(screen.getByTestId('loan-results-base')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<LoanResults results={mockResults} />);
    expect(screen.getByTestId('title')).toHaveTextContent(
      'Calculation Results'
    );
    expect(screen.getByTestId('description')).toHaveTextContent(
      'Your loan payment breakdown'
    );
  });

  it('renders results when provided', () => {
    render(<LoanResults results={mockResults} />);
    expect(screen.getByTestId('results-content')).toBeInTheDocument();
  });

  it('renders empty state when no results', () => {
    render(<LoanResults results={null} />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent(
      'Fill out the form to see your loan payment details'
    );
  });

  it('renders featured result with monthly payment', () => {
    render(<LoanResults results={mockResults} />);
    expect(screen.getByTestId('featured-label')).toHaveTextContent(
      'Monthly Payment'
    );
    expect(screen.getByTestId('featured-value')).toHaveTextContent('$1500.50');
  });

  it('renders total payment result row', () => {
    render(<LoanResults results={mockResults} />);
    const resultRows = screen.getAllByTestId('result-row');
    expect(resultRows[0]).toBeInTheDocument();

    const firstRow = resultRows[0];
    expect(
      firstRow.querySelector('[data-testid="row-label"]')
    ).toHaveTextContent('Total Payment');
    expect(
      firstRow.querySelector('[data-testid="row-value"]')
    ).toHaveTextContent('$180060.00');
    expect(
      firstRow.querySelector('[data-testid="row-badge"]')
    ).toHaveTextContent('120 months');
  });

  it('renders total interest result row', () => {
    render(<LoanResults results={mockResults} />);
    const resultRows = screen.getAllByTestId('result-row');
    expect(resultRows[1]).toBeInTheDocument();

    const secondRow = resultRows[1];
    expect(
      secondRow.querySelector('[data-testid="row-label"]')
    ).toHaveTextContent('Total Interest');
    expect(
      secondRow.querySelector('[data-testid="row-value"]')
    ).toHaveTextContent('$30060.00');
    expect(
      secondRow.querySelector('[data-testid="row-badge"]')
    ).toHaveTextContent('20.0%');
  });

  it('renders summary text with years and months', () => {
    render(<LoanResults results={mockResults} />);
    expect(screen.getByText(/Over 10 years and 0 months/)).toBeInTheDocument();
    // Check that the summary text contains the interest amount
    const summaryText = screen.getByText(/Over.*years and.*months, you'll pay/);
    expect(summaryText).toBeInTheDocument();
  });

  it('handles different loan terms correctly', () => {
    const resultsWithRemainder = {
      ...mockResults,
      loanTermMonths: 125, // 10 years 5 months
    };

    render(<LoanResults results={resultsWithRemainder} />);
    expect(screen.getByText(/Over 10 years and 5 months/)).toBeInTheDocument();
  });
});
