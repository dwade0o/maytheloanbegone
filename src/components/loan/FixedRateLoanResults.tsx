import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp, Percent } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { FixedRateLoanResults } from '@/types/loan';
import { formatCurrency } from '@/lib/helper/loanCalculations';

interface FixedRateLoanResultsProps {
  results: FixedRateLoanResults | null;
  isCalculating?: boolean;
}

export default function FixedRateLoanResults({
  results,
  isCalculating,
}: FixedRateLoanResultsProps) {
  if (isCalculating) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Calculating...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="border-2 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Fixed Rate Loan Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            Enter loan details and click Calculate to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Fixed Rate Loan Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Total Payment</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(results.summary.totalPayment)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Total Interest</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(results.summary.totalInterest)}
              </p>
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">Loan Amount</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.loanAmount)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">Loan Term</span>
                </div>
                <p className="text-lg font-semibold">
                  {Math.round(results.totalLoanTermMonths / 12)} years
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">
                    Avg Monthly Payment
                  </span>
                </div>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.summary.averageMonthlyPayment)}
                </p>
              </div>
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="font-medium">Period Coverage</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-600">Coverage</p>
                <p className="text-lg font-semibold text-amber-700">
                  {results.summary.coveragePercentage.toFixed(1)}% of loan term
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-600">Months Covered</p>
                <p className="text-lg font-semibold text-amber-700">
                  {results.summary.monthsCovered} months
                </p>
              </div>
            </div>
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
                          <p className="text-slate-500">Monthly Payment</p>
                          <p className="font-medium">
                            {formatCurrency(period.monthlyPayment)}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
