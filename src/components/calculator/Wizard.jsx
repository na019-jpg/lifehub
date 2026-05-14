import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Wizard({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (stepData) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onComplete) onComplete(newData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold text-slate-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8 md:p-12 min-h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {steps[currentStep].title}
            </h2>
            {steps[currentStep].description && (
              <p className="text-slate-500 mb-8 font-medium">
                {steps[currentStep].description}
              </p>
            )}

            <div className="flex-grow flex flex-col">
              <StepComponent 
                data={formData} 
                onNext={handleNext} 
                onPrev={handlePrev}
                isLast={currentStep === steps.length - 1}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
