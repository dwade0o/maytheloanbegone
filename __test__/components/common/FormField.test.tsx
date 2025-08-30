import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '@/components/common/FormField';
import { FieldError } from 'react-hook-form';

// Mock the UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({
    id,
    type,
    step,
    placeholder,
    onChange,
    value,
    ...props
  }: {
    id: string;
    type?: string;
    step?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    [key: string]: unknown;
  }) => {
    return React.createElement('input', {
      id,
      type,
      step,
      placeholder,
      onChange,
      value,
      ...props,
      'data-testid': 'form-input',
    });
  },
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    htmlFor,
    children,
    className,
  }: {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <label htmlFor={htmlFor} className={className} data-testid="form-label">
        {children}
      </label>
    );
  },
}));

describe('FormField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
  };

  it('renders without crashing', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByTestId('form-label')).toBeInTheDocument();
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
  });

  it('renders label with correct text', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders input with correct id', () => {
    render(<FormField {...defaultProps} />);
    const input = screen.getByTestId('form-input');
    expect(input).toHaveAttribute('id', 'test-field');
  });

  it('renders input with correct type', () => {
    render(<FormField {...defaultProps} type="number" />);
    const input = screen.getByTestId('form-input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('defaults to text type when no type is specified', () => {
    render(<FormField {...defaultProps} />);
    const input = screen.getByTestId('form-input');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders step attribute when provided', () => {
    render(<FormField {...defaultProps} type="number" step="0.01" />);
    const input = screen.getByTestId('form-input');
    expect(input).toHaveAttribute('step', '0.01');
  });

  it('renders placeholder when provided', () => {
    render(<FormField {...defaultProps} placeholder="Enter value" />);
    const input = screen.getByTestId('form-input');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="test-icon">🚀</span>;
    render(<FormField {...defaultProps} icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    const error: FieldError = {
      type: 'required',
      message: 'This field is required',
    };
    render(<FormField {...defaultProps} error={error} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not render error message when no error is provided', () => {
    render(<FormField {...defaultProps} />);
    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<FormField {...defaultProps} className="custom-class" />);
    const container = screen.getByTestId('form-label').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('defaults to empty string className when not provided', () => {
    render(<FormField {...defaultProps} />);
    const container = screen.getByTestId('form-label').parentElement;
    expect(container).toHaveClass('space-y-2');
  });

  describe('with register function', () => {
    it('uses register when provided', () => {
      const mockRegister = jest.fn().mockReturnValue({
        name: 'test-field',
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      });

      render(<FormField {...defaultProps} register={mockRegister} />);
      expect(mockRegister).toHaveBeenCalledWith('test-field');
    });

    it('calls register with correct field id', () => {
      const mockRegister = jest.fn().mockReturnValue({});
      render(
        <FormField {...defaultProps} id="custom-id" register={mockRegister} />
      );
      expect(mockRegister).toHaveBeenCalledWith('custom-id');
    });
  });

  describe('without register function', () => {
    it('uses value and onChange when register is not provided', async () => {
      const mockOnChange = jest.fn();
      const user = userEvent.setup();

      render(
        <FormField
          {...defaultProps}
          value="initial value"
          onChange={mockOnChange}
        />
      );

      const input = screen.getByTestId('form-input');
      expect(input).toHaveValue('initial value');

      // Test that onChange is called when input changes
      await user.type(input, 'x');
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles onChange event correctly', async () => {
      const mockOnChange = jest.fn();
      const user = userEvent.setup();

      render(<FormField {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByTestId('form-input');
      await user.type(input, 'test input');

      expect(mockOnChange).toHaveBeenCalledWith('test input');
    });

    it('calls onChange with input value', async () => {
      const mockOnChange = jest.fn();
      const user = userEvent.setup();

      render(<FormField {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByTestId('form-input');
      await user.type(input, 'hello world');

      expect(mockOnChange).toHaveBeenCalledWith('hello world');
    });
  });

  describe('input types', () => {
    it('renders text input correctly', () => {
      render(<FormField {...defaultProps} type="text" />);
      const input = screen.getByTestId('form-input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders number input correctly', () => {
      render(<FormField {...defaultProps} type="number" />);
      const input = screen.getByTestId('form-input');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders date input correctly', () => {
      render(<FormField {...defaultProps} type="date" />);
      const input = screen.getByTestId('form-input');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('renders email input correctly', () => {
      render(<FormField {...defaultProps} type="email" />);
      const input = screen.getByTestId('form-input');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(<FormField {...defaultProps} />);
      const label = screen.getByTestId('form-label');
      const input = screen.getByTestId('form-input');

      expect(label).toHaveAttribute('for', 'test-field');
      expect(input).toHaveAttribute('id', 'test-field');
    });

    it('renders label text for screen readers', () => {
      render(<FormField {...defaultProps} label="Accessible Label" />);
      expect(screen.getByText('Accessible Label')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('displays error message with correct styling', () => {
      const error: FieldError = {
        type: 'validation',
        message: 'Invalid input',
      };
      render(<FormField {...defaultProps} error={error} />);

      const errorMessage = screen.getByText('Invalid input');
      expect(errorMessage).toHaveClass('text-sm', 'text-red-500');
    });

    it('handles multiple error types', () => {
      const error: FieldError = {
        type: 'min',
        message: 'Value too low',
      };
      render(<FormField {...defaultProps} error={error} />);

      expect(screen.getByText('Value too low')).toBeInTheDocument();
    });
  });

  describe('icon integration', () => {
    it('renders icon before label text', () => {
      const icon = <span data-testid="icon">💰</span>;
      render(<FormField {...defaultProps} icon={icon} />);

      const label = screen.getByTestId('form-label');
      const iconElement = screen.getByTestId('icon');

      expect(label).toContainElement(iconElement);
    });

    it('applies correct spacing with icon', () => {
      const icon = <span>💰</span>;
      render(<FormField {...defaultProps} icon={icon} />);

      const label = screen.getByTestId('form-label');
      expect(label).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });
});
