import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { formatCurrency } from '@/lib/helper/loanCalculations';
import { SplitLoanResultsProps } from '@/types/common';
import LoanResultsBase from '@/components/common/LoanResultsBase';
import FeaturedResult from '@/components/common/FeaturedResult';
import ResultRow from '@/components/common/ResultRow';

export default function SplitLoanResultsComponent({
  results,
}: SplitLoanResultsProps) {
  return (
    <LoanResultsBase
      title="Split Loan Results"
      description="Combined and individual tranche breakdowns"
      icon={<BarChart3 className="h-5 w-5 text-green-500" />}
      results={results}
      emptyStateDescription="Set up your loan tranches to see detailed payment breakdowns"
    >
      {results && (
        <>
          {/* Combined Summary */}
          <div className="space-y-4">
            <FeaturedResult
              label="Total Monthly Payment"
              value={formatCurrency(results.combined.monthlyPayment)}
              subtitle={`Across ${results.tranches.length} tranche${results.tranches.length > 1 ? 's' : ''}`}
            />

            {/* Combined Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Payment
                </div>
                <div className="text-xl font-semibold">
                  {formatCurrency(results.combined.totalPayment)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Interest
                </div>
                <div className="text-xl font-semibold text-orange-600">
                  {formatCurrency(results.combined.totalInterest)}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tranches">By Tranche</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="space-y-3">
                <ResultRow
                  label="Principal Amount"
                  value={formatCurrency(results.totalPrincipal)}
                  badge={{
                    text: `${results.tranches.length} tranches`,
                    variant: 'secondary',
                  }}
                />

                <ResultRow
                  label="Average Term"
                  value={`${results.combined.loanTermMonths} months`}
                  badge={{
                    text: `${Math.floor(results.combined.loanTermMonths / 12)}y ${results.combined.loanTermMonths % 12}m`,
                    variant: 'outline',
                  }}
                />

                <ResultRow
                  label="Interest Percentage"
                  value={`${((results.combined.totalInterest / results.totalPrincipal) * 100).toFixed(1)}%`}
                  valueColor="text-orange-600"
                  badge={{
                    text: 'of principal',
                    variant: 'outline',
                    className: 'text-orange-600 border-orange-600',
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="tranches" className="space-y-4 mt-6">
              <div className="space-y-4">
                {results.tranches.map((tranche, index) => (
                  <motion.div
                    key={tranche.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        {tranche.label || `Tranche ${index + 1}`}
                      </h4>
                      <Badge variant="outline">
                        {formatCurrency(tranche.principal)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Monthly:{' '}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(tranche.monthlyPayment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Total:{' '}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(tranche.totalPayment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Interest:{' '}
                        </span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(tranche.totalInterest)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Term:{' '}
                        </span>
                        <span className="font-semibold">
                          {tranche.loanTermMonths} months
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Summary */}
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your split loan has an average term of{' '}
              <strong>
                {Math.floor(results.combined.loanTermMonths / 12)} years and{' '}
                {results.combined.loanTermMonths % 12} months
              </strong>
              , with a total interest cost of{' '}
              <strong>{formatCurrency(results.combined.totalInterest)}</strong>.
            </p>
          </div>
        </>
      )}
    </LoanResultsBase>
  );
}
