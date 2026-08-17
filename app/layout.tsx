import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

// Налаштування шрифту Roboto через систему шрифтів Next.js
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'NoteHub is a simple and efficient application designed for managing personal notes.',
  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub is a simple and efficient application designed for managing personal notes.',
    url: 'https://notehub.com', // вкажіть реальний або базовий URL вашого проєкту
    images: [
      {
        url: 'https://notehub.com/og-image.jpg', // шлях до OG-зображення
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview',
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}