import { Calendar } from 'lucide-react';
import { Input } from '@/components/client/ui/input';
import { Label } from '@/components/client/ui/label';

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showIcon?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
}

export default function DateField({
  id,
  label,
  value,
  onChange,
  error,
  showIcon = false,
  min,
  max,
  disabled = false,
  className = '',
}: DateFieldProps) {
  return (
    <div className={`space-y-2 flex-[0.8] ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium flex items-center gap-2"
      >
        {showIcon && <Calendar className="h-4 w-4 text-blue-500" />}
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        {...(min && { min })}
        {...(max && { max })}
        className={`text-base ${error ? 'border-red-500 focus:border-red-500' : ''} ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
