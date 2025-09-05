import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Input } from '@/components/client/ui/input';
import { Label } from '@/components/client/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/client/ui/select';

interface PeriodFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  periodType?: {
    value: 'days' | 'months' | 'years';
    onChange: (value: 'days' | 'months' | 'years') => void;
  };
  className?: string;
}

export default function PeriodField({
  id,
  label,
  value,
  onChange,
  error,
  periodType,
  className = '',
}: PeriodFieldProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className={`space-y-2 flex-[1.4] ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium flex items-center gap-2"
      >
        <Clock className="h-4 w-4 text-green-500" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="number"
          min="0.1"
          step="0.1"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="text-base flex-1 min-w-[80px]"
          placeholder="Amount"
        />
        {periodType && isHydrated && (
          <Select value={periodType.value} onValueChange={periodType.onChange}>
            <SelectTrigger className="w-28 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        )}
        {periodType && !isHydrated && (
          <div className="w-28 h-9 border border-input rounded-md bg-transparent px-3 py-2 text-sm flex items-center justify-center">
            {periodType.value}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
