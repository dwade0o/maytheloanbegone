import { Badge } from '@/components/client/ui/badge';
import { formatCurrency } from '@/lib/helper/loanCalculations';
import ResultRow from '@/components/shared/ResultRow';

interface TotalPeriodDetailsProps {
  results: any;
}

export default function TotalPeriodDetails({
  results,
}: TotalPeriodDetailsProps) {
  return (
    <div className="space-y-3">
      <ResultRow
        label="Total Paid"
        value={formatCurrency(results.totalPeriod.totalPaid)}
        badge={{
          text: 'Complete Period',
          variant: 'secondary',
        }}
      />

      <ResultRow
        label="Principal Paid"
        value={formatCurrency(results.totalPeriod.principalPaid)}
        valueColor="text-green-600"
        badge={{
          text: 'Principal',
          variant: 'outline',
          className: 'text-green-600 border-green-600',
        }}
      />

      <ResultRow
        label="Interest Paid"
        value={formatCurrency(results.totalPeriod.interestPaid)}
        valueColor="text-orange-600"
        badge={{
          text: 'Interest',
          variant: 'outline',
          className: 'text-orange-600 border-orange-600',
        }}
      />

      <ResultRow
        label="Remaining Balance"
        value={formatCurrency(results.totalPeriod.remainingBalance)}
        valueColor="text-red-600"
        badge={{
          text: 'After Fixed Period',
          variant: 'outline',
          className: 'text-red-600 border-red-600',
        }}
      />
    </div>
  );
}
