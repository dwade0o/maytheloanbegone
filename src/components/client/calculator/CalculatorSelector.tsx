'use client';

import { motion } from 'framer-motion';
import CalculatorTabs from '@/components/shared/CalculatorTabs';
import { calculatorOptions } from '@/constants/calculatorConfig';
import { CalculatorType } from '@/types/loan';

interface CalculatorSelectorProps {
  calculatorType: CalculatorType;
  onCalculatorChange: (type: CalculatorType) => void;
}

export default function CalculatorSelector({
  calculatorType,
  onCalculatorChange,
}: CalculatorSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Unified Calculator Tabs - Works on all devices */}
      <CalculatorTabs
        options={calculatorOptions}
        selectedCalculator={calculatorType}
        onCalculatorChange={calculatorId =>
          onCalculatorChange(calculatorId as CalculatorType)
        }
      />
    </motion.div>
  );
}
