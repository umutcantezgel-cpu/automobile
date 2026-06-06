import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/sections/site-header';
import { SiteFooter } from '@/components/sections/site-footer';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';

import './globals.css';

/* ------------------------------------------------------------------ */
/*  Google Fonts                                                       */
/* ------------------------------------------------------------------ */

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: 'Apex Motors — Premium-Fahrzeuge in Wetzlar',
  description:
    'Entdecken Sie handverlesene Premium-Fahrzeuge bei Apex Motors in Wetzlar. Gebrauchtwagen mit Garantie, Finanzierung und erstklassigem Service seit 1986.',
};

/* ------------------------------------------------------------------ */
/*  Root Layout                                                        */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background">
          Zum Hauptinhalt springen
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 flex flex-col pt-20 md:pt-24 pb-16 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
