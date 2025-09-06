// AdSense Configuration
// Update these values when you get AdSense approval

export const ADSENSE_CONFIG = {
  // Your AdSense client ID (ca-pub-xxxxxxxxxx)
  CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',

  // Your ad slot IDs for different positions
  SLOTS: {
    // Above the fold banner
    TOP_BANNER: process.env.NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT || '',

    // Between content rectangle
    MIDDLE_RECTANGLE:
      process.env.NEXT_PUBLIC_ADSENSE_MIDDLE_RECTANGLE_SLOT || '',

    // Bottom banner
    BOTTOM_BANNER: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT || '',

    // Mobile banner (can be same as top banner)
    MOBILE_BANNER: process.env.NEXT_PUBLIC_ADSENSE_MOBILE_BANNER_SLOT || '',
  },
};

// Check if AdSense is configured
export const isAdSenseConfigured = () => {
  return !!(
    ADSENSE_CONFIG.CLIENT_ID &&
    ADSENSE_CONFIG.SLOTS.TOP_BANNER &&
    ADSENSE_CONFIG.SLOTS.MIDDLE_RECTANGLE &&
    ADSENSE_CONFIG.SLOTS.BOTTOM_BANNER
  );
};

// Get environment-specific settings
export const getAdSenseSettings = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isConfigured = isAdSenseConfigured();

  return {
    isProduction,
    isConfigured,
    shouldShowAds: isProduction && isConfigured,
    clientId: ADSENSE_CONFIG.CLIENT_ID,
    slots: ADSENSE_CONFIG.SLOTS,
  };
};
