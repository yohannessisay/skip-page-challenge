
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Grid3X3, Shuffle } from "lucide-react";
import { SkipCard } from "../components/SkipCard";
import { SkipCarousel } from "../components/SkipCarousel";
import { SkipDetailsModal } from "../components/SkipDetailsModal";
import { ProgressSteps } from "../components/ProgressSteps";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ThemeToggle } from "../components/ThemeToggle";
import { Skip } from "../types/skip";
import { toast } from "@/hooks/use-toast";
import { useSkips, usePrefetchSkips } from "../hooks/useSkips";

interface SkipSelectionProps {
  postcode?: string;
  area?: string;
}

const SkipSelection: React.FC<SkipSelectionProps> = ({ postcode, area }) => {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // TanStack Query handles all the complexity with enhanced caching
  const {
    data: skips = [],
    isLoading,
    error,
    refetch,
    isError,
    isFetching,
  } = useSkips(postcode, area);
  const { prefetchSkip } = usePrefetchSkips();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Error toast
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: "Failed to load skip options. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error]);

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip);
    setIsModalOpen(true);
  };

  // Prefetch skip details on hover for instant modal loading
  const handleSkipHover = (skip: Skip) => {
    if (skip.id) {
      prefetchSkip(skip.id);
    }
  };

  const handleContinue = () => {
    if (selectedSkip) {
      toast({
        title: "Skip Selected!",
        description: `You've selected a ${selectedSkip.size} yard skip for £${(
          selectedSkip.price_before_vat +
          (selectedSkip.price_before_vat * selectedSkip.vat) / 100
        ).toFixed(2)}`,
      });
      setIsModalOpen(false);
    }
  };

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen font-dosis bg-gradient-to-r from-slate-100 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850"
      >
        {/* Header with background refresh indicator */}
        <header
          className={`sticky top-0 rounded-md z-40 w-full border-b shadow-md supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
            isScrolled ? "shadow-md backdrop-blur-md bg-background/95" : ""
          }`}
        >
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Choose Your Skip Size</h1>
              {isFetching && !isLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
            
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container py-2 pt-20">
          <div className="max-w-none">
            <ProgressSteps
              currentStep="select-skip"
              completedSteps={["postcode", "waste-type"]}
            />
          </div>

          {/* Error State */}
          {isError && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load skip options. Please try again.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Retry"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <Skeleton className="h-96 w-full rounded-lg" />
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-3 rounded-full" />
                ))}
              </div>
            </div>
          )}

          {/* Skip Display */}
          {!isLoading && skips.length > 0 && (
            <div className="mt-8">
              {viewMode === 'carousel' ? (
                <SkipCarousel
                  skips={skips}
                  onSelectSkip={handleSelectSkip}
                  onSkipHover={handleSkipHover}
                />
              ) : (
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                  {skips.map((skip) => (
                    <div key={skip.id} onMouseEnter={() => handleSkipHover(skip)}>
                      <SkipCard
                        skip={skip}
                        onSelect={() => handleSelectSkip(skip)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !isError && skips.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No skip options available for this location.
              </p>
              <Button onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Try Again
              </Button>
            </Card>
          )}
        </main>

        {/* Modal */}
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