import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeProps {
  startDate: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
  };
  endDate: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
  };
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

export default function DateRange({
  startDate,
  endDate,
  startLabel = "Start Date",
  endLabel = "End Date",
  className = "",
}: DateRangeProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          {startLabel}
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate.value}
          onChange={(e) => startDate.onChange(e.target.value)}
          className="text-lg"
        />
        {startDate.error && (
          <p className="text-sm text-red-500">{startDate.error}</p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="endDate" className="text-sm font-medium">
          {endLabel}
        </Label>
        <Input
          id="endDate"
          type="date"
          value={endDate.value}
          onChange={(e) => endDate.onChange(e.target.value)}
          className="text-lg"
        />
        {endDate.error && (
          <p className="text-sm text-red-500">{endDate.error}</p>
        )}
      </div>
    </div>
  );
}
