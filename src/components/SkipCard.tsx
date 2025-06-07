
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
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
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={() => onSelect(skip)}
    >
      <div className="p-0">
        {/* Skip Image Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-t-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {skip.size}
              </div>
              <div className="text-sm text-yellow-700">
                Yard Skip
              </div>
            </div>
          </div>
          <Badge className="absolute top-3 right-3 bg-blue-600">
            {skip.size} Yards
          </Badge>
          {skip.allowed_on_road && (
            <Badge className="absolute top-3 left-3 bg-green-600">
              Road Permit
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">
              {skip.size} Yard Skip
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {skip.hire_period_days} day hire
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {skip.postcode}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                £{totalPrice.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Inc. VAT
              </div>
            </div>
            
            <Button 
              className="group-hover:translate-x-1 transition-transform duration-200"
              size="sm"
            >
              Select Skip
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Features */}
          <div className="flex gap-2 text-xs">
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
      </div>
    </Card>
  );
};
