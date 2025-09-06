import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { CalculatorOption } from '@/constants/calculatorConfig';

interface CalculatorTabsProps {
  options: CalculatorOption[];
  selectedCalculator: string;
  onCalculatorChange: (calculatorId: string) => void;
  className?: string;
}

export default function CalculatorTabs({
  options,
  selectedCalculator,
  onCalculatorChange,
  className = '',
}: CalculatorTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [focusedTab, setFocusedTab] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex(
      option => option.id === selectedCalculator
    );

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        onCalculatorChange(options[prevIndex].id);
        setFocusedTab(options[prevIndex].id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex =
          currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        onCalculatorChange(options[nextIndex].id);
        setFocusedTab(options[nextIndex].id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onCalculatorChange(selectedCalculator);
        break;
    }
  };

  const getTabClasses = (
    option: CalculatorOption,
    isActive: boolean,
    isHovered: boolean,
    isFocused: boolean
  ) => {
    return `
      flex-1 px-3 py-3 text-center font-medium text-sm
      transition-all duration-200 relative
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
      ${
        isActive
          ? 'text-blue-600 bg-blue-50'
          : isHovered
            ? 'text-gray-700 bg-gray-50'
            : isFocused
              ? 'text-gray-600 bg-gray-100'
              : 'text-gray-500 hover:text-gray-700'
      }
    `;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Container */}
      <div
        className="flex border-b border-gray-200 bg-white rounded-t-lg"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="tablist"
        aria-label="Calculator selection"
      >
        {options.map(option => {
          const isActive = selectedCalculator === option.id;
          const isHovered = hoveredTab === option.id;
          const isFocused = focusedTab === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onCalculatorChange(option.id)}
              onMouseEnter={() => setHoveredTab(option.id)}
              onMouseLeave={() => setHoveredTab(null)}
              onFocus={() => setFocusedTab(option.id)}
              onBlur={() => setFocusedTab(null)}
              className={getTabClasses(option, isActive, isHovered, isFocused)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`calculator-${option.id}`}
              id={`tab-${option.id}`}
            >
              <div className="flex flex-col items-center gap-1">
                <option.iconComponent className="h-4 w-4" />
                <span className="text-xs font-medium">{option.title}</span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}

        {/* Future: Three dots overflow menu for additional calculators */}
        {/* This is structured to easily add later when needed */}
        {/* 
        {options.length > 4 && (
          <button
            className="px-3 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        )}
        */}
      </div>
    </div>
  );
}
