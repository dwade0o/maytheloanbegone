import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanResultsBaseProps {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  results: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  className?: string;
}

export default function LoanResultsBase({
  title,
  description,
  icon,
  children,
  results,
  emptyStateTitle = "Ready to Calculate",
  emptyStateDescription = "Fill out the form to see your loan payment details",
  className = "",
}: LoanResultsBaseProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={className}
    >
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {children}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                <Calculator className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                {emptyStateTitle}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {emptyStateDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
