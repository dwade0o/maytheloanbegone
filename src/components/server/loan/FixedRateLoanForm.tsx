import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';

import { Button } from '@/components/client/ui/button';
import { Label } from '@/components/client/ui/label';
import { Badge } from '@/components/client/ui/badge';

import {
  fixedRateLoanFormSchema,
  FixedRateLoanFormData,
  FixedRatePeriod,
} from '@/constants/loanSchema';
import FixedRatePeriodComponent from './FixedRatePeriod';
import LoanFormBase from '@/components/shared/LoanFormBase';
import FormField from '@/components/server/fields/FormField';
import DateRange from '@/components/server/common/DateRange';
import { FixedRateLoanFormProps } from '@/types/common';

export default function FixedRateLoanForm({
  onSubmit,
  onReset,
  isCalculating,
}: FixedRateLoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<FixedRateLoanFormData>({
    resolver: zodResolver(fixedRateLoanFormSchema),
    defaultValues: {
      loanType: 'fixed-rate',
      loanAmount: '',
      loanStartDate: '',
      loanEndDate: '',
      loanPeriod: '',
      loanPeriodType: 'days',
      fixedRatePeriods: [
        {
          id: '1',
          interestRate: '',
          startDate: '',
          endDate: '',
          label: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fixedRatePeriods',
  });

  const watchedLoanStartDate = watch('loanStartDate');
  const watchedLoanEndDate = watch('loanEndDate');
  const watchedLoanAmount = watch('loanAmount');
  const watchedLoanPeriod = watch('loanPeriod');
  const watchedLoanPeriodType = watch('loanPeriodType');
  const watchedPeriods = watch('fixedRatePeriods');

  const addPeriod = () => {
    const newId = (fields.length + 1).toString();
    const lastPeriod = watchedPeriods[watchedPeriods.length - 1];
    const newStartDate = lastPeriod?.endDate || watchedLoanStartDate || '';

    append({
      id: newId,
      interestRate: '',
      startDate: newStartDate,
      endDate: '',
      label: '',
    });
  };

  const removePeriod = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const updatePeriod = (
    index: number,
    field: keyof FixedRatePeriod,
    value: string
  ) => {
    setValue(`fixedRatePeriods.${index}.${field}`, value);

    // If updating end date, update subsequent periods' start dates
    if (field === 'endDate' && value) {
      updateSubsequentPeriods(index, value);
    }
  };

  const updateSubsequentPeriods = (
    updatedIndex: number,
    newEndDate: string
  ) => {
    const periods = watchedPeriods || [];

    // Update start dates for all periods after the updated one
    for (let i = updatedIndex + 1; i < periods.length; i++) {
      setValue(`fixedRatePeriods.${i}.startDate`, newEndDate);

      // If this period has an end date, use it for the next period
      const currentPeriod = periods[i];
      if (currentPeriod?.endDate) {
        newEndDate = currentPeriod.endDate;
      } else {
        // If this period doesn't have an end date, break the chain
        break;
      }
    }
  };

  // Set first period's start date when loan start date changes
  useEffect(() => {
    if (watchedLoanStartDate && watchedPeriods && watchedPeriods.length > 0) {
      const firstPeriod = watchedPeriods[0];
      if (
        !firstPeriod.startDate ||
        firstPeriod.startDate !== watchedLoanStartDate
      ) {
        setValue('fixedRatePeriods.0.startDate', watchedLoanStartDate);
      }
    }
  }, [watchedLoanStartDate, watchedPeriods, setValue]);

  const handleReset = () => {
    reset();
    onReset();
  };

  // Calculate total coverage of periods
  const totalCoverage =
    watchedPeriods?.reduce((total, period) => {
      if (period.startDate && period.endDate) {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        const months =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        return total + Math.max(0, months);
      }
      return total;
    }, 0) || 0;

  const loanDuration =
    watchedLoanStartDate && watchedLoanEndDate
      ? (new Date(watchedLoanEndDate).getTime() -
          new Date(watchedLoanStartDate).getTime()) /
        (1000 * 60 * 60 * 24 * 30.44)
      : 0;

  const coveragePercentage =
    loanDuration > 0 ? (totalCoverage / loanDuration) * 100 : 0;

  // Calculate monthly principal and average interest rate
  const loanAmount = parseFloat(watchedLoanAmount) || 0;
  const monthlyPrincipal = loanDuration > 0 ? loanAmount / loanDuration : 0;

  const averageInterestRate =
    watchedPeriods?.length > 0
      ? watchedPeriods.reduce((total, period) => {
          if (period.interestRate && period.startDate && period.endDate) {
            const start = new Date(period.startDate);
            const end = new Date(period.endDate);
            const periodMonths =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
            const rate = parseFloat(period.interestRate);
            return total + rate * periodMonths;
          }
          return total;
        }, 0) / totalCoverage
      : 0;

  return (
    <LoanFormBase
      title="Fixed Rate Loan Calculator"
      description="Calculate loan payments with different interest rates for different time periods"
      icon={<Calendar className="h-5 w-5 text-green-500" />}
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
      isCalculating={isCalculating}
      submitButtonText="Calculate Fixed Rate Loan"
      canSubmit={totalCoverage > 0}
    >
      {/* Loan Amount */}
      <FormField
        id="loanAmount"
        label="Loan Amount ($)"
        type="number"
        step="0.01"
        placeholder="e.g., 250000"
        register={register}
        error={errors.loanAmount}
      />

      {/* Loan Date Range */}
      <DateRange
        startDate={{
          value: watchedLoanStartDate || '',
          onChange: value => setValue('loanStartDate', value),
          error: errors.loanStartDate,
        }}
        endDate={{
          value: watchedLoanEndDate || '',
          onChange: value => setValue('loanEndDate', value),
          error: errors.loanEndDate,
        }}
        period={{
          value: watchedLoanPeriod || '',
          onChange: value => setValue('loanPeriod', value),
          error: errors.loanPeriod,
        }}
        periodType={{
          value:
            (watchedLoanPeriodType as 'days' | 'months' | 'years') || 'days',
          onChange: value => setValue('loanPeriodType', value),
        }}
      />

      {/* Coverage Summary */}
      {totalCoverage > 0 && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                  Period Coverage
                </div>
                <div className="text-lg font-bold text-green-800 dark:text-green-200">
                  {coveragePercentage.toFixed(1)}% of loan term
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {totalCoverage.toFixed(1)} months covered
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              >
                {coveragePercentage >= 100 ? 'Complete' : 'Partial'}
              </Badge>
            </div>

            {/* Monthly Principal and Interest Rate */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-200 dark:border-green-700">
              <div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Monthly Principal
                </div>
                <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  ${monthlyPrincipal.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Avg Interest Rate
                </div>
                <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                  {averageInterestRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Rate Periods */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Fixed Rate Periods</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPeriod}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Period
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <FixedRatePeriodComponent
              key={field.id}
              period={watchedPeriods[index]}
              index={index}
              onUpdate={(fieldName, value) =>
                updatePeriod(index, fieldName, value)
              }
              onRemove={() => removePeriod(index)}
              canRemove={fields.length > 1}
              isStartDateDisabled={true}
              errors={errors.fixedRatePeriods?.[index]}
            />
          ))}
        </div>

        {errors.fixedRatePeriods && (
          <p className="text-sm text-red-500">
            {errors.fixedRatePeriods.message}
          </p>
        )}
      </div>
    </LoanFormBase>
  );
}
