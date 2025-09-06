import React, { useEffect, useRef } from 'react';

// TypeScript declaration for Google AdSense
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseAdProps {
  size: 'banner' | 'rectangle' | 'mobile-banner';
  className?: string;
  // These will be set when you get AdSense approval
  clientId?: string;
  slotId?: string;
}

const adDimensions = {
  banner: { width: 728, height: 90, name: 'Leaderboard' },
  rectangle: { width: 300, height: 250, name: 'Medium Rectangle' },
  'mobile-banner': { width: 320, height: 50, name: 'Mobile Banner' },
};

export default function AdSenseAd({
  size,
  className = '',
  clientId,
  slotId,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const dimensions = adDimensions[size];

  useEffect(() => {
    // Only load AdSense in production with real client/slot IDs
    if (typeof window === 'undefined' || !clientId || !slotId) return;

    const loadAdSenseScript = () => {
      return new Promise<void>(resolve => {
        // Check if script already exists
        if (document.querySelector('script[src*="adsbygoogle.js"]')) {
          resolve();
          return;
        }

        // Load AdSense script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.crossOrigin = 'anonymous';

        script.onload = () => resolve();
        script.onerror = () => resolve();

        document.head.appendChild(script);
      });
    };

    const loadAd = async () => {
      await loadAdSenseScript();

      if (!adRef.current) return;

      try {
        // Initialize AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // AdSense loaded successfully
      } catch {
        // AdSense failed to load - will show placeholder
      }
    };

    loadAd();
  }, [clientId, slotId, size]);

  // Show placeholder in development or if no client/slot IDs
  if (!clientId || !slotId) {
    return (
      <div className={`w-full ${className}`}>
        <div
          className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700 rounded-lg text-center"
          style={{
            minHeight: `${dimensions.height}px`,
            maxWidth: `${dimensions.width}px`,
            margin: '0 auto',
          }}
        >
          <div className="p-4">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              AdSense Ready
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              {dimensions.name} • {dimensions.width} × {dimensions.height}px
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-500">
              Add clientId & slotId for production
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show real AdSense ad in production
  return (
    <div className={`w-full ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: `${dimensions.height}px`,
          maxWidth: `${dimensions.width}px`,
          margin: '0 auto',
        }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Pre-configured components
export const AdSenseBannerAd = ({
  className,
  clientId,
  slotId,
}: {
  className?: string;
  clientId?: string;
  slotId?: string;
}) => (
  <AdSenseAd
    size="banner"
    className={className}
    clientId={clientId}
    slotId={slotId}
  />
);

export const AdSenseRectangleAd = ({
  className,
  clientId,
  slotId,
}: {
  className?: string;
  clientId?: string;
  slotId?: string;
}) => (
  <AdSenseAd
    size="rectangle"
    className={className}
    clientId={clientId}
    slotId={slotId}
  />
);

export const AdSenseMobileBannerAd = ({
  className,
  clientId,
  slotId,
}: {
  className?: string;
  clientId?: string;
  slotId?: string;
}) => (
  <AdSenseAd
    size="mobile-banner"
    className={className}
    clientId={clientId}
    slotId={slotId}
  />
);

export const ResponsiveAdSenseAd = ({
  className,
  clientId,
  slotId,
}: {
  className?: string;
  clientId?: string;
  slotId?: string;
}) => (
  <div className={className}>
    <AdSenseMobileBannerAd
      className="block sm:hidden"
      clientId={clientId}
      slotId={slotId}
    />
    <AdSenseBannerAd
      className="hidden sm:block"
      clientId={clientId}
      slotId={slotId}
    />
  </div>
);
