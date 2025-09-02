'use client';

import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorAccordion from '@/components/common/CalculatorAccordion';
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
  const { isMobile } = useResponsive();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Calculator Type Selector - Mobile Accordion */}
      {isMobile && (
        <div>
          <CalculatorAccordion
            options={calculatorOptions}
            selectedCalculator={calculatorType}
            onCalculatorChange={calculatorId =>
              onCalculatorChange(calculatorId as CalculatorType)
            }
          />
        </div>
      )}

      {/* Calculator Type Selector - Desktop Buttons */}
      {!isMobile && (
        <div className="flex justify-center gap-4">
          {calculatorOptions.map(option => {
            const IconComponent = option.iconComponent;
            return (
              <Button
                key={option.id}
                variant={calculatorType === option.id ? 'default' : 'outline'}
                onClick={() => onCalculatorChange(option.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {option.title}
                <Badge variant="secondary" className="ml-2">
                  {option.badge}
                </Badge>
              </Button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
