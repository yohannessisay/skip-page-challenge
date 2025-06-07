
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkipCard } from './SkipCard';
import { Skip } from '../types/skip';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calculate how many items to show based on screen size
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4); // xl screens
      else if (window.innerWidth >= 1024) setItemsPerView(3); // lg screens (tablets)
      else if (window.innerWidth >= 768) setItemsPerView(2); // md screens
      else setItemsPerView(1); // mobile
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Calculate maximum index (how far we can slide)
  const maxIndex = Math.max(0, skips.length - itemsPerView);

  const nextSlide = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(Math.min(Math.max(index, 0), maxIndex));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };
 
  const showControls = skips.length > itemsPerView;
 
  const totalDots = showControls ? Math.min(maxIndex + 1, Math.ceil(skips.length / itemsPerView))+1 : 0;

  // Ensure currentIndex doesn't exceed available content
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);

  // Calculate translateX using the safe index
  const translateX = -(safeCurrentIndex * (100 / itemsPerView));

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${(skips.length / itemsPerView) * 100}%`
          }}
        >
          {skips.map((skip, index) => (
            <div
              key={skip.id}
              className="flex-shrink-0 px-2 sm:px-4"
              style={{ width: `${100 / skips.length}%` }}
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
            onClick={prevSlide}
            disabled={currentIndex === 0 || isAnimating}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex || isAnimating}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showControls && totalDots > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === safeCurrentIndex
                  ? 'bg-primary scale-125 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              onClick={() => goToSlide(Math.min(index, maxIndex))}
              disabled={isAnimating}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {showControls && totalDots > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-4">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${totalDots > 1 ? ((safeCurrentIndex + 1) / totalDots) * 100 : 100}%`
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