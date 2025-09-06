import LoanCalculatorWrapper from '@/components/client/calculators/SplitLoanCalculatorWrapper';
import StructuredData from '@/components/shared/StructuredData';

export const metadata = {
  title: 'Free Loan Calculator - Calculate Payments & Interest',
  description:
    'Calculate loan payments, interest, and amortization with our free online loan calculator. Multiple loan types supported including single loans, split loans, fixed period, and fixed rate loans.',
};

export default function Home() {
  return (
    <>
      <StructuredData calculatorType="single" />
      <LoanCalculatorWrapper />
    </>
  );
}
