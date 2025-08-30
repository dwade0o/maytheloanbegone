import { TrendingUp } from "lucide-react";

import { formatCurrency } from "@/lib/helper/loanCalculations";
import { LoanResultsProps } from "@/types/common";
import LoanResultsBase from "@/components/common/LoanResultsBase";
import FeaturedResult from "@/components/common/FeaturedResult";
import ResultRow from "@/components/common/ResultRow";

export default function LoanResults({ results }: LoanResultsProps) {
  return (
    <LoanResultsBase
      title="Calculation Results"
      description="Your loan payment breakdown"
      icon={<TrendingUp className="h-5 w-5 text-green-500" />}
      results={results}
      emptyStateDescription="Fill out the form to see your loan payment details"
    >
      {results && (
        <>
          <FeaturedResult
            label="Monthly Payment"
            value={formatCurrency(results.monthlyPayment)}
          />

          <div className="space-y-4">
            <ResultRow
              label="Total Payment"
              value={formatCurrency(results.totalPayment)}
              badge={{
                text: `${results.loanTermMonths} months`,
                variant: "secondary"
              }}
            />

            <ResultRow
              label="Total Interest"
              value={formatCurrency(results.totalInterest)}
              valueColor="text-orange-600"
              badge={{
                text: `${((results.totalInterest / (results.totalPayment - results.totalInterest)) * 100).toFixed(1)}%`,
                variant: "outline",
                className: "text-orange-600 border-orange-600"
              }}
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Over {Math.floor(results.loanTermMonths / 12)} years and {results.loanTermMonths % 12} months, 
              you&apos;ll pay <strong>{formatCurrency(results.totalInterest)}</strong> in interest.
            </p>
          </div>
        </>
      )}
    </LoanResultsBase>
  );
}
