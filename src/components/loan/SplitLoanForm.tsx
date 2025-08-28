import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Plus, DollarSign, Split } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { splitLoanFormSchema, SplitLoanFormData, LoanTranche } from "@/constants/loanSchema";
import LoanTrancheComponent from "./LoanTranche";

interface SplitLoanFormProps {
  onSubmit: (data: SplitLoanFormData) => void;
  onReset: () => void;
  isCalculating: boolean;
}

export default function SplitLoanForm({ onSubmit, onReset, isCalculating }: SplitLoanFormProps) {
  const [loanType, setLoanType] = useState<"single" | "split">("split");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<SplitLoanFormData>({
    resolver: zodResolver(splitLoanFormSchema),
    defaultValues: {
      loanType: "split",
      totalAmount: "",
      tranches: [
        {
          id: "1",
          amount: "",
          interestRate: "",
          startDate: "",
          endDate: "",
          label: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tranches",
  });

  const watchedTranches = watch("tranches");
  const watchedTotalAmount = watch("totalAmount");

  const addTranche = () => {
    const newId = (fields.length + 1).toString();
    append({
      id: newId,
      amount: "",
      interestRate: "",
      startDate: "",
      endDate: "",
      label: "",
    });
  };

  const removeTranche = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const updateTranche = (index: number, field: keyof LoanTranche, value: string) => {
    setValue(`tranches.${index}.${field}`, value);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  // Calculate current total of tranches
  const currentTotal = watchedTranches?.reduce((sum, tranche) => {
    const amount = parseFloat(tranche.amount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0) || 0;

  const targetTotal = parseFloat(watchedTotalAmount || "0");
  const isBalanced = Math.abs(currentTotal - targetTotal) < 0.01;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Split className="h-5 w-5 text-blue-500" />
            Split Loan Calculator
          </CardTitle>
          <CardDescription>
            Break down your loan into multiple tranches with different rates and terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Total Amount */}
            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Total Loan Amount ($)
              </Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                placeholder="e.g., 100000"
                {...register("totalAmount")}
                className="text-lg"
              />
              {errors.totalAmount && (
                <p className="text-sm text-red-500">{errors.totalAmount.message}</p>
              )}
            </div>

            {/* Balance Summary */}
            {watchedTotalAmount && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="space-y-1">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Balance Check</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Target: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(targetTotal)}</span>
                    <span>Current: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentTotal)}</span>
                    <span>Remaining: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(targetTotal - currentTotal)}</span>
                  </div>
                </div>
                <Badge variant={isBalanced ? "default" : "destructive"}>
                  {isBalanced ? "Balanced" : "Unbalanced"}
                </Badge>
              </div>
            )}

            {/* Loan Tranches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Loan Tranches</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTranche}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Tranche
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <LoanTrancheComponent
                    key={field.id}
                    tranche={watchedTranches[index]}
                    index={index}
                    onUpdate={(fieldName, value) => updateTranche(index, fieldName, value)}
                    onRemove={() => removeTranche(index)}
                    canRemove={fields.length > 1}
                    errors={errors.tranches?.[index]}
                  />
                ))}
              </div>

              {errors.tranches && (
                <p className="text-sm text-red-500">{errors.tranches.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isCalculating || !isBalanced}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Calculator className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                {isCalculating ? "Calculating..." : "Calculate Split Loan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="px-6"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
