import { TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/helper/loanCalculations';
import { LoanResultsProps } from '@/types/common';
import LoanResultsBase from '@/components/shared/LoanResultsBase';
import FeaturedResult from '@/components/shared/FeaturedResult';
import ResultRow from '@/components/shared/ResultRow';
import PaymentFrequencySelector, {
  PaymentFrequency,
} from '@/components/shared/PaymentFrequencySelector';

export default function LoanResults({ results }: LoanResultsProps) {
  const [selectedFrequency, setSelectedFrequency] =
    useState<PaymentFrequency>('monthly');

  const getPaymentAmount = () => {
    if (!results) return 0;
    switch (selectedFrequency) {
      case 'weekly':
        return results.weeklyPayment;
      case 'fortnightly':
        return results.fortnightlyPayment;
      default:
        return results.monthlyPayment;
    }
  };

  const getPaymentLabel = () => {
    switch (selectedFrequency) {
      case 'weekly':
        return 'Weekly Payment';
      case 'fortnightly':
        return 'Fortnightly Payment';
      default:
        return 'Monthly Payment';
    }
  };

  return (
    <LoanResultsBase
      title="Calculation Results"
      description="Your loan payment breakdown"
      icon={<TrendingUp className="h-5 w-5 text-green-500" />}
      results={results}
      emptyStateDescription="Fill out the form to see your loan payment details"
    >
      {results && (
        <>
          <PaymentFrequencySelector
            selectedFrequency={selectedFrequency}
            onFrequencyChange={setSelectedFrequency}
          />

          <FeaturedResult
            label={getPaymentLabel()}
            value={formatCurrency(getPaymentAmount())}
          />

          <div className="space-y-4">
            <ResultRow
              label="Total Payment"
              value={formatCurrency(results.totalPayment)}
              badge={{
                text: `${results.loanTermMonths} months`,
                variant: 'secondary',
              }}
            />

            <ResultRow
              label="Total Interest"
              value={formatCurrency(results.totalInterest)}
              valueColor="text-orange-600"
              badge={{
                text: `${((results.totalInterest / (results.totalPayment - results.totalInterest)) * 100).toFixed(1)}%`,
                variant: 'outline',
                className: 'text-orange-600 border-orange-600',
              }}
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Over {Math.floor(results.loanTermMonths / 12)} years and{' '}
              {results.loanTermMonths % 12} months, you&apos;ll pay{' '}
              <strong>{formatCurrency(results.totalInterest)}</strong> in
              interest.
            </p>
          </div>
        </>
      )}
    </LoanResultsBase>
  );
}
