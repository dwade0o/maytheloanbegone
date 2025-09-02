import { Split, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { CalculatorType } from '@/types/loan';

export interface CalculatorOption {
  id: CalculatorType;
  title: string;
  description: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const calculatorOptions: CalculatorOption[] = [
  {
    id: 'single',
    title: 'Single Loan',
    description: 'Standard loan with fixed rate',
    iconComponent: CreditCard,
    badge: 'Simple',
    badgeVariant: 'secondary',
  },
  {
    id: 'split',
    title: 'Split Loan',
    description: 'Multiple loan tranches',
    iconComponent: Split,
    badge: 'Advanced',
    badgeVariant: 'secondary',
  },
  {
    id: 'fixed-period',
    title: 'Fixed Period',
    description: 'Fixed rate then variable',
    iconComponent: Calendar,
    badge: 'Realistic',
    badgeVariant: 'outline',
  },
  {
    id: 'fixed-rate',
    title: 'Fixed Rate',
    description: 'Multiple fixed rate periods',
    iconComponent: TrendingUp,
    badge: 'Multi-Rate',
    badgeVariant: 'secondary',
  },
];
