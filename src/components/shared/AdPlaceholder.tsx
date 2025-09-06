import React from 'react';
import { Card, CardContent } from '@/components/client/ui/card';

interface AdPlaceholderProps {
  size:
    | 'banner'
    | 'rectangle'
    | 'skyscraper'
    | 'square'
    | 'mobile-banner'
    | 'leaderboard'
    | 'half-banner'
    | 'mobile-leaderboard';
  position?: 'above-fold' | 'below-fold' | 'sidebar' | 'between-content';
  className?: string;
  children?: React.ReactNode;
}

// Real ad dimensions based on industry standards
const adDimensions = {
  // Mobile ads (320px-767px)
  'mobile-banner': { width: 320, height: 50, name: 'Mobile Banner' },
  'mobile-leaderboard': { width: 320, height: 100, name: 'Mobile Leaderboard' },

  // Tablet ads (768px-1023px)
  'half-banner': { width: 468, height: 60, name: 'Half Banner' },
  rectangle: { width: 300, height: 250, name: 'Medium Rectangle' },

  // Desktop ads (1024px+)
  banner: { width: 728, height: 90, name: 'Leaderboard' },
  leaderboard: { width: 728, height: 90, name: 'Leaderboard' },
  square: { width: 250, height: 250, name: 'Square' },
  skyscraper: { width: 160, height: 600, name: 'Wide Skyscraper' },
};

// Responsive classes that maintain proper aspect ratios across devices
const responsiveClasses = {
  // Mobile-first responsive design
  'mobile-banner': 'w-full h-12 sm:h-14', // 320x50 - Mobile only
  'mobile-leaderboard': 'w-full h-20 sm:h-24', // 320x100 - Mobile only

  // Tablet responsive
  'half-banner': 'w-full max-w-md h-12 md:h-16 lg:h-20', // 468x60 - Tablet/Desktop
  rectangle: 'w-full max-w-sm mx-auto h-48 sm:h-56 md:h-64 lg:h-72', // 300x250 - All devices, centered

  // Desktop responsive
  banner: 'w-full h-16 md:h-20 lg:h-24', // 728x90 - Desktop
  leaderboard: 'w-full h-16 md:h-20 lg:h-24', // 728x90 - Desktop
  square: 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64', // 250x250 - All devices
  skyscraper: 'hidden lg:block w-40 h-96 xl:w-48 xl:h-[600px]', // 160x600 - Desktop only
};

export default function AdPlaceholder({
  size,
  position = 'below-fold',
  className = '',
  children,
}: AdPlaceholderProps) {
  const baseClasses =
    'flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg';
  const sizeClass = responsiveClasses[size];
  const dimensions = adDimensions[size];

  return (
    <Card className={`${baseClasses} ${sizeClass} ${className}`}>
      <CardContent className="p-2 sm:p-4 text-center">
        {children || (
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-xs sm:text-sm font-medium mb-1">
              Advertisement
            </div>
            <div className="text-xs">{dimensions.name}</div>
            <div className="text-xs opacity-75">
              {dimensions.width}×{dimensions.height}px
            </div>
            <div className="text-xs opacity-50">
              {position.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-configured ad components for different device contexts
export const MobileBannerAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="mobile-banner"
    position="above-fold"
    className={`${className} block sm:hidden`}
  />
);

export const MobileLeaderboardAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="mobile-leaderboard"
    position="above-fold"
    className={`${className} block sm:hidden`}
  />
);

export const TabletBannerAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="half-banner"
    position="above-fold"
    className={`${className} hidden sm:block lg:hidden`}
  />
);

export const DesktopBannerAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="banner"
    position="above-fold"
    className={`${className} hidden lg:block`}
  />
);

export const RectangleAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="rectangle"
    position="between-content"
    className={`${className} flex justify-center`}
  />
);

export const SidebarAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="skyscraper"
    position="sidebar"
    className={`${className} hidden lg:block`}
  />
);

export const SquareAd = ({ className }: { className?: string }) => (
  <AdPlaceholder
    size="square"
    position="between-content"
    className={className}
  />
);

// Responsive ad that automatically chooses the right size
export const ResponsiveBannerAd = ({ className }: { className?: string }) => (
  <div className={className}>
    <MobileBannerAd />
    <TabletBannerAd />
    <DesktopBannerAd />
  </div>
);
