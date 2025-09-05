import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Percent, Calendar, TrendingUp, DollarSign } from 'lucide-react';

import { Input } from '@/components/client/ui/input';
import { Label } from '@/components/client/ui/label';

import {
  fixedPeriodLoanSchema,
  FixedPeriodLoanData,
} from '@/constants/loanSchema';
import LoanFormBase from '@/components/shared/LoanFormBase';
import FormField from '@/components/server/fields/FormField';
import DateRange from '@/components/server/common/DateRange';
import { FixedPeriodFormProps } from '@/types/common';

export default function FixedPeriodForm({
  onSubmit,
  onReset,
  isCalculating,
}: FixedPeriodFormProps) {
  const [showFutureEstimate, setShowFutureEstimate] = useState(false);
  const [futureRate, setFutureRate] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FixedPeriodLoanData>({
    resolver: zodResolver(fixedPeriodLoanSchema),
  });

  const watchedFixedRateStartDate = watch('fixedRateStartDate');
  const watchedFixedRateEndDate = watch('fixedRateEndDate');
  const watchedFixedRatePeriod = watch('fixedRatePeriod');
  const watchedFixedRatePeriodType = watch('fixedRatePeriodType');
  const watchedAnalysisStartDate = watch('analysisStartDate');
  const watchedAnalysisEndDate = watch('analysisEndDate');
  const watchedAnalysisPeriod = watch('analysisPeriod');
  const watchedAnalysisPeriodType = watch('analysisPeriodType');

  // Auto-sync analysis end date with fixed rate end date
  useEffect(() => {
    if (
      watchedFixedRateEndDate &&
      watchedFixedRateEndDate !== watchedAnalysisEndDate
    ) {
      setValue('analysisEndDate', watchedFixedRateEndDate);
    }
  }, [watchedFixedRateEndDate, watchedAnalysisEndDate, setValue]);

  // Auto-calculate analysis period when start or end dates change
  useEffect(() => {
    if (watchedAnalysisStartDate && watchedAnalysisEndDate) {
      // Calculate the period between start and end dates
      const start = new Date(watchedAnalysisStartDate + 'T00:00:00.000Z');
      const end = new Date(watchedAnalysisEndDate + 'T00:00:00.000Z');

      // Calculate years, months, and days
      const yearsDiff = end.getUTCFullYear() - start.getUTCFullYear();
      const monthsDiff = end.getUTCMonth() - start.getUTCMonth();
      const daysDiff = end.getUTCDate() - start.getUTCDate();

      let totalMonths = yearsDiff * 12 + monthsDiff;
      if (daysDiff > 0) {
        const daysInStartMonth = new Date(
          start.getUTCFullYear(),
          start.getUTCMonth() + 1,
          0
        ).getUTCDate();
        totalMonths += daysDiff / daysInStartMonth;
      } else if (daysDiff < 0) {
        const daysInEndMonth = new Date(
          end.getUTCFullYear(),
          end.getUTCMonth() + 1,
          0
        ).getUTCDate();
        totalMonths += daysDiff / daysInEndMonth;
      }

      // Round to 1 decimal place
      totalMonths = Math.round(totalMonths * 10) / 10;

      // Determine the best unit and value to display
      if (totalMonths >= 12) {
        const years = Math.round((totalMonths / 12) * 10) / 10;
        setValue('analysisPeriod', years.toString());
        setValue('analysisPeriodType', 'years');
      } else if (totalMonths >= 1) {
        setValue('analysisPeriod', totalMonths.toString());
        setValue('analysisPeriodType', 'months');
      } else {
        // Less than 1 month, show in days
        const totalDays = Math.ceil(totalMonths * 30.44); // Approximate days per month
        setValue('analysisPeriod', totalDays.toString());
        setValue('analysisPeriodType', 'days');
      }
    }
  }, [watchedAnalysisStartDate, watchedAnalysisEndDate, setValue]);

  const handleReset = () => {
    reset();
    setShowFutureEstimate(false);
    setFutureRate('');
    onReset();
  };

  const handleFormSubmit = (data: FixedPeriodLoanData) => {
    if (showFutureEstimate && futureRate) {
      onSubmit({ ...data, futureRate });
    } else {
      onSubmit(data);
    }
  };

  return (
    <LoanFormBase
      title="Fixed Period Loan"
      description="Calculate payments for a loan with a known fixed rate period"
      icon={<Calendar className="h-5 w-5 text-blue-500" />}
      onSubmit={handleSubmit(handleFormSubmit)}
      onReset={handleReset}
      isCalculating={isCalculating}
    >
      <FormField
        id="loanAmount"
        label="Loan Amount ($)"
        type="number"
        step="0.01"
        placeholder="e.g., 250000"
        register={register}
        error={errors.loanAmount}
      />

      <FormField
        id="totalLoanTermYears"
        label="Total Loan Term (Years)"
        type="number"
        step="1"
        placeholder="e.g., 30"
        register={register}
        error={errors.totalLoanTermYears}
      />

      <FormField
        id="currentBalance"
        label="Current Remaining Balance ($)"
        type="number"
        step="0.01"
        placeholder="e.g., 10000"
        icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        register={register}
        error={errors.currentBalance}
      />

      <FormField
        id="interestRate"
        label="Current Fixed Interest Rate (%)"
        type="number"
        step="0.01"
        placeholder="e.g., 6.0"
        icon={<Percent className="h-4 w-4 text-blue-500" />}
        register={register}
        error={errors.interestRate}
      />

      <FormField
        id="loanStartDate"
        label="Loan Start Date"
        type="date"
        icon={<Calendar className="h-4 w-4 text-blue-500" />}
        register={register}
        error={errors.loanStartDate}
      />

      {/* Fixed Rate Period */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Fixed Rate Period
        </h3>
        <DateRange
          startDate={{
            value: watchedFixedRateStartDate || '',
            onChange: value => setValue('fixedRateStartDate', value),
            error: errors.fixedRateStartDate,
          }}
          endDate={{
            value: watchedFixedRateEndDate || '',
            onChange: value => setValue('fixedRateEndDate', value),
            error: errors.fixedRateEndDate,
          }}
          period={{
            value: watchedFixedRatePeriod || '',
            onChange: value => setValue('fixedRatePeriod', value),
            error: errors.fixedRatePeriod,
          }}
          periodType={{
            value:
              (watchedFixedRatePeriodType as 'days' | 'months' | 'years') ||
              'days',
            onChange: value => setValue('fixedRatePeriodType', value),
          }}
          startLabel="Fixed Rate Start"
          endLabel="Fixed Rate End"
          periodLabel="Fixed Rate Period"
        />
      </div>

      {/* Analysis Period */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            Analysis Period (Within Fixed Rate Period)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The end date is automatically set to match your Fixed Rate Period
            end date
          </p>
        </div>
        <DateRange
          startDate={{
            value: watchedAnalysisStartDate || '',
            onChange: value => setValue('analysisStartDate', value),
            error: errors.analysisStartDate,
          }}
          endDate={{
            value: watchedAnalysisEndDate || '',
            onChange: value => setValue('analysisEndDate', value),
            error: errors.analysisEndDate,
            disabled: true, // Auto-synced with Fixed Rate Period end date
          }}
          period={{
            value: watchedAnalysisPeriod || '',
            onChange: value => setValue('analysisPeriod', value),
            error: errors.analysisPeriod,
          }}
          periodType={{
            value:
              (watchedAnalysisPeriodType as 'days' | 'months' | 'years') ||
              'days',
            onChange: value => setValue('analysisPeriodType', value),
          }}
          startLabel="Analysis Start"
          endLabel="Analysis End"
          periodLabel="Analysis Period"
        />
      </div>

      {/* Future Rate Estimate (Optional) */}
      <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showFutureEstimate"
            data-testid="showFutureEstimate"
            checked={showFutureEstimate}
            onChange={e => setShowFutureEstimate(e.target.checked)}
            className="rounded"
          />
          <Label
            htmlFor="showFutureEstimate"
            className="text-sm font-medium flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Explore future rate scenarios
          </Label>
        </div>

        {showFutureEstimate && (
          <div className="space-y-2 ml-6">
            <Label htmlFor="futureRate" className="text-sm font-medium">
              Estimated Future Rate (%)
            </Label>
            <Input
              id="futureRate"
              data-testid="futureRate"
              type="number"
              step="0.01"
              placeholder="e.g., 4.0"
              value={futureRate}
              onChange={e => setFutureRate(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will show estimated payments if the rate changes after your
              fixed period ends
            </p>
          </div>
        )}
      </div>
    </LoanFormBase>
  );
}
