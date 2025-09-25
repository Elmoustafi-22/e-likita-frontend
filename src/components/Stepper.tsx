import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
  isFinished?: boolean;
}

const Stepper = ({ currentStep, steps, isFinished = false }: StepperProps) => {
  return (
    <div className="flex items-start justify-between mb-8 px-2 md:px-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep && !isFinished;
        const isCompleted =
          stepNumber < currentStep || (isFinished && stepNumber <= steps.length);

        return (
          <React.Fragment key={step}>
            {/* Step Item (Circle + Label) */}
            <div className="flex flex-col items-center text-center w-16 md:w-20">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 ${
                  isActive
                    ? "bg-blue-500 border-2 border-blue-700"
                    : isCompleted
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  isActive ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 md:h-1 bg-gray-300 mt-4 mx-1 md:mx-2"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;