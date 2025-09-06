'use client';

import { useState } from 'react';
import PaymentFrequencySelector, {
  PaymentFrequency,
} from '@/components/shared/PaymentFrequencySelector';
import PaymentFrequencyResults from '@/components/server/loan/sections/PaymentFrequencyResults';

interface PaymentFrequencyControllerProps {
  results: any;
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
