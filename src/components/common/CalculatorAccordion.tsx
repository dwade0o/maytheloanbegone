import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CalculatorOption } from '@/constants/calculatorConfig';

interface CalculatorAccordionProps {
  options: CalculatorOption[];
  selectedCalculator: string;
  onCalculatorChange: (calculatorId: string) => void;
  className?: string;
}

export default function CalculatorAccordion({
  options,
  selectedCalculator,
  onCalculatorChange,
  className = '',
}: CalculatorAccordionProps) {
  const [expandedCalculator, setExpandedCalculator] = useState<string | null>(
    selectedCalculator
  );

  // Update expanded calculator when selectedCalculator changes
  useEffect(() => {
    setExpandedCalculator(selectedCalculator);
  }, [selectedCalculator]);

  const handleCalculatorSelect = (calculatorId: string) => {
    onCalculatorChange(calculatorId);
    setExpandedCalculator(calculatorId);
  };

  const toggleExpanded = (calculatorId: string) => {
    if (expandedCalculator === calculatorId) {
      setExpandedCalculator(null);
    } else {
      setExpandedCalculator(calculatorId);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {options.map(option => {
        const isSelected = selectedCalculator === option.id;
        const isExpanded = expandedCalculator === option.id;

        return (
          <Card
            key={option.id}
            className={`transition-all duration-200 cursor-pointer ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => toggleExpanded(option.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <option.iconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {option.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isSelected ? 'default' : option.badgeVariant}
                    className={isSelected ? 'bg-slate-900 text-white' : ''}
                  >
                    {option.badge}
                  </Badge>
                  <div className="p-1">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {getCalculatorDescription(option.id)}
                      </p>
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          handleCalculatorSelect(option.id);
                        }}
                        className="w-full"
                        variant={isSelected ? 'default' : 'outline'}
                      >
                        {isSelected
                          ? 'Currently Selected'
                          : 'Select This Calculator'}
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

function getCalculatorDescription(calculatorId: string): string {
  switch (calculatorId) {
    case 'single':
      return 'Calculate payments for a single loan with fixed interest rate. Perfect for standard home loans, personal loans, or car loans.';
    case 'split':
      return 'Split your loan into multiple tranches with different interest rates. Ideal for complex financing scenarios or rate hedging strategies.';
    case 'fixed-period':
      return 'Calculate loans with fixed rates for a specific period, then variable rates. Great for understanding rate change impacts over time.';
    case 'fixed-rate':
      return 'Create multiple fixed-rate periods with different interest rates. Perfect for analyzing step-up or step-down rate structures.';
    default:
      return 'Select a calculator to get started with your loan calculations.';
  }
}
