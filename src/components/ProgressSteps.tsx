
import React from 'react';
import { MapPin, Trash2, Calendar, CreditCard, CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

interface ProgressStepsProps {
  currentStep: string;
  completedSteps: string[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  completedSteps 
}) => {
  const steps: Step[] = [
    {
      id: 'postcode',
      title: 'Postcode',
      icon: <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />,
      completed: completedSteps.includes('postcode'),
      current: currentStep === 'postcode'
    },
    {
      id: 'waste-type',
      title: 'Waste Type',
      icon: <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />,
      completed: completedSteps.includes('waste-type'),
      current: currentStep === 'waste-type'
    },
    {
      id: 'select-skip',
      title: 'Select Skip',
      icon: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
      completed: completedSteps.includes('select-skip'),
      current: currentStep === 'select-skip'
    },
    {
      id: 'choose-date',
      title: 'Choose Date',
      icon: <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />,
      completed: completedSteps.includes('choose-date'),
      current: currentStep === 'choose-date'
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />,
      completed: completedSteps.includes('payment'),
      current: currentStep === 'payment'
    }
  ];

  return (
    <div className="w-full bg-card border-b">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-colors duration-200 ${
                    step.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.current
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    step.completed || step.current
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">
                    {step.title.split(' ')[0]}
                  </span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-4 min-w-[10px] transition-colors duration-200 ${
                    step.completed ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
