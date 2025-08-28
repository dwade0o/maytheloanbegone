"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

import { FormData } from "@/constants/loanSchema";
import { calculateLoan, LoanResults } from "@/lib/helper/loanCalculations";
import { LoanForm, LoanResults as LoanResultsComponent } from "@/components/loan";

export default function LoanCalculator() {
  const [results, setResults] = useState<LoanResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateLoan = async (data: FormData) => {
    setIsCalculating(true);
    
    try {
      const calculationResults = await calculateLoan(data);
      setResults(calculationResults);
    } catch (error) {
      console.error('Error calculating loan:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Loan Calculator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Calculate your monthly payments, total interest, and loan details with our easy-to-use calculator
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <LoanForm
            onSubmit={handleCalculateLoan}
            onReset={handleReset}
            isCalculating={isCalculating}
          />

          {/* Results */}
          <LoanResultsComponent results={results} />
        </div>
      </div>
    </div>
  );
}