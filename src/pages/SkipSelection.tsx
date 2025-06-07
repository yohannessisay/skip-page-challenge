import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SkipCard } from '../components/SkipCard';
import { SkipDetailsModal } from '../components/SkipDetailsModal';
import { ProgressSteps } from '../components/ProgressSteps';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ThemeToggle } from '../components/ThemeToggle';
import { Skip } from '../types/skip';
import { apiService } from '../services/apiService';
import { toast } from '@/hooks/use-toast';

const SkipSelection: React.FC = () => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSkips = async () => {
    try {
      setLoading(true);
      setError(null);
      // Call the working API endpoint directly using apiService.get
      const response = await apiService.get(
        '/skips/by-location?postcode=NR32&area=Lowestoft'
      );
      console.log('API Response:', response);
      // Handle different response formats
      if (Array.isArray(response)) {
        setSkips(response);
      } else if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        Array.isArray((response as { data?: unknown }).data)
      ) {
        setSkips((response as { data: Skip[] }).data);
      } else { 
        setSkips([]);
      }
    } catch (err: unknown) {
      console.error('Error fetching skips:', err);
      let errorMessage = 'Failed to load skip options';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load skip options. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkips();
  }, []);

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip);
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    toast({
      title: "Skip Selected",
      description: `${selectedSkip?.size} Yard Skip has been added to your booking.`,
    });
    // Here you would typically navigate to the next step
  };

  const handleRetry = () => {
    fetchSkips();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-dosis">
        <ThemeToggle />
        <ProgressSteps currentStep="select-skip" completedSteps={['postcode', 'waste-type']} />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-0">
                <Skeleton className="aspect-video rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-dosis">
        <ThemeToggle />
        <ProgressSteps currentStep="select-skip" completedSteps={['postcode', 'waste-type']} />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background font-dosis">
        <ThemeToggle />
        <ProgressSteps currentStep="select-skip" completedSteps={['postcode', 'waste-type']} />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Choose Your Skip Size
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the skip size that best suits your needs. All prices include VAT and delivery.
            </p>
          </div>

          {/* Skip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skips.map((skip) => (
              <SkipCard
                key={skip.id}
                skip={skip}
                onSelect={handleSelectSkip}
                isSelected={selectedSkip?.id === skip.id}
              />
            ))}
          </div>

          {skips.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No skip options available for this location.
              </div>
              <Button variant="outline" onClick={handleRetry} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Skip Details Modal */}
        <SkipDetailsModal
          skip={selectedSkip}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onContinue={handleContinue}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SkipSelection;
