import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email';
  step?: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: FieldError;
  register?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function FormField({
  id,
  label,
  type = 'text',
  step,
  placeholder,
  icon,
  error,
  register,
  className = '',
  value,
  onChange,
}: FormFieldProps) {
  // If register is provided, use it directly
  if (register) {
    const registerProps = register(id);
    return (
      <div className={`space-y-2 ${className}`}>
        <Label
          htmlFor={id}
          className="text-sm font-medium flex items-center gap-2"
        >
          {icon}
          {label}
        </Label>
        <Input
          id={id}
          type={type}
          step={step}
          placeholder={placeholder}
          {...registerProps}
          className="text-lg"
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }

  // Otherwise use controlled input with value/onChange
  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium flex items-center gap-2"
      >
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        className="text-lg"
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
