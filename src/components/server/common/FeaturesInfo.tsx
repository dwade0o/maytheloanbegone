import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

const features = [
  {
    title: 'Multiple Calculator Types',
    description:
      'From simple single loans to complex split loans and fixed-rate periods.',
  },
  {
    title: 'Real-time Calculations',
    description:
      'Get instant results with detailed payment schedules and amortization tables.',
  },
  {
    title: 'Mobile Friendly',
    description:
      'Responsive design that works perfectly on all devices and screen sizes.',
  },
];

export default function FeaturesInfo() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Why Choose Our Loan Calculator?
      </h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
