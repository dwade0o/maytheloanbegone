interface FeaturedResultProps {
  label: string;
  value: string;
  subtitle?: string;
  gradient?: string;
  className?: string;
}

export default function FeaturedResult({
  label,
  value,
  subtitle,
  gradient = "from-blue-500 to-indigo-500",
  className = "",
}: FeaturedResultProps) {
  return (
    <div className={`p-6 rounded-lg bg-gradient-to-r ${gradient} text-white ${className}`}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && (
        <div className="text-sm opacity-75 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
