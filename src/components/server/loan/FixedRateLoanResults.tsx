import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp, Percent } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/client/ui/card';
import { Badge } from '@/components/client/ui/badge';

import type { FixedRateLoanResults } from '@/types/loan';
import { formatCurrency } from '@/lib/helper/loanCalculations';
import LoanResultsBase from '@/components/shared/LoanResultsBase';
import FeaturedResult from '@/components/shared/FeaturedResult';
import ResultRow from '@/components/shared/ResultRow';
import PaymentFrequencySelector, {
  PaymentFrequency,
} from '@/components/shared/PaymentFrequencySelector';

interface FixedRateLoanResultsProps {
  results: FixedRateLoanResults | null;
  isCalculating?: boolean;
}

export default function FixedRateLoanResults({
  results,
  isCalculating,
}: FixedRateLoanResultsProps) {
  const [selectedFrequency, setSelectedFrequency] =
    useState<PaymentFrequency>('monthly');

  const getPaymentAmount = () => {
    if (!results) return 0;
    switch (selectedFrequency) {
      case 'weekly':
        return results.summary.averageWeeklyPayment;
      case 'fortnightly':
        return results.summary.averageFortnightlyPayment;
      default:
        return results.summary.averageMonthlyPayment;
    }
  };

  const getPaymentLabel = () => {
    switch (selectedFrequency) {
      case 'weekly':
        return 'Average Weekly Payment';
      case 'fortnightly':
        return 'Average Fortnightly Payment';
      default:
        return 'Average Monthly Payment';
    }
  };

  return (
    <LoanResultsBase
      title="Fixed Rate Loan Results"
      description="Your multi-rate loan payment breakdown"
      icon={<TrendingUp className="h-5 w-5 text-green-500" />}
      results={results}
      emptyStateDescription="Enter loan details and click Calculate to see results"
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
            subtitle={`Across ${results.periods.length} rate period${results.periods.length > 1 ? 's' : ''}`}
          />

          <div className="space-y-4">
            <ResultRow
              label="Total Payment"
              value={formatCurrency(results.summary.totalPayment)}
              badge={{
                text: `${Math.round(results.totalLoanTermMonths / 12)} years`,
                variant: 'secondary',
              }}
            />

            <ResultRow
              label="Total Interest"
              value={formatCurrency(results.summary.totalInterest)}
              valueColor="text-orange-600"
              badge={{
                text: `${((results.summary.totalInterest / (results.summary.totalPayment - results.summary.totalInterest)) * 100).toFixed(1)}%`,
                variant: 'outline',
                className: 'text-orange-600 border-orange-600',
              }}
            />

            <ResultRow
              label="Loan Amount"
              value={formatCurrency(results.loanAmount)}
              badge={{
                text: `${results.summary.coveragePercentage.toFixed(1)}% coverage`,
                variant: 'outline',
              }}
            />
          </div>

          {/* Periods */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Fixed Rate Periods</h3>
            <div className="space-y-3">
              {results.periods.map((period, index) => (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          {period.label || `Period ${index + 1}`}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {period.interestRate.toFixed(2)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Duration</p>
                          <p className="font-medium">{period.months} months</p>
                        </div>
                        <div>
                          <p className="text-slate-500">
                            {selectedFrequency === 'weekly'
                              ? 'Weekly'
                              : selectedFrequency === 'fortnightly'
                                ? 'Fortnightly'
                                : 'Monthly'}{' '}
                            Payment
                          </p>
                          <p className="font-medium">
                            {formatCurrency(
                              selectedFrequency === 'weekly'
                                ? period.weeklyPayment
                                : selectedFrequency === 'fortnightly'
                                  ? period.fortnightlyPayment
                                  : period.monthlyPayment
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Total Interest</p>
                          <p className="font-medium">
                            {formatCurrency(period.totalInterest)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        {period.startDate} - {period.endDate}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Over {Math.round(results.totalLoanTermMonths / 12)} years,
              you&apos;ll pay{' '}
              <strong>{formatCurrency(results.summary.totalInterest)}</strong>{' '}
              in interest across {results.periods.length} rate period
              {results.periods.length > 1 ? 's' : ''}.
            </p>
          </div>
        </>
      )}
    </LoanResultsBase>
  );
}
