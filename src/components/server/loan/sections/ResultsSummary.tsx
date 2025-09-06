import { formatCurrency } from '@/lib/helper/loanCalculations';

interface ResultsSummaryProps {
  results: {
    totalPeriod: {
      months: number;
      interestPaid: number;
      principalPaid: number;
      remainingBalance: number;
    };
    futureEstimate?: {
      rate: string;
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
    };
  };
}

export default function ResultsSummary({ results }: ResultsSummaryProps) {
  return (
    <div className="pt-4 border-t">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        During your{' '}
        <strong>{results.totalPeriod.months}-month fixed rate period</strong>,
        you&apos;ll pay{' '}
        <strong>{formatCurrency(results.totalPeriod.interestPaid)}</strong> in
        interest and reduce your principal by{' '}
        <strong>{formatCurrency(results.totalPeriod.principalPaid)}</strong>.
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
  );
}
