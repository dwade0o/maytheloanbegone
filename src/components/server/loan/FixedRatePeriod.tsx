import { motion } from 'framer-motion';
import { Trash2, Percent } from 'lucide-react';

import { Button } from '@/components/client/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/client/ui/card';
import { Input } from '@/components/client/ui/input';
import { Label } from '@/components/client/ui/label';

import DateRange from '@/components/server/common/DateRange';
import { FixedRatePeriodProps } from '@/types/common';

export default function FixedRatePeriodComponent({
  period,
  index,
  onUpdate,
  onRemove,
  canRemove,
  isStartDateDisabled = false,
  errors = {},
}: FixedRatePeriodProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: index * 0.1 },
  };

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              Fixed Rate Period {index + 1}
            </CardTitle>
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Label */}
          <div className="space-y-2">
            <Label
              htmlFor={`label-${period.id}`}
              className="text-sm font-medium"
            >
              Label (Optional)
            </Label>
            <Input
              id={`label-${period.id}`}
              type="text"
              placeholder="e.g., Introductory Rate, Standard Rate"
              value={period.label || ''}
              onChange={e => onUpdate('label', e.target.value)}
              className="text-base"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label
              htmlFor={`interestRate-${period.id}`}
              className="text-sm font-medium flex items-center gap-2"
            >
              <Percent className="h-4 w-4 text-green-500" />
              Interest Rate (%)
            </Label>
            <Input
              id={`interestRate-${period.id}`}
              type="number"
              step="0.01"
              placeholder="e.g., 5.5"
              value={period.interestRate}
              onChange={e => onUpdate('interestRate', e.target.value)}
              className="text-base"
            />
            {errors.interestRate && (
              <p className="text-sm text-red-500">
                {errors.interestRate.message}
              </p>
            )}
          </div>

          {/* Date Range */}
          <DateRange
            startDate={{
              value: period.startDate,
              onChange: value => onUpdate('startDate', value),
              error: errors.startDate,
              disabled: isStartDateDisabled,
            }}
            endDate={{
              value: period.endDate,
              onChange: value => onUpdate('endDate', value),
              error: errors.endDate,
            }}
            period={{
              value: period.period || '',
              onChange: value => onUpdate('period', value),
              error: errors.period,
            }}
            periodType={{
              value:
                (period.periodType as 'days' | 'months' | 'years') || 'days',
              onChange: value => onUpdate('periodType', value),
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
