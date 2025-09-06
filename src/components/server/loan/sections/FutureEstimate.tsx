import { TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/client/ui/badge';
import { formatCurrency } from '@/lib/helper/loanCalculations';

interface FutureEstimateProps {
  results: any;
}

export default function FutureEstimate({ results }: FutureEstimateProps) {
  if (!results.futureEstimate) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <Badge variant="outline" className="border-green-500 text-green-600">
          Future Estimate
        </Badge>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          After fixed period ends
        </span>
      </div>

      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="text-sm text-green-700 dark:text-green-300 mb-2">
          Estimated at {results.futureEstimate.rate}% rate
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Monthly Payment
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(results.futureEstimate.monthlyPayment)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Interest
            </div>
            <div className="text-lg font-semibold text-orange-600">
              {formatCurrency(results.futureEstimate.totalInterest)}
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>Note:</strong> This is an estimate based on the remaining
              balance and assumed 30-year total loan term. Actual payments may
              vary based on your specific loan terms and payment history.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
