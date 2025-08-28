import { motion } from "framer-motion";
import { Trash2, DollarSign, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LoanTranche } from "@/constants/loanSchema";
import DateRange from "@/components/common/DateRange";

interface LoanTrancheProps {
  tranche: LoanTranche;
  index: number;
  onUpdate: (field: keyof LoanTranche, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: {
    amount?: string;
    interestRate?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function LoanTrancheComponent({
  tranche,
  index,
  onUpdate,
  onRemove,
  canRemove,
  errors = {},
}: LoanTrancheProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: index * 0.1 }
  };

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              Loan Tranche {index + 1}
            </CardTitle>
            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor={`label-${tranche.id}`} className="text-sm font-medium">
              Label (Optional)
            </Label>
            <Input
              id={`label-${tranche.id}`}
              type="text"
              placeholder="e.g., Home Loan, Car Loan"
              value={tranche.label || ""}
              onChange={(e) => onUpdate("label", e.target.value)}
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor={`amount-${tranche.id}`} className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Amount ($)
              </Label>
              <Input
                id={`amount-${tranche.id}`}
                type="number"
                step="0.01"
                placeholder="e.g., 40000"
                value={tranche.amount}
                onChange={(e) => onUpdate("amount", e.target.value)}
                className="text-base"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label htmlFor={`interestRate-${tranche.id}`} className="text-sm font-medium flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                Interest Rate (%)
              </Label>
              <Input
                id={`interestRate-${tranche.id}`}
                type="number"
                step="0.01"
                placeholder="e.g., 5.5"
                value={tranche.interestRate}
                onChange={(e) => onUpdate("interestRate", e.target.value)}
                className="text-base"
              />
              {errors.interestRate && (
                <p className="text-sm text-red-500">{errors.interestRate}</p>
              )}
            </div>
          </div>

          {/* Date Range */}
          <DateRange
            startDate={{
              value: tranche.startDate,
              onChange: (value) => onUpdate("startDate", value),
              error: errors.startDate,
            }}
            endDate={{
              value: tranche.endDate,
              onChange: (value) => onUpdate("endDate", value),
              error: errors.endDate,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
