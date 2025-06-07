
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
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto font-dosis">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {skip.size} Yard Skip Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Skip Image Placeholder */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                  {skip.size}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Yard Skip
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
                  {skip.postcode} {skip.area}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Road Placement</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {skip.allowed_on_road ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Allowed on road
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Private property only
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {skip.allows_heavy_waste ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Heavy waste</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Quick delivery</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <Card className="p-3 bg-muted/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price before VAT:</span>
                <span>£{skip.price_before_vat}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({skip.vat}%):</span>
                <span>£{(skip.price_before_vat * skip.vat / 100).toFixed(0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>£{totalPrice.toFixed(0)}</span>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Back
            </Button>
            <Button onClick={onContinue} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
