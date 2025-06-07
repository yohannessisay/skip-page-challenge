
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkipCard } from './SkipCard';
import { Skip } from '../types/skip';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';

interface SkipCarouselProps {
  skips: Skip[];
  onSelectSkip: (skip: Skip) => void;
  onSkipHover: (skip: Skip) => void;
}

export const SkipCarousel: React.FC<SkipCarouselProps> = ({ 
  skips, 
  onSelectSkip, 
  onSkipHover 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Embla options with responsive breakpoints
  const options: EmblaOptionsType = {
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }, // md screens - scroll 2 at a time
      '(min-width: 1024px)': { slidesToScroll: 3 }, // lg screens - scroll 3 at a time  
      '(min-width: 1280px)': { slidesToScroll: 4 }, // xl screens - scroll 4 at a time
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Check if we need to show controls
  const showControls = scrollSnaps.length > 1;

  return (
    <div className="relative w-full">
      {/* Embla Carousel */}
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex gap-4">
          {skips.map((skip, index) => (
            <div
              key={skip.id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-0"
              onMouseEnter={() => onSkipHover(skip)}
            >
              <div className="transform transition-all duration-300 hover:scale-105">
                <SkipCard
                  skip={skip}
                  onSelect={() => onSelectSkip(skip)}
                  isSelected={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showControls && scrollSnaps.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-primary scale-125 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {showControls && scrollSnaps.length > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-4">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${scrollSnaps.length > 1 ? ((selectedIndex + 1) / scrollSnaps.length) * 100 : 100}%`
            }}
          />
        </div>
      )}

      {/* Mobile swipe hint */}
      {showControls && (
        <div className="text-center mt-4 sm:hidden">
          <p className="text-sm text-muted-foreground">
            Swipe left or right to browse skips
          </p>
        </div>
      )}
    </div>
  );
};