
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Almarai } from 'next/font/google';

// Configure Almarai font
const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
});


export const metadata: Metadata = {
  title: 'AVAZ العقارية | شريكك العقاري الأول في الرياض والمملكة',
  description: 'أفاز العقارية: خبراء في التسويق وإدارة الأملاك والاستشارات العقارية. اكتشف فرص استثمارية فريدة وحلول عقارية مبتكرة في الرياض وكافة أنحاء المملكة العربية السعودية. حقق أهدافك العقارية معنا.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Fonts link is handled by next/font */}
      </head>
      <body className={`${almarai.variable} font-body antialiased flex flex-col min-h-screen bg-background`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-screen-xl">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
    