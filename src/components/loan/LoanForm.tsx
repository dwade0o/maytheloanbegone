import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, DollarSign, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formSchema, FormData } from "@/constants/loanSchema";
import DateRange from "@/components/common/DateRange";
import { LoanFormProps } from "@/types/common";

export default function LoanForm({ onSubmit, onReset, isCalculating }: LoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const handleReset = () => {
    reset();
    onReset();
  };

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
            <DollarSign className="h-5 w-5 text-blue-500" />
            Loan Details
          </CardTitle>
          <CardDescription>
            Enter your loan information to calculate payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Loan Amount */}
            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="text-sm font-medium">
                Loan Amount ($)
              </Label>
              <Input
                id="loanAmount"
                type="number"
                step="0.01"
                placeholder="e.g., 250000"
                {...register("loanAmount")}
                className="text-lg"
              />
              {errors.loanAmount && (
                <p className="text-sm text-red-500">{errors.loanAmount.message}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                Annual Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g., 5.5"
                {...register("interestRate")}
                className="text-lg"
              />
              {errors.interestRate && (
                <p className="text-sm text-red-500">{errors.interestRate.message}</p>
              )}
            </div>

            {/* Date Range */}
            <DateRange
              startDate={{
                value: watchedStartDate || "",
                onChange: (value) => setValue("startDate", value),
                error: errors.startDate,
              }}
              endDate={{
                value: watchedEndDate || "",
                onChange: (value) => setValue("endDate", value),
                error: errors.endDate,
              }}
            />

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isCalculating}
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
                {isCalculating ? "Calculating..." : "Calculate"}
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
