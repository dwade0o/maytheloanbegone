import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from '@/components/server/loan';
import { FormData } from '@/constants/loanSchema';

// Mock the DateRange component to test the validation behavior
jest.mock('@/components/server/common/DateRange', () => {
  return function MockDateRange({ 
    startDate, 
    endDate, 
    period, 
    periodType, 
    onValidationTrigger 
  }: any) {
    return (
      <div data-testid="date-range">
        <input
          data-testid="start-date"
          value={startDate.value}
          onChange={(e) => startDate.onChange(e.target.value)}
        />
        <input
          data-testid="end-date"
          value={endDate.value}
          onChange={(e) => endDate.onChange(e.target.value)}
        />
        <input
          data-testid="period"
          value={period.value}
          onChange={(e) => {
            period.onChange(e.target.value);
            // Simulate the period change logic that updates end date
            if (startDate.value && e.target.value && periodType.value) {
              const amount = parseInt(e.target.value);
              if (!isNaN(amount) && amount > 0) {
                // Simulate adding 1 day to start date
                const startDateObj = new Date(startDate.value);
                startDateObj.setDate(startDateObj.getDate() + amount);
                const newEndDate = startDateObj.toISOString().split('T')[0];
                endDate.onChange(newEndDate);
                // Trigger validation after end date update
                if (onValidationTrigger) {
                  setTimeout(() => onValidationTrigger(), 0);
                }
              }
            }
          }}
        />
        <select
          data-testid="period-type"
          value={periodType.value}
          onChange={(e) => periodType.onChange(e.target.value)}
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
        {startDate.error && (
          <div data-testid="start-date-error">{startDate.error.message}</div>
        )}
        {endDate.error && (
          <div data-testid="end-date-error">{endDate.error.message}</div>
        )}
      </div>
    );
  };
});

describe('LoanForm Date Validation', () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear validation error when period is updated and end date is recalculated', async () => {
    const user = userEvent.setup();
    
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        isCalculating={false}
      />
    );

    // Fill in loan amount and interest rate
    await user.type(screen.getByLabelText(/loan amount/i), '100000');
    await user.type(screen.getByLabelText(/annual interest rate/i), '5.5');

    // Set same start and end dates to trigger validation error
    const startDateInput = screen.getByTestId('start-date');
    const endDateInput = screen.getByTestId('end-date');
    
    await user.type(startDateInput, '2025-01-01');
    await user.type(endDateInput, '2025-01-01');

    // Submit the form to trigger validation
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(submitButton);

    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });

    // Now change the period to 1 day
    const periodInput = screen.getByTestId('period');
    await user.clear(periodInput);
    await user.type(periodInput, '1');

    // Wait for the end date to be updated and validation to be triggered
    await waitFor(() => {
      expect(endDateInput).toHaveValue('2025-01-02'); // Should be start date + 1 day
    });

    // The validation error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/end date must be after start date/i)).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should show validation error when start and end dates are the same', async () => {
    const user = userEvent.setup();
    
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        isCalculating={false}
      />
    );

    // Fill in loan amount and interest rate
    await user.type(screen.getByLabelText(/loan amount/i), '100000');
    await user.type(screen.getByLabelText(/annual interest rate/i), '5.5');

    // Set same start and end dates
    const startDateInput = screen.getByTestId('start-date');
    const endDateInput = screen.getByTestId('end-date');
    
    await user.type(startDateInput, '2025-01-01');
    await user.type(endDateInput, '2025-01-01');

    // Submit the form to trigger validation
    const submitButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(submitButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });
  });

  it('should not show validation error when end date is after start date', async () => {
    const user = userEvent.setup();
    
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        isCalculating={false}
      />
    );

    // Fill in loan amount and interest rate
    await user.type(screen.getByLabelText(/loan amount/i), '100000');
    await user.type(screen.getByLabelText(/annual interest rate/i), '5.5');

    // Set valid start and end dates
    const startDateInput = screen.getByTestId('start-date');
    const endDateInput = screen.getByTestId('end-date');
    
    await user.type(startDateInput, '2025-01-01');
    await user.type(endDateInput, '2025-01-02');

    // Should not show validation error
    await waitFor(() => {
      expect(screen.queryByTestId('end-date-error')).not.toBeInTheDocument();
    });
  });
});