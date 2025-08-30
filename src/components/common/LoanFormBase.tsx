import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoanFormBaseProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  onSubmit: () => void;
  onReset: () => void;
  isCalculating?: boolean;
  submitButtonText?: string;
  canSubmit?: boolean;
  className?: string;
}

export default function LoanFormBase({
  title,
  description,
  icon,
  children,
  onSubmit,
  onReset,
  isCalculating = false,
  submitButtonText = 'Calculate',
  canSubmit = true,
  className = '',
}: LoanFormBaseProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={className}
    >
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {children}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isCalculating || !canSubmit}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="mr-2"
                  >
                    <Calculator className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                {isCalculating ? 'Calculating...' : submitButtonText}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="px-6"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
