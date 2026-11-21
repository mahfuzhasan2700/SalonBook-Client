import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SalonBook - Luxury Salon Appointment Booking Platform',
  description:
    'Discover and book appointments for luxury haircuts, color treatments, rejuvenating facials, bridal glam, and relaxation spa sessions with top-tier stylists.',
  keywords: 'salon booking, hair salon, haircut, balayage, spa, facials, beauty appointment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
