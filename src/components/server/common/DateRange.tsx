import { DateRangeProps } from '@/types/common';
import { useDateRange } from '@/hooks/useDateRange';
import { DateField, PeriodField } from '@/components/server/fields';

export default function DateRange({
  startDate,
  endDate,
  period,
  periodType,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  periodLabel = 'Period',
  className = '',
  onValidationTrigger,
}: DateRangeProps & { onValidationTrigger?: () => void }) {
  // Use custom hook for all DateRange logic
  const {
    dateErrors,
    handleStartDateChange,
    handleEndDateChange,
    handlePeriodChange,
    handlePeriodTypeChange,
  } = useDateRange({
    startDate,
    endDate,
    period,
    periodType,
    onValidationTrigger,
  });

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Start Date */}
      <DateField
        id="startDate"
        label={startLabel}
        value={startDate.value}
        onChange={handleStartDateChange}
        error={startDate.error?.message || dateErrors.startDate}
        showIcon={true}
        max={endDate.value}
        disabled={startDate.disabled}
      />

      {/* End Date */}
      <DateField
        id="endDate"
        label={endLabel}
        value={endDate.value}
        onChange={handleEndDateChange}
        error={endDate.error?.message || dateErrors.endDate}
        min={startDate.value}
        disabled={endDate.disabled}
      />

      {/* Period */}
      {period && (
        <PeriodField
          id="period"
          label={periodLabel}
          value={period.value}
          onChange={handlePeriodChange}
          error={period.error?.message}
          periodType={
            periodType
              ? {
                  value: periodType.value,
                  onChange: handlePeriodTypeChange,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
