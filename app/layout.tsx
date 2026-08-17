import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'NoteHub is a simple and efficient application designed for managing personal notes.',
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* атрибут suppressHydrationWarning до тегу <body> підкаже React,
         щоб він ігнорував сторонні атрибути, додані розширеннями браузера.
          Наприклад, grammarly*/}
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