import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { LoanResults as LoanResultsType, formatCurrency } from "@/helpers/loanCalculations";

interface LoanResultsProps {
  results: LoanResultsType | null;
}

export default function LoanResults({ results }: LoanResultsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Calculation Results
          </CardTitle>
          <CardDescription>
            Your loan payment breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Monthly Payment - Featured */}
              <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <div className="text-sm font-medium opacity-90">Monthly Payment</div>
                <div className="text-3xl font-bold">{formatCurrency(results.monthlyPayment)}</div>
              </div>

              {/* Other Results */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Payment</div>
                    <div className="text-xl font-semibold">{formatCurrency(results.totalPayment)}</div>
                  </div>
                  <Badge variant="secondary">
                    {results.loanTermMonths} months
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Interest</div>
                    <div className="text-xl font-semibold text-orange-600">{formatCurrency(results.totalInterest)}</div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    {((results.totalInterest / (results.totalPayment - results.totalInterest)) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Over {Math.floor(results.loanTermMonths / 12)} years and {results.loanTermMonths % 12} months, 
                  you&apos;ll pay <strong>{formatCurrency(results.totalInterest)}</strong> in interest.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                <Calculator className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                Ready to Calculate
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fill out the form to see your loan payment details
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
