import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'May the loan be gone - Free Loan Calculator',
    template: '%s | May the loan be gone',
  },
  description:
    'Calculate loan payments, interest, and amortization with our free online loan calculator. Multiple loan types supported including single loans, split loans, fixed period, and fixed rate loans.',
  keywords: [
    'loan calculator',
    'mortgage calculator',
    'loan payment calculator',
    'interest calculator',
    'amortization calculator',
    'free loan calculator',
    'loan calculator online',
    'home loan calculator',
    'personal loan calculator',
    'car loan calculator',
  ],
  authors: [{ name: 'May the loan be gone' }],
  creator: 'May the loan be gone',
  publisher: 'May the loan be gone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://maytheloanbegone.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maytheloanbegone.vercel.app',
    title: 'May the loan be gone - Free Loan Calculator',
    description:
      'Calculate loan payments, interest, and amortization with our free online loan calculator. Multiple loan types supported.',
    siteName: 'May the loan be gone',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'May the loan be gone - Free Loan Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'May the loan be gone - Free Loan Calculator',
    description:
      'Calculate loan payments, interest, and amortization with our free online loan calculator.',
    images: ['/og-image.png'],
    creator: '@maytheloanbegone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add when you get it
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
