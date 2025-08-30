import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Split } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  splitLoanFormSchema,
  SplitLoanFormData,
  LoanTranche,
} from '@/constants/loanSchema';
import LoanTrancheComponent from './LoanTranche';
import LoanFormBase from '@/components/common/LoanFormBase';
import { SplitLoanFormProps } from '@/types/common';

export default function SplitLoanForm({
  onSubmit,
  onReset,
  isCalculating,
}: SplitLoanFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<SplitLoanFormData>({
    resolver: zodResolver(splitLoanFormSchema),
    defaultValues: {
      loanType: 'split',
      tranches: [
        {
          id: '1',
          amount: '',
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
    name: 'tranches',
  });

  const watchedTranches = watch('tranches');

  const addTranche = () => {
    const newId = (fields.length + 1).toString();
    append({
      id: newId,
      amount: '',
      interestRate: '',
      startDate: '',
      endDate: '',
      label: '',
    });
  };

  const removeTranche = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const updateTranche = (
    index: number,
    field: keyof LoanTranche,
    value: string
  ) => {
    setValue(`tranches.${index}.${field}`, value);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  // Calculate current total of tranches
  const currentTotal =
    watchedTranches?.reduce((sum, tranche) => {
      const amount = parseFloat(tranche.amount || '0');
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;

  return (
    <LoanFormBase
      title="Split Loan Calculator"
      description="Break down your loan into multiple tranches with different rates and terms"
      icon={<Split className="h-5 w-5 text-blue-500" />}
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
      isCalculating={isCalculating}
      submitButtonText="Calculate Split Loan"
      canSubmit={currentTotal > 0}
    >
      {/* Auto-calculated Total Amount */}
      {currentTotal > 0 && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Loan Amount
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(currentTotal)}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            >
              Auto-calculated
            </Badge>
          </div>
        </div>
      )}

      {/* Loan Tranches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Loan Tranches</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTranche}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Tranche
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <LoanTrancheComponent
              key={field.id}
              tranche={watchedTranches[index]}
              index={index}
              onUpdate={(fieldName, value) =>
                updateTranche(index, fieldName, value)
              }
              onRemove={() => removeTranche(index)}
              canRemove={fields.length > 1}
              errors={errors.tranches?.[index]}
            />
          ))}
        </div>

        {errors.tranches && (
          <p className="text-sm text-red-500">{errors.tranches.message}</p>
        )}
      </div>
    </LoanFormBase>
  );
}
