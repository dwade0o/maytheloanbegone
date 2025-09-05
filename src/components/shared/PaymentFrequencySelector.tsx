import React from 'react';
import { Button } from '@/components/client/ui/button';

export type PaymentFrequency = 'monthly' | 'weekly' | 'fortnightly';

interface PaymentFrequencySelectorProps {
  selectedFrequency: PaymentFrequency;
  onFrequencyChange: (frequency: PaymentFrequency) => void;
}

const frequencyOptions = [
  {
    value: 'monthly' as const,
    label: 'Monthly',
    description: '12 payments per year',
  },
  {
    value: 'weekly' as const,
    label: 'Weekly',
    description: '52 payments per year',
  },
  {
    value: 'fortnightly' as const,
    label: 'Fortnightly',
    description: '26 payments per year',
  },
];

export default function PaymentFrequencySelector({
  selectedFrequency,
  onFrequencyChange,
}: PaymentFrequencySelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Payment Frequency
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {frequencyOptions.map(option => (
          <Button
            key={option.value}
            variant={selectedFrequency === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFrequencyChange(option.value)}
            className="flex flex-col items-center p-3 h-auto"
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {option.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
