import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorAccordion from '@/components/common/CalculatorAccordion';
import { CreditCard, Split, Calendar, TrendingUp } from 'lucide-react';

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
    className?: string;
  }) => {
    return (
      <button
        onClick={onClick}
        className={`${variant} ${size} ${className}`}
        data-testid="button"
      >
        {children}
      </button>
    );
  },
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => {
    return (
      <span className={`badge ${variant}`} data-testid="badge">
        {children}
      </span>
    );
  },
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`} data-testid="card">
      {children}
    </div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card-content ${className}`} data-testid="card-content">
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card-header ${className}`} data-testid="card-header">
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <span className={className} data-testid="chevron-down">▼</span>
  ),
  ChevronUp: ({ className }: { className?: string }) => (
    <span className={className} data-testid="chevron-up">▲</span>
  ),
  CreditCard: ({ className }: { className?: string }) => (
    <span className={className} data-testid="credit-card">💳</span>
  ),
  Split: ({ className }: { className?: string }) => (
    <span className={className} data-testid="split">✂️</span>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <span className={className} data-testid="calendar">📅</span>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <span className={className} data-testid="trending-up">📈</span>
  ),
}));

describe('CalculatorAccordion', () => {
  const mockOptions = [
    {
      id: 'single' as const,
      title: 'Single Loan',
      description: 'Standard loan with fixed rate',
      iconComponent: CreditCard,
      badge: 'Simple',
      badgeVariant: 'secondary' as const,
    },
    {
      id: 'split' as const,
      title: 'Split Loan',
      description: 'Multiple loan tranches',
      iconComponent: Split,
      badge: 'Advanced',
      badgeVariant: 'default' as const,
    },
  ];

  const defaultProps = {
    options: mockOptions,
    selectedCalculator: 'single',
    onCalculatorChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    expect(screen.getByText('Single Loan')).toBeInTheDocument();
    expect(screen.getByText('Split Loan')).toBeInTheDocument();
  });

  it('renders all calculator options', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    expect(screen.getByText('Single Loan')).toBeInTheDocument();
    expect(screen.getByText('Split Loan')).toBeInTheDocument();
    expect(screen.getByText('Standard loan with fixed rate')).toBeInTheDocument();
    expect(screen.getByText('Multiple loan tranches')).toBeInTheDocument();
  });

  it('shows selected calculator with correct styling', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    const singleLoanCard = screen.getByText('Single Loan').closest('[data-testid="card"]');
    expect(singleLoanCard).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('shows badges for each calculator', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('shows chevron up for selected calculator and chevron down for others', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    const chevronDownIcons = screen.getAllByTestId('chevron-down');
    const chevronUpIcons = screen.getAllByTestId('chevron-up');
    expect(chevronDownIcons).toHaveLength(1); // Only the non-selected calculator
    expect(chevronUpIcons).toHaveLength(1); // The selected calculator
  });

  it('expands calculator when chevron is clicked', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    const chevronButtons = screen.getAllByTestId('button');
    const firstChevronButton = chevronButtons.find(button => 
      button.querySelector('[data-testid="chevron-down"]')
    );
    
    if (firstChevronButton) {
      fireEvent.click(firstChevronButton);
      expect(screen.getByText('Select This Calculator')).toBeInTheDocument();
    }
  });

  it('calls onCalculatorChange when calculator is selected', () => {
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorAccordion
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    // First expand the non-selected calculator (split loan)
    const chevronButtons = screen.getAllByTestId('button');
    const splitChevronButton = chevronButtons.find(button => 
      button.querySelector('[data-testid="chevron-down"]')
    );
    
    if (splitChevronButton) {
      fireEvent.click(splitChevronButton);
      
      // Then click the select button
      const selectButton = screen.getByText('Select This Calculator');
      fireEvent.click(selectButton);
      
      expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
    }
  });

  it('shows "Currently Selected" for selected calculator', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    
    // The selected calculator should already be expanded and show "Currently Selected"
    expect(screen.getByText('Currently Selected')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CalculatorAccordion {...defaultProps} className="custom-class" />);
    const container = screen.getByText('Single Loan').closest('.space-y-4');
    expect(container).toHaveClass('custom-class');
  });

  it('shows calculator descriptions when expanded', () => {
    render(<CalculatorAccordion {...defaultProps} />);
    
    // The selected calculator should already be expanded and show its description
    expect(screen.getByText(/Calculate payments for a single loan/)).toBeInTheDocument();
  });
});
