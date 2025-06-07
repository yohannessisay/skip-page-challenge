import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { SkipCard } from "../components/SkipCard";
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
        className="min-h-screen font-dosis"
        style={{
          backgroundColor: "#ee5522",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23d23d09'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='1'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "25px 25px",
        }}
      >
        {/* Header with background refresh indicator */}
        <header
          className={`sticky top-0 z-40 w-full border-b shadow-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
            isScrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Choose Your Skip Size</h1>
              {isFetching && !isLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="container py-2">
          <ProgressSteps
            currentStep="select-skip"
            completedSteps={["postcode", "waste-type"]}
          />

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          )}

          {/* Skip Cards */}
          {!isLoading && skips.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12  ">
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
