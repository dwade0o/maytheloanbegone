# AdSense Setup Guide

## 🎯 Current Status

- ✅ AdSense components are ready
- ✅ Responsive design implemented
- ✅ Production-ready code
- ⏳ Waiting for AdSense approval

## 📋 Steps to Enable AdSense

### 1. Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Click "Get started"
4. Add your website URL (must be live on the internet)
5. Submit for review (usually takes 1-7 days)

### 2. Get Your AdSense Credentials

After approval, you'll get:

- **Client ID**: `ca-pub-xxxxxxxxxx`
- **Ad Slot IDs**: Different IDs for different ad positions

### 3. Add Environment Variables

Create a `.env.local` file in your project root:

```bash
# AdSense Configuration
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_TOP_BANNER_SLOT=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_MIDDLE_RECTANGLE_SLOT=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_BOTTOM_BANNER_SLOT=xxxxxxxxxx
NEXT_PUBLIC_ADSENSE_MOBILE_BANNER_SLOT=xxxxxxxxxx
```

### 4. Deploy to Production

- Deploy your app to Vercel, Netlify, or your preferred hosting
- Make sure the domain is live and accessible
- AdSense will only work on production domains

## 🎨 Ad Positions

### Mobile (320px-767px)

- **Above tabs**: 320×50px mobile banner
- **Between content**: 300×250px rectangle (centered)

### Desktop (1024px+)

- **Above tabs**: 728×90px leaderboard
- **Between content**: 300×250px rectangle (centered)
- **Bottom**: 728×90px leaderboard

## 🔧 Development vs Production

### Development (localhost)

- Shows blue placeholder ads
- No real ads (AdSense blocks localhost)
- Perfect for testing layout

### Production (live domain)

- Shows real AdSense ads
- Generates revenue
- Requires AdSense approval

## 💰 Revenue Expectations

Financial/calculator sites typically get:

- **$2-8 RPM** (Revenue Per Mille)
- **High click-through rates**
- **Premium advertisers** (banks, financial services)

## 🚀 Next Steps

1. **Deploy your app** to a live domain
2. **Apply for AdSense** with your live URL
3. **Add environment variables** after approval
4. **Start earning** from your calculator app!

## 📞 Support

If you need help with AdSense setup, check:

- [Google AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Policies](https://support.google.com/adsense/answer/23921)
