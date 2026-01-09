import type { Metadata } from 'next';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';

import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['500', '600', '700'],
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Belintash GM Console',
  description: 'A live dashboard for The Golden Chariot of Belintash onboarding + telemetry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className={`${playfair.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
