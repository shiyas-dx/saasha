import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SAASHA - B2B Wholesale E-Commerce Market for Retail Shopkeepers',
  description: 'Direct wholesale supplier portal for retail shopkeepers. Bulk deals, high margins, fast delivery, and dedicated multi-admin warehouse support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
