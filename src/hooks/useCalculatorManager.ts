import { useState } from 'react';
import { CalculatorType } from '@/types/loan';
import { calculatorOptions } from '@/constants/calculatorConfig';

export function useCalculatorManager() {
  const [calculatorType, setCalculatorType] =
    useState<CalculatorType>('single');

  const switchCalculatorType = (type: CalculatorType) => {
    setCalculatorType(type);
  };

  return {
    calculatorType,
    switchCalculatorType,
    calculatorOptions,
  };
}
