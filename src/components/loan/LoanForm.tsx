import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Percent } from 'lucide-react';

import { formSchema, FormData } from '@/constants/loanSchema';
import LoanFormBase from '@/components/common/LoanFormBase';
import FormField from '@/components/fields/FormField';
import DateRange from '@/components/common/DateRange';
import { LoanFormProps } from '@/types/common';

export default function LoanForm({
  onSubmit,
  onReset,
  isCalculating,
}: LoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedPeriod = watch('period');
  const watchedPeriodType = watch('periodType');

  // Function to trigger validation
  const handleValidationTrigger = () => {
    // Trigger validation for all fields to ensure consistency
    trigger();
  };

  // Custom onChange handlers that mark fields as touched
  const handleStartDateChange = (value: string) => {
    setValue('startDate', value, { shouldTouch: true, shouldValidate: true });
  };

  const handleEndDateChange = (value: string) => {
    setValue('endDate', value, { shouldTouch: true, shouldValidate: true });
  };

  const handlePeriodChange = (value: string) => {
    setValue('period', value, { shouldTouch: true, shouldValidate: true });
  };

  const handlePeriodTypeChange = (value: 'days' | 'months' | 'years') => {
    setValue('periodType', value, { shouldTouch: true, shouldValidate: true });
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <LoanFormBase
      title="Loan Details"
      description="Enter your loan information to calculate payments"
      icon={<DollarSign className="h-5 w-5 text-blue-500" />}
      onSubmit={handleSubmit(onSubmit)}
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
        error={touchedFields.loanAmount ? errors.loanAmount : undefined}
      />

      <FormField
        id="interestRate"
        label="Annual Interest Rate (%)"
        type="number"
        step="0.01"
        placeholder="e.g., 5.5"
        icon={<Percent className="h-4 w-4 text-blue-500" />}
        register={register}
        error={touchedFields.interestRate ? errors.interestRate : undefined}
      />

      <DateRange
        startDate={{
          value: watchedStartDate || '',
          onChange: handleStartDateChange,
          error: touchedFields.startDate ? errors.startDate : undefined,
        }}
        endDate={{
          value: watchedEndDate || '',
          onChange: handleEndDateChange,
          error: touchedFields.endDate ? errors.endDate : undefined,
        }}
        period={{
          value: watchedPeriod || '',
          onChange: handlePeriodChange,
          error: touchedFields.period ? errors.period : undefined,
        }}
        periodType={{
          value: (watchedPeriodType as 'days' | 'months' | 'years') || 'days',
          onChange: handlePeriodTypeChange,
        }}
        onValidationTrigger={handleValidationTrigger}
      />
    </LoanFormBase>
  );
}
