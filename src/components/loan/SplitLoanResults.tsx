import { motion } from "framer-motion";
import { Calculator, TrendingUp, BarChart3, Percent } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SplitLoanResults, formatCurrency } from "@/helpers/loanCalculations";

interface SplitLoanResultsProps {
  results: SplitLoanResults | null;
}

export default function SplitLoanResultsComponent({ results }: SplitLoanResultsProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Split Loan Results
          </CardTitle>
          <CardDescription>
            Combined and individual tranche breakdowns
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
              {/* Combined Summary */}
              <div className="space-y-4">
                {/* Total Monthly Payment - Featured */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <div className="text-sm font-medium opacity-90">Total Monthly Payment</div>
                  <div className="text-3xl font-bold">{formatCurrency(results.combined.monthlyPayment)}</div>
                  <div className="text-sm opacity-75 mt-1">
                    Across {results.tranches.length} tranche{results.tranches.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Combined Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Payment</div>
                    <div className="text-xl font-semibold">{formatCurrency(results.combined.totalPayment)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Interest</div>
                    <div className="text-xl font-semibold text-orange-600">{formatCurrency(results.combined.totalInterest)}</div>
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
                    <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Principal Amount</div>
                        <div className="text-lg font-semibold">{formatCurrency(results.totalPrincipal)}</div>
                      </div>
                      <Badge variant="secondary">
                        {results.tranches.length} tranches
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Average Term</div>
                        <div className="text-lg font-semibold">{results.combined.loanTermMonths} months</div>
                      </div>
                      <Badge variant="outline">
                        {Math.floor(results.combined.loanTermMonths / 12)}y {results.combined.loanTermMonths % 12}m
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Interest Percentage</div>
                        <div className="text-lg font-semibold text-orange-600">
                          {((results.combined.totalInterest / results.totalPrincipal) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Percent className="h-3 w-3 mr-1" />
                        of principal
                      </Badge>
                    </div>
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
                            <span className="text-slate-600 dark:text-slate-400">Monthly: </span>
                            <span className="font-semibold">{formatCurrency(tranche.monthlyPayment)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Total: </span>
                            <span className="font-semibold">{formatCurrency(tranche.totalPayment)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Interest: </span>
                            <span className="font-semibold text-orange-600">{formatCurrency(tranche.totalInterest)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Term: </span>
                            <span className="font-semibold">{tranche.loanTermMonths} months</span>
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
                  Your split loan has an average term of{" "}
                  <strong>{Math.floor(results.combined.loanTermMonths / 12)} years and {results.combined.loanTermMonths % 12} months</strong>, 
                  with a total interest cost of <strong>{formatCurrency(results.combined.totalInterest)}</strong>.
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
                Set up your loan tranches to see detailed payment breakdowns
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
