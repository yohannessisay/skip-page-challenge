import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { Skip } from '../types/skip';

interface SkipCardProps {
  skip: Skip;
  onSelect: (skip: Skip) => void;
  isSelected?: boolean;
}

export const SkipCard: React.FC<SkipCardProps> = ({ skip, onSelect, isSelected }) => {
  const totalPrice = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100);

  return (
    <Card 
      className={`group cursor-pointer shadow-md rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 font-dosis overflow-hidden ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={() => onSelect(skip)}
    >
      <div className="flex flex-col h-full p-8">
        {/* Skip Image Placeholder */}
        <div className="relative aspect-video rounded-md overflow-hidden flex items-center justify-center bg-center bg-cover bg-no-repeat">
          <div className="absolute inset-0 flex items-center justify-center border-b">
            <img 
              src="/placeholder.svg" 
              alt="Skip placeholder" 
              className="w-2/3 h-2/3 object-contain mx-auto my-auto rounded-md shadow-lg backdrop-blur-sm bg-white/30 p-2 sm:p-4"
              style={{ filter: 'blur(0px)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-black dark:text-amber-400 mb-1">
                  {skip.size}
                </div>
                <div className="text-xs sm:text-xl text-black dark:text-amber-300 font-medium">
                  Yard Skip
                </div>
              </div>
            </div>
          </div>
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground text-xs">
            {skip.size} Yards
          </Badge>
          {skip.allowed_on_road && (
            <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-800 dark:bg-green-900 text-white font-semibold text-xs">
              Road Permit
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {skip.size} Yard Skip
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{skip.hire_period_days} day hire</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{skip.postcode}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                £{totalPrice.toFixed(0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Inc. VAT
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {skip.allows_heavy_waste && (
                <Badge variant="secondary" className="text-xs">
                  Heavy Waste OK
                </Badge>
              )}
              {skip.allowed_on_road && (
                <Badge variant="secondary" className="text-xs">
                  Road Placement
                </Badge>
              )}
            </div>
          </div>

          {/* Full Width Button at Bottom */}
          <Button 
            className="w-full mt-auto group-hover:scale-105 transition-transform duration-200 font-medium"
            size="lg"
          >
            Select Skip
          </Button>
        </div>
      </div>
    </Card>
  );
};
