'use client';

import { useState } from 'react';
import PaymentFrequencySelector, {
  PaymentFrequency,
} from '@/components/shared/PaymentFrequencySelector';
import PaymentFrequencyResults from '@/components/server/loan/sections/PaymentFrequencyResults';

interface PaymentFrequencyControllerProps {
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
}

export default function PaymentFrequencyController({
  results,
}: PaymentFrequencyControllerProps) {
  const [selectedFrequency, setSelectedFrequency] =
    useState<PaymentFrequency>('monthly');

  return (
    <>
      <PaymentFrequencySelector
        selectedFrequency={selectedFrequency}
        onFrequencyChange={setSelectedFrequency}
      />

      <PaymentFrequencyResults
        results={results}
        selectedFrequency={selectedFrequency}
      />
    </>
  );
}
