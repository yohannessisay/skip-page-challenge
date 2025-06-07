import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { Skip } from '../types/skip';

interface SkipDetailsModalProps {
  skip: Skip | null;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const SkipDetailsModal: React.FC<SkipDetailsModalProps> = ({
  skip,
  isOpen,
  onClose,
  onContinue,
}) => {
  if (!skip) return null;

  const totalPrice = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] rounded-md sm:w-full max-h-[80vh] overflow-y-auto font-dosis">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {skip.size} Yard Skip Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Skip Image Placeholder */}
          <div className="relative">
            <div className="aspect-video rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Skip placeholder" 
                className="w-2/3 h-2/3 object-contain mx-auto my-auto rounded-md shadow-xl backdrop-blur-sm bg-white/30 p-4"
                style={{ filter: 'blur(2px)' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                    {skip.size}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Yard Skip
                  </div>
                </div>
              </div>
            </div>
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              {skip.size} Yards
            </Badge>
          </div>

          {/* Price Card */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                £{totalPrice.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">
                {skip.hire_period_days} day hire period
              </div>
            </div>
          </Card>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Hire Period</div>
                <div className="text-sm text-muted-foreground">
                  {skip.hire_period_days} days
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {skip.postcode}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Delivery & Collection</div>
                <div className="text-sm text-muted-foreground">
                  Included in price
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium">What's Included</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Free delivery and collection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{skip.hire_period_days} day hire period</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">VAT included</span>
              </div>
              {skip.allows_heavy_waste && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Heavy waste allowed</span>
                </div>
              )}
              {skip.allowed_on_road && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Road placement permit included</span>
                </div>
              )}
            </div>
          </div>

          {/* Restrictions */}
          <div className="space-y-3">
            <h4 className="font-medium">Important Information</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  No hazardous materials (asbestos, chemicals, paint, etc.)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Skip must not be overloaded above rim level
                </span>
              </div>
              {!skip.allows_heavy_waste && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    No heavy materials (concrete, soil, bricks)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Price Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Skip hire ({skip.hire_period_days} days)</span>
                <span>£{skip.price_before_vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>VAT ({skip.vat}%)</span>
                <span>£{(skip.price_before_vat * skip.vat / 100).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue with this Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
