import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { EmergencyProvider } from '@/features/emergency';
import { DemoControls } from '@/components/demo/DemoControls';
import './globals.css';

/**
 * One font declaration for the whole application. The export imported Inter
 * from Google Fonts on all ten screens; next/font loads and self-hosts it once.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MedLink Botswana',
  description:
    'Emergency medical response coordination for Botswana. One press. Critical information. Faster response. Prototype - not connected to any live emergency service.',
};

export const viewport: Viewport = {
  themeColor: '#00478D',
  width: 'device-width',
  initialScale: 1,
  /* Never block zoom - the patient app is used by people with low vision. */
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* lang is fixed to English for now; see src/lib/i18n.ts for the Setswana plan. */
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <EmergencyProvider>
          {children}
          <DemoControls />
        </EmergencyProvider>
      </body>
    </html>
  );
}
