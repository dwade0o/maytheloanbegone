import { Badge } from '@/components/client/ui/badge';
import { formatCurrency } from '@/lib/helper/loanCalculations';

interface AnalysisPeriodResultsProps {
  results: {
    selectedPeriod: {
      startDate: string;
      endDate: string;
      months: number;
      amountToPay: number;
      principalPaid: number;
      interestPaid: number;
    };
  };
}

export default function AnalysisPeriodResults({
  results,
}: AnalysisPeriodResultsProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="border-purple-500 text-purple-600">
          Selected Analysis Period
        </Badge>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {results.selectedPeriod.months} months
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Amount to Pay
            </div>
            <div className="text-xl font-semibold text-purple-600">
              {formatCurrency(results.selectedPeriod.amountToPay)}
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-600"
          >
            In This Period
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Principal
            </div>
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(results.selectedPeriod.principalPaid)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Interest
            </div>
            <div className="text-lg font-semibold text-orange-600">
              {formatCurrency(results.selectedPeriod.interestPaid)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
