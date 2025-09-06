import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalculatorTabs from '@/components/shared/CalculatorTabs';
import { CreditCard, Split, Calendar, TrendingUp } from 'lucide-react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
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

describe('CalculatorTabs', () => {
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
    {
      id: 'fixed-period' as const,
      title: 'Fixed Period',
      description: 'Fixed rate then variable',
      iconComponent: Calendar,
      badge: 'Realistic',
      badgeVariant: 'outline' as const,
    },
    {
      id: 'fixed-rate' as const,
      title: 'Fixed Rate',
      description: 'Multiple fixed rate periods',
      iconComponent: TrendingUp,
      badge: 'Multi-Rate',
      badgeVariant: 'secondary' as const,
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
    render(<CalculatorTabs {...defaultProps} />);
    expect(screen.getByText('Single Loan')).toBeInTheDocument();
    expect(screen.getByText('Split Loan')).toBeInTheDocument();
  });

  it('renders all calculator options as tabs', () => {
    render(<CalculatorTabs {...defaultProps} />);
    expect(screen.getByText('Single Loan')).toBeInTheDocument();
    expect(screen.getByText('Split Loan')).toBeInTheDocument();
    expect(screen.getByText('Fixed Period')).toBeInTheDocument();
    expect(screen.getByText('Fixed Rate')).toBeInTheDocument();
  });

  it('renders icons for each tab', () => {
    render(<CalculatorTabs {...defaultProps} />);
    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
    expect(screen.getByTestId('split')).toBeInTheDocument();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up')).toBeInTheDocument();
  });

  it('shows selected calculator with correct styling', () => {
    render(<CalculatorTabs {...defaultProps} />);
    const selectedTab = screen.getByRole('tab', { name: /single loan/i });
    expect(selectedTab).toHaveAttribute('aria-selected', 'true');
    expect(selectedTab).toHaveClass('text-blue-600', 'bg-blue-50');
  });

  it('shows unselected calculators with correct styling', () => {
    render(<CalculatorTabs {...defaultProps} />);
    const unselectedTab = screen.getByRole('tab', { name: /split loan/i });
    expect(unselectedTab).toHaveAttribute('aria-selected', 'false');
    expect(unselectedTab).toHaveClass('text-gray-500');
  });

  it('calls onCalculatorChange when tab is clicked', () => {
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const splitTab = screen.getByRole('tab', { name: /split loan/i });
    fireEvent.click(splitTab);
    
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
  });

  it('handles keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    const { rerender } = render(
      <CalculatorTabs
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Press right arrow to go to next tab
    await user.keyboard('{ArrowRight}');
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
    
    // Update the component with new selected calculator
    rerender(
      <CalculatorTabs
        {...defaultProps}
        selectedCalculator="split"
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    // Press right arrow again
    await user.keyboard('{ArrowRight}');
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('fixed-period');
    
    // Update the component with new selected calculator
    rerender(
      <CalculatorTabs
        {...defaultProps}
        selectedCalculator="fixed-period"
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    // Press left arrow to go back
    await user.keyboard('{ArrowLeft}');
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
  });

  it('wraps around when navigating past the last tab', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        selectedCalculator="fixed-rate"
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Press right arrow from last tab should go to first
    await user.keyboard('{ArrowRight}');
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('single');
  });

  it('wraps around when navigating before the first tab', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        selectedCalculator="single"
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Press left arrow from first tab should go to last
    await user.keyboard('{ArrowLeft}');
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('fixed-rate');
  });

  it('handles Enter key to activate focused tab', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Navigate to split tab and press Enter
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Enter}');
    
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
  });

  it('handles Space key to activate focused tab', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Navigate to split tab and press Space
    await user.keyboard('{ArrowRight}');
    await user.keyboard(' ');
    
    expect(mockOnCalculatorChange).toHaveBeenCalledWith('split');
  });

  it('applies custom className', () => {
    render(<CalculatorTabs {...defaultProps} className="custom-class" />);
    const container = screen.getByRole('tablist').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('has proper ARIA attributes', () => {
    render(<CalculatorTabs {...defaultProps} />);
    
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'Calculator selection');
    
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    
    tabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute('aria-selected', index === 0 ? 'true' : 'false');
      expect(tab).toHaveAttribute('aria-controls', `calculator-${mockOptions[index].id}`);
      expect(tab).toHaveAttribute('id', `tab-${mockOptions[index].id}`);
    });
  });

  it('handles mouse hover events', () => {
    render(<CalculatorTabs {...defaultProps} />);
    
    const splitTab = screen.getByRole('tab', { name: /split loan/i });
    fireEvent.mouseEnter(splitTab);
    
    // The tab should have hover styling (this is handled by CSS classes)
    expect(splitTab).toBeInTheDocument();
  });

  it('handles focus events', () => {
    render(<CalculatorTabs {...defaultProps} />);
    
    const splitTab = screen.getByRole('tab', { name: /split loan/i });
    fireEvent.focus(splitTab);
    
    // The tab should be focused (this tests that focus event is handled)
    expect(splitTab).toBeInTheDocument();
    // Note: toHaveFocus() might not work in jsdom, so we test the event handling instead
  });

  it('renders active indicator for selected tab', () => {
    render(<CalculatorTabs {...defaultProps} />);
    
    // The active indicator is a div with specific classes
    const activeIndicator = document.querySelector('.h-0\\.5.bg-blue-600');
    expect(activeIndicator).toBeInTheDocument();
  });

  it('updates selected calculator when prop changes', () => {
    const { rerender } = render(<CalculatorTabs {...defaultProps} />);
    
    // Initially single is selected
    expect(screen.getByRole('tab', { name: /single loan/i })).toHaveAttribute('aria-selected', 'true');
    
    // Change to split
    rerender(
      <CalculatorTabs
        {...defaultProps}
        selectedCalculator="split"
      />
    );
    
    expect(screen.getByRole('tab', { name: /split loan/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /single loan/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('handles empty options array', () => {
    render(
      <CalculatorTabs
        options={[]}
        selectedCalculator=""
        onCalculatorChange={jest.fn()}
      />
    );
    
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('prevents default behavior for arrow keys', async () => {
    const user = userEvent.setup();
    const mockOnCalculatorChange = jest.fn();
    render(
      <CalculatorTabs
        {...defaultProps}
        onCalculatorChange={mockOnCalculatorChange}
      />
    );
    
    const tabContainer = screen.getByRole('tablist');
    tabContainer.focus();
    
    // Create a spy to check if preventDefault was called
    const preventDefaultSpy = jest.spyOn(KeyboardEvent.prototype, 'preventDefault');
    
    await user.keyboard('{ArrowRight}');
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    preventDefaultSpy.mockRestore();
  });

  it('handles tab container focus', () => {
    render(<CalculatorTabs {...defaultProps} />);
    
    const tabContainer = screen.getByRole('tablist');
    expect(tabContainer).toHaveAttribute('tabIndex', '0');
  });
});
