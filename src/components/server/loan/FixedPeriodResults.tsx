import { Calendar } from 'lucide-react';

import { Badge } from '@/components/client/ui/badge';

import { FixedPeriodResults } from '@/types/loan';
import LoanResultsBase from '@/components/shared/LoanResultsBase';
import PaymentFrequencyController from '@/components/client/loan/PaymentFrequencyController';
import TotalPeriodDetails from '@/components/server/loan/sections/TotalPeriodDetails';
import PaymentBreakdown from '@/components/server/loan/sections/PaymentBreakdown';
import AnalysisPeriodResults from '@/components/server/loan/sections/AnalysisPeriodResults';
import FutureEstimate from '@/components/server/loan/sections/FutureEstimate';
import ResultsSummary from '@/components/server/loan/sections/ResultsSummary';

interface FixedPeriodResultsProps {
  results: FixedPeriodResults | null;
  isCalculating?: boolean;
}

export default function FixedPeriodResultsComponent({
  results,
}: FixedPeriodResultsProps) {
  return (
    <LoanResultsBase
      title="Fixed Period Results"
      description="Your loan payment breakdown for the fixed rate period"
      icon={<Calendar className="h-5 w-5 text-green-500" />}
      results={results}
      emptyStateDescription="Fill out the form to see your fixed period loan details"
    >
      {results && (
        <>
          <PaymentFrequencyController results={results} />

          {/* Total Fixed Rate Period Results */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="bg-blue-500">
                Total Fixed Rate Period
              </Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {results.totalPeriod.months} months
              </span>
            </div>

            <TotalPeriodDetails results={results} />

            <PaymentBreakdown results={results} />
          </div>

          <AnalysisPeriodResults results={results} />

          <FutureEstimate results={results} />

          <ResultsSummary results={results} />
        </>
      )}
    </LoanResultsBase>
  );
}
