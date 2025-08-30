import { Badge } from '@/components/ui/badge';

interface ResultRowProps {
  label: string;
  value: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  valueColor?: string;
  className?: string;
}

export default function ResultRow({
  label,
  value,
  badge,
  valueColor,
  className = '',
}: ResultRowProps) {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 ${className}`}
    >
      <div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {label}
        </div>
        <div className={`text-xl font-semibold ${valueColor || ''}`}>
          {value}
        </div>
      </div>
      {badge && (
        <Badge
          variant={badge.variant || 'secondary'}
          className={badge.className}
        >
          {badge.text}
        </Badge>
      )}
    </div>
  );
}
