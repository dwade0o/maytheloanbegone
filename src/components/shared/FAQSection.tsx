export default function FAQSection() {
  const faqs = [
    {
      question: 'What types of loans can I calculate?',
      answer:
        'Our loan calculator supports single loans, split loans (multiple tranches), fixed period loans, and fixed rate loans. You can calculate payments for mortgages, personal loans, car loans, and more.',
    },
    {
      question: 'How accurate are the loan calculations?',
      answer:
        'Our calculator uses standard financial formulas for loan calculations, including compound interest and amortization schedules. Results are accurate for most loan types, but always consult with a financial advisor for important decisions.',
    },
    {
      question: 'Can I calculate different payment frequencies?',
      answer:
        'Yes! Our calculator supports weekly, fortnightly, and monthly payment frequencies. You can see how different payment schedules affect your total interest and loan term.',
    },
    {
      question: 'Is the loan calculator free to use?',
      answer:
        'Yes, our loan calculator is completely free to use. No registration required, no hidden fees, and no limits on calculations.',
    },
    {
      question: 'Can I save my loan calculations?',
      answer:
        "Currently, our calculator doesn't save calculations automatically. We recommend taking screenshots or noting down important results for your records.",
    },
    {
      question: 'What information do I need to calculate a loan?',
      answer:
        "You'll need the loan amount, interest rate, loan term, and start date. For split loans, you'll also need details for each tranche including different interest rates and terms.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-slate-200 dark:border-slate-700 pb-6"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
