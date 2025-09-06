// Shared components that can be used by both server and client components
export { default as CalculatorAccordion } from './CalculatorAccordion';
export { default as CalculatorTabs } from './CalculatorTabs';
export { default as ClientOnly } from './ClientOnly';
export { default as FeaturedResult } from './FeaturedResult';
export { default as LoanFormBase } from './LoanFormBase';
export { default as LoanResultsBase } from './LoanResultsBase';
export { default as PaymentFrequencySelector } from './PaymentFrequencySelector';
export { default as ResultRow } from './ResultRow';

// Ad components
export {
  default as AdPlaceholder,
  MobileBannerAd,
  MobileLeaderboardAd,
  TabletBannerAd,
  DesktopBannerAd,
  ResponsiveBannerAd,
  RectangleAd,
  SidebarAd,
  SquareAd,
} from './AdPlaceholder';

// Production AdSense components
export {
  default as AdSenseAd,
  AdSenseBannerAd,
  AdSenseRectangleAd,
  AdSenseMobileBannerAd,
  ResponsiveAdSenseAd,
} from './AdSenseAd';
