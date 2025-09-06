import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import FixedPeriodResultsComponent from '@/components/server/loan/FixedPeriodResults';
import PaymentFrequencyController from '@/components/client/loan/PaymentFrequencyController';
import { FixedPeriodResults } from '@/types/loan';

// Mock the formatCurrency function
jest.mock('@/lib/helper/loanCalculations', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
}));

const mockResults: FixedPeriodResults = {
  totalPeriod: {
    startDate: '2024-01-01',
    endDate: '2025-06-01',
    months: 18,
    monthlyPayment: 1000,
    weeklyPayment: 230.77,
    fortnightlyPayment: 461.54,
    monthlyPrincipal: 800,
    totalPaid: 18000,
    principalPaid: 14400,
    interestPaid: 3600,
    remainingBalance: 85600,
    paymentBreakdown: [
      {
        month: 1,
        balance: 100000,
        principal: 800,
        interest: 200,
        totalPayment: 1000,
      },
      {
        month: 2,
        balance: 99200,
        principal: 800,
        interest: 198.4,
        totalPayment: 1000,
      },
    ],
  },
  selectedPeriod: {
    startDate: '2024-01-01',
    endDate: '2024-12-01',
    months: 12,
    amountToPay: 12000,
    principalPaid: 9600,
    interestPaid: 2400,
  },
  futureEstimate: {
    rate: '5.5',
    monthlyPayment: 900,
    totalPayment: 54000,
    totalInterest: 12000,
  },
};

describe('FixedPeriodResultsComponent', () => {
  it('renders without crashing', () => {
    render(<FixedPeriodResultsComponent results={mockResults} />);
    expect(screen.getByText('Fixed Period Results')).toBeInTheDocument();
  });

  it('displays monthly values by default', () => {
    render(<PaymentFrequencyController results={mockResults} />);
    
    // Check that monthly labels are displayed
    expect(screen.getByText('Monthly Principal Reduction')).toBeInTheDocument();
    expect(screen.getByText('Monthly Interest (First Month)')).toBeInTheDocument();
    expect(screen.getByText('Total Monthly Payment (First Month)')).toBeInTheDocument();
  });

  it('updates to weekly values when weekly frequency is selected', () => {
    render(<PaymentFrequencyController results={mockResults} />);
    
    // Click on weekly frequency button
    const weeklyButton = screen.getByText('Weekly');
    fireEvent.click(weeklyButton);
    
    // Check that weekly labels are displayed
    expect(screen.getByText('Weekly Principal Reduction')).toBeInTheDocument();
    expect(screen.getByText('Weekly Interest (First Week)')).toBeInTheDocument();
    expect(screen.getByText('Total Weekly Payment (First Week)')).toBeInTheDocument();
  });

  it('updates to fortnightly values when fortnightly frequency is selected', () => {
    render(<PaymentFrequencyController results={mockResults} />);
    
    // Click on fortnightly frequency button
    const fortnightlyButton = screen.getByText('Fortnightly');
    fireEvent.click(fortnightlyButton);
    
    // Check that fortnightly labels are displayed
    expect(screen.getByText('Fortnightly Principal Reduction')).toBeInTheDocument();
    expect(screen.getByText('Fortnightly Interest (First Fortnight)')).toBeInTheDocument();
    expect(screen.getByText('Total Fortnightly Payment (First Fortnight)')).toBeInTheDocument();
  });

  it('updates subtitle text based on selected frequency', () => {
    render(<PaymentFrequencyController results={mockResults} />);
    
    // Check monthly subtitle
    expect(screen.getByText(/Fixed amount every month for/)).toBeInTheDocument();
    expect(screen.getByText(/Decreases each month as balance reduces/)).toBeInTheDocument();
    
    // Switch to weekly
    const weeklyButton = screen.getByText('Weekly');
    fireEvent.click(weeklyButton);
    
    expect(screen.getByText(/Fixed amount every week for/)).toBeInTheDocument();
    expect(screen.getByText(/Decreases each week as balance reduces/)).toBeInTheDocument();
    
    // Switch to fortnightly
    const fortnightlyButton = screen.getByText('Fortnightly');
    fireEvent.click(fortnightlyButton);
    
    expect(screen.getByText(/Fixed amount every fortnight for/)).toBeInTheDocument();
    expect(screen.getByText(/Decreases each fortnight as balance reduces/)).toBeInTheDocument();
  });

  it('updates principal + interest calculation in subtitle', () => {
    render(<PaymentFrequencyController results={mockResults} />);
    
    // Check monthly calculation
    expect(screen.getByText(/Principal \+ Interest = \$800\.00 \+ \$200\.00/)).toBeInTheDocument();
    
    // Switch to weekly
    const weeklyButton = screen.getByText('Weekly');
    fireEvent.click(weeklyButton);
    
    expect(screen.getByText(/Principal \+ Interest = \$184\.62 \+ \$46\.15/)).toBeInTheDocument();
    
    // Switch to fortnightly
    const fortnightlyButton = screen.getByText('Fortnightly');
    fireEvent.click(fortnightlyButton);
    
    expect(screen.getByText(/Principal \+ Interest = \$369\.23 \+ \$92\.31/)).toBeInTheDocument();
  });

  it('handles null results gracefully', () => {
    render(<FixedPeriodResultsComponent results={null} />);
    expect(screen.getByText('Fill out the form to see your fixed period loan details')).toBeInTheDocument();
  });
});
