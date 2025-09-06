import { PaymentFrequency } from '@/components/shared/PaymentFrequencySelector';
import { formatCurrency } from '@/lib/helper/loanCalculations';
import FeaturedResult from '@/components/shared/FeaturedResult';
import {
  getPaymentAmount,
  getPrincipalReduction,
  getFirstPaymentInterest,
  getFirstPaymentTotal,
} from '@/lib/utils/paymentFrequencyUtils';
import {
  getPaymentLabel,
  getPrincipalReductionLabel,
  getInterestLabel,
  getTotalPaymentLabel,
  getPrincipalReductionSubtitle,
  getInterestSubtitle,
} from '@/lib/utils/frequencyLabelUtils';

interface PaymentFrequencyResultsProps {
  results: {
    totalPeriod: {
      months: number;
      weeklyPayment: number;
      fortnightlyPayment: number;
      monthlyPayment: number;
      monthlyPrincipal: number;
      paymentBreakdown: Array<{
        interest: number;
        totalPayment: number;
      }>;
    };
  } | null;
  selectedFrequency: PaymentFrequency;
}

export default function PaymentFrequencyResults({
  results,
  selectedFrequency,
}: PaymentFrequencyResultsProps) {
  if (!results) return null;

  return (
    <>
      <FeaturedResult
        label={getPaymentLabel(selectedFrequency)}
        value={formatCurrency(getPaymentAmount(results, selectedFrequency))}
        subtitle={`Fixed payment for ${results.totalPeriod.months} months`}
        gradient="from-blue-500 to-cyan-500"
      />

      <FeaturedResult
        label={getPrincipalReductionLabel(selectedFrequency)}
        value={formatCurrency(
          getPrincipalReduction(results, selectedFrequency)
        )}
        subtitle={getPrincipalReductionSubtitle(
          selectedFrequency,
          results.totalPeriod.months
        )}
      />

      <FeaturedResult
        label={getInterestLabel(selectedFrequency)}
        value={formatCurrency(
          getFirstPaymentInterest(results, selectedFrequency)
        )}
        subtitle={getInterestSubtitle(selectedFrequency)}
        gradient="from-orange-500 to-red-500"
      />

      <FeaturedResult
        label={getTotalPaymentLabel(selectedFrequency)}
        value={formatCurrency(getFirstPaymentTotal(results, selectedFrequency))}
        subtitle={`Principal + Interest = ${formatCurrency(getPrincipalReduction(results, selectedFrequency))} + ${formatCurrency(getFirstPaymentInterest(results, selectedFrequency))}`}
        gradient="from-green-500 to-emerald-500"
      />
    </>
  );
}
