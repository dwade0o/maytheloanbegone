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
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedPeriod = watch('period');
  const watchedPeriodType = watch('periodType');

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
        error={errors.loanAmount}
      />

      <FormField
        id="interestRate"
        label="Annual Interest Rate (%)"
        type="number"
        step="0.01"
        placeholder="e.g., 5.5"
        icon={<Percent className="h-4 w-4 text-blue-500" />}
        register={register}
        error={errors.interestRate}
      />

      <DateRange
        startDate={{
          value: watchedStartDate || '',
          onChange: value => setValue('startDate', value),
          error: errors.startDate,
        }}
        endDate={{
          value: watchedEndDate || '',
          onChange: value => setValue('endDate', value),
          error: errors.endDate,
        }}
        period={{
          value: watchedPeriod || '',
          onChange: value => setValue('period', value),
          error: errors.period,
        }}
        periodType={{
          value: (watchedPeriodType as 'days' | 'months' | 'years') || 'days',
          onChange: value => setValue('periodType', value),
        }}
      />
    </LoanFormBase>
  );
}
