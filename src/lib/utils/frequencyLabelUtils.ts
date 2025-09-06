import { PaymentFrequency } from '@/components/shared/PaymentFrequencySelector';

/**
 * Gets the payment label for the specified frequency
 */
export function getPaymentLabel(frequency: PaymentFrequency): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly Payment';
    case 'fortnightly':
      return 'Fortnightly Payment';
    default:
      return 'Monthly Payment';
  }
}

/**
 * Gets the principal reduction label for the specified frequency
 */
export function getPrincipalReductionLabel(
  frequency: PaymentFrequency
): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly Principal Reduction';
    case 'fortnightly':
      return 'Fortnightly Principal Reduction';
    default:
      return 'Monthly Principal Reduction';
  }
}

/**
 * Gets the interest label for the specified frequency
 */
export function getInterestLabel(frequency: PaymentFrequency): string {
  const periodLabel = getPeriodLabel(frequency);
  const timePeriodLabel = getTimePeriodLabel(frequency);
  return `${periodLabel} Interest (First ${timePeriodLabel.charAt(0).toUpperCase() + timePeriodLabel.slice(1)})`;
}

/**
 * Gets the total payment label for the specified frequency
 */
export function getTotalPaymentLabel(frequency: PaymentFrequency): string {
  const periodLabel = getPeriodLabel(frequency);
  const timePeriodLabel = getTimePeriodLabel(frequency);
  return `Total ${periodLabel} Payment (First ${timePeriodLabel.charAt(0).toUpperCase() + timePeriodLabel.slice(1)})`;
}

/**
 * Gets the period label (Week/Fortnight/Month) for the specified frequency
 */
export function getPeriodLabel(frequency: PaymentFrequency): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'fortnightly':
      return 'Fortnightly';
    default:
      return 'Monthly';
  }
}

/**
 * Gets the time period label (week/fortnight/month) for the specified frequency
 */
export function getTimePeriodLabel(frequency: PaymentFrequency): string {
  switch (frequency) {
    case 'weekly':
      return 'week';
    case 'fortnightly':
      return 'fortnight';
    default:
      return 'month';
  }
}

/**
 * Gets the subtitle text for principal reduction
 */
export function getPrincipalReductionSubtitle(
  frequency: PaymentFrequency,
  months: number
): string {
  const timePeriod = getTimePeriodLabel(frequency);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `Fixed amount every ${timePeriod} for ${years} years and ${remainingMonths} months`;
}

/**
 * Gets the subtitle text for interest
 */
export function getInterestSubtitle(frequency: PaymentFrequency): string {
  const timePeriod = getTimePeriodLabel(frequency);
  return `Decreases each ${timePeriod} as balance reduces`;
}
