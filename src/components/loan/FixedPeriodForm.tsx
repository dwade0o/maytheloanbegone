import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Percent, Calendar, TrendingUp, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { fixedPeriodLoanSchema, FixedPeriodLoanData } from "@/constants/loanSchema";
import DateRange from "@/components/common/DateRange";
import { FixedPeriodFormProps } from "@/types/common";

export default function FixedPeriodForm({ onSubmit, onReset, isCalculating }: FixedPeriodFormProps) {
  const [showFutureEstimate, setShowFutureEstimate] = useState(false);
  const [futureRate, setFutureRate] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FixedPeriodLoanData>({
    resolver: zodResolver(fixedPeriodLoanSchema),
  });

  const watchedFixedRateStartDate = watch("fixedRateStartDate");
  const watchedFixedRateEndDate = watch("fixedRateEndDate");
  const watchedAnalysisStartDate = watch("analysisStartDate");
  const watchedAnalysisEndDate = watch("analysisEndDate");

  const handleReset = () => {
    reset();
    setShowFutureEstimate(false);
    setFutureRate("");
    onReset();
  };

  const handleFormSubmit = (data: FixedPeriodLoanData) => {
    if (showFutureEstimate && futureRate) {
      onSubmit({ ...data, futureRate });
    } else {
      onSubmit(data);
    }
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
            <Calendar className="h-5 w-5 text-blue-500" />
            Fixed Period Loan
          </CardTitle>
          <CardDescription>
            Calculate payments for a loan with a known fixed rate period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

            {/* Total Loan Term */}
            <div className="space-y-2">
              <Label htmlFor="totalLoanTermYears" className="text-sm font-medium">
                Total Loan Term (Years)
              </Label>
              <Input
                id="totalLoanTermYears"
                type="number"
                step="1"
                placeholder="e.g., 30"
                {...register("totalLoanTermYears")}
                className="text-lg"
              />
              {errors.totalLoanTermYears && (
                <p className="text-sm text-red-500">{errors.totalLoanTermYears.message}</p>
              )}
            </div>

            {/* Current Balance */}
            <div className="space-y-2">
              <Label htmlFor="currentBalance" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Current Remaining Balance ($)
              </Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                placeholder="e.g., 101481.58"
                {...register("currentBalance")}
                className="text-lg"
              />
              {errors.currentBalance && (
                <p className="text-sm text-red-500">{errors.currentBalance.message}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                Fixed Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g., 6.0"
                {...register("interestRate")}
                className="text-lg"
              />
              {errors.interestRate && (
                <p className="text-sm text-red-500">{errors.interestRate.message}</p>
              )}
            </div>

            {/* Loan Start Date */}
            <div className="space-y-2">
              <Label htmlFor="loanStartDate" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Loan Start Date
              </Label>
              <Input
                id="loanStartDate"
                type="date"
                {...register("loanStartDate")}
                className="text-lg"
              />
              {errors.loanStartDate && (
                <p className="text-sm text-red-500">{errors.loanStartDate.message}</p>
              )}
            </div>

            {/* Fixed Rate Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Fixed Rate Period
              </h3>
              <DateRange
                startDate={{
                  value: watchedFixedRateStartDate || "",
                  onChange: (value) => setValue("fixedRateStartDate", value),
                  error: errors.fixedRateStartDate,
                }}
                endDate={{
                  value: watchedFixedRateEndDate || "",
                  onChange: (value) => setValue("fixedRateEndDate", value),
                  error: errors.fixedRateEndDate,
                }}
                startLabel="Fixed Rate Start"
                endLabel="Fixed Rate End"
              />
            </div>

            {/* Analysis Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Analysis Period (Within Fixed Rate Period)
              </h3>
              <DateRange
                startDate={{
                  value: watchedAnalysisStartDate || "",
                  onChange: (value) => setValue("analysisStartDate", value),
                  error: errors.analysisStartDate,
                }}
                endDate={{
                  value: watchedAnalysisEndDate || "",
                  onChange: (value) => setValue("analysisEndDate", value),
                  error: errors.analysisEndDate,
                }}
                startLabel="Analysis Start"
                endLabel="Analysis End"
              />
            </div>

            {/* Future Rate Estimate (Optional) */}
            <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showFutureEstimate"
                  checked={showFutureEstimate}
                  onChange={(e) => setShowFutureEstimate(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="showFutureEstimate" className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Explore future rate scenarios
                </Label>
              </div>
              
              {showFutureEstimate && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="futureRate" className="text-sm font-medium">
                    Estimated Future Rate (%)
                  </Label>
                  <Input
                    id="futureRate"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 4.0"
                    value={futureRate}
                    onChange={(e) => setFutureRate(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This will show estimated payments if the rate changes after your fixed period ends
                  </p>
                </div>
              )}
            </div>

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
