import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { FixedPeriodResults } from '@/types/loan';
import { formatCurrency } from '@/lib/helper/loanCalculations';
import LoanResultsBase from '@/components/common/LoanResultsBase';
import FeaturedResult from '@/components/common/FeaturedResult';
import ResultRow from '@/components/common/ResultRow';

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

            <FeaturedResult
              label="Monthly Principal Reduction"
              value={formatCurrency(results.totalPeriod.monthlyPrincipal)}
              subtitle={`Fixed amount every month for ${Math.floor(results.totalPeriod.months / 12)} years and ${results.totalPeriod.months % 12} months`}
            />

            <FeaturedResult
              label="Monthly Interest (First Month)"
              value={formatCurrency(
                results.totalPeriod.paymentBreakdown[0]?.interest || 0
              )}
              subtitle="Decreases each month as balance reduces"
              gradient="from-orange-500 to-red-500"
            />

            <FeaturedResult
              label="Total Monthly Payment (First Month)"
              value={formatCurrency(
                results.totalPeriod.paymentBreakdown[0]?.totalPayment || 0
              )}
              subtitle={`Principal + Interest = ${formatCurrency(results.totalPeriod.monthlyPrincipal)} + ${formatCurrency(results.totalPeriod.paymentBreakdown[0]?.interest || 0)}`}
              gradient="from-green-500 to-emerald-500"
            />

            {/* Total Period Details */}
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

            {/* Monthly Payment Breakdown */}
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Monthly Payment Breakdown
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {results.totalPeriod.paymentBreakdown.slice(0, 6).map(month => (
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
                    ... and {results.totalPeriod.paymentBreakdown.length - 6}{' '}
                    more months
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Analysis Period Results */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="border-purple-500 text-purple-600"
              >
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

          {/* Future Estimate (if available) */}
          {results.futureEstimate && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600"
                >
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
                      <strong>Note:</strong> This is an estimate based on the
                      remaining balance and assumed 30-year total loan term.
                      Actual payments may vary based on your specific loan terms
                      and payment history.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              During your{' '}
              <strong>
                {results.totalPeriod.months}-month fixed rate period
              </strong>
              , you&apos;ll pay{' '}
              <strong>
                {formatCurrency(results.totalPeriod.interestPaid)}
              </strong>{' '}
              in interest and reduce your principal by{' '}
              <strong>
                {formatCurrency(results.totalPeriod.principalPaid)}
              </strong>
              .
              {results.futureEstimate && (
                <>
                  {' '}
                  After the fixed period ends, you&apos;ll still owe{' '}
                  <strong>
                    {formatCurrency(results.totalPeriod.remainingBalance)}
                  </strong>
                  .
                </>
              )}
            </p>
          </div>
        </>
      )}
    </LoanResultsBase>
  );
}
