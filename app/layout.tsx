import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './studio.css';
import './team.css';
import './hero-punchline.css';
import './scroll-detail.css';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'eigi_ai — Intelligence, deployed.',
  icons: { icon: '/favicon.svg' },
  description: 'Forward deployed engineers. We embed with your team to turn complex workflows into AI systems that work in the real world.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

