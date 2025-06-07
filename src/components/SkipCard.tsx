
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
      <div className="flex flex-col h-full">
        {/* Skip Image Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                {skip.size}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Yard Skip
              </div>
            </div>
          </div>
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {skip.size} Yards
          </Badge>
          {skip.allowed_on_road && (
            <Badge className="absolute top-3 left-3 bg-green-600 dark:bg-green-700">
              Road Permit
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">
              {skip.size} Yard Skip
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{skip.hire_period_days} day hire</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{skip.postcode}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold text-primary mb-1">
                £{totalPrice.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Inc. VAT
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
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
