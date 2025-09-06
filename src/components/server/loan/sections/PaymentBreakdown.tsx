import { Badge } from '@/components/client/ui/badge';
import { formatCurrency } from '@/lib/helper/loanCalculations';

interface PaymentBreakdownProps {
  results: any;
}

export default function PaymentBreakdown({ results }: PaymentBreakdownProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
        Monthly Payment Breakdown
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {results.totalPeriod.paymentBreakdown.slice(0, 6).map((month: any) => (
          <div
            key={month.month}
            className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline">Month {month.month}</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Balance: {formatCurrency(month.balance)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600">
                Principal: {formatCurrency(month.principal)}
              </span>
              <span className="text-orange-600">
                Interest: {formatCurrency(month.interest)}
              </span>
              <span className="font-semibold">
                Total: {formatCurrency(month.totalPayment)}
              </span>
            </div>
          </div>
        ))}
        {results.totalPeriod.paymentBreakdown.length > 6 && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            ... and {results.totalPeriod.paymentBreakdown.length - 6} more
            months
          </div>
        )}
      </div>
    </div>
  );
}
