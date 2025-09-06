import { CalculatorType } from '@/types/loan';

interface StructuredDataProps {
  calculatorType: CalculatorType;
}

export default function StructuredData({
  calculatorType,
}: StructuredDataProps) {
  const getCalculatorName = (type: CalculatorType) => {
    switch (type) {
      case 'single':
        return 'Single Loan Calculator';
      case 'split':
        return 'Split Loan Calculator';
      case 'fixed-period':
        return 'Fixed Period Loan Calculator';
      case 'fixed-rate':
        return 'Fixed Rate Loan Calculator';
      default:
        return 'Loan Calculator';
    }
  };

  const getCalculatorDescription = (type: CalculatorType) => {
    switch (type) {
      case 'single':
        return 'Calculate payments, interest, and amortization for a single loan with our free online calculator.';
      case 'split':
        return 'Calculate payments for loans split into multiple tranches with different interest rates and terms.';
      case 'fixed-period':
        return 'Calculate loan payments for a fixed period with our specialized calculator.';
      case 'fixed-rate':
        return 'Calculate fixed rate loan payments and see how interest rates affect your payments.';
      default:
        return 'Free online loan calculator to calculate payments, interest, and amortization.';
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'May the loan be gone',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    description:
      'Free online loan calculator to calculate payments, interest, and amortization for various loan types.',
    url: 'https://maytheloanbegone.vercel.app',
    author: {
      '@type': 'Organization',
      name: 'May the loan be gone',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free loan calculator service',
    },
    featureList: [
      'Single Loan Calculator',
      'Split Loan Calculator',
      'Fixed Period Calculator',
      'Fixed Rate Calculator',
      'Amortization Schedule',
      'Interest Calculations',
      'Payment Frequency Options',
      'Mobile Responsive Design',
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    screenshot: 'https://maytheloanbegone.vercel.app/og-image.png',
    softwareVersion: '1.0.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://maytheloanbegone.vercel.app',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      object: {
        '@type': 'WebPage',
        name: getCalculatorName(calculatorType),
        description: getCalculatorDescription(calculatorType),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
