'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      {/* Navbar - Tidak akan reload */}
      <Navbar />
      
      {/* Content - Hanya bagian ini yang reload */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer - Tidak akan reload */}
      <Footer />
    </div>
  );
}
