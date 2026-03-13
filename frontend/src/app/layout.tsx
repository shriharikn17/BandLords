import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'BandLords | The Underground Rock & Metal Scene',
  description: 'The platform for the underground rock and metal scene. Discover bands, events, and merch.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b-4 border-accent sticky top-0 z-50 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-4xl md:text-5xl font-black tracking-tighter text-white hover:text-accent transition-colors uppercase leading-none" style={{ fontFamily: 'var(--font-sans)' }}>
              Band<span className="text-accent">Lords</span>
            </Link>
            <nav className="flex items-center gap-6 md:gap-8 font-sans text-xl font-bold">
              <Link href="/bands" className="hover:text-accent hover:underline decoration-4 underline-offset-8 transition-all uppercase">Bands</Link>
              <Link href="/events" className="hover:text-accent hover:underline decoration-4 underline-offset-8 transition-all uppercase">Events</Link>
              <Link href="/merch" className="hover:text-accent hover:underline decoration-4 underline-offset-8 transition-all uppercase">Merch</Link>
              <Link href="/cart" className="hover:text-accent hover:underline decoration-4 underline-offset-8 transition-all uppercase text-accent">Cart</Link>
              <Link href="/login" className="px-6 py-2 bg-white text-black hover:bg-accent hover:text-white transition-colors uppercase">Login</Link>
            </nav>
          </div>
        </header>

        <CartProvider>
          <main className="flex-grow container mx-auto px-4 py-12">
            {children}
          </main>
        </CartProvider>

        <footer className="border-t-4 border-gray-800 mt-20 bg-black pt-16 pb-8">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-4xl text-accent mb-6" style={{ fontFamily: 'var(--font-sans)' }}>BandLords</h2>
              <p className="text-gray-400 font-body text-lg leading-relaxed">
                The ultimate platform for the underground rock and metal scene. Support your local bands.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-6 text-white border-b-2 border-accent inline-block pb-2">Links</h3>
              <ul className="space-y-4 font-sans text-xl text-gray-400">
                <li><Link href="/bands" className="hover:text-accent transition-colors uppercase">Discover Bands</Link></li>
                <li><Link href="/events" className="hover:text-accent transition-colors uppercase">Upcoming Events</Link></li>
                <li><Link href="/merch" className="hover:text-accent transition-colors uppercase">Merch Store</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl mb-6 text-white border-b-2 border-accent inline-block pb-2">Join</h3>
              <p className="text-gray-400 font-body text-lg mb-6">Are you a band? Join the lords of the underground.</p>
              <Link href="/register?role=band" className="inline-block bg-accent text-white font-sans text-xl uppercase px-8 py-4 hover:bg-white hover:text-black transition-colors w-full text-center">
                Register Band
              </Link>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 font-body">
            <p>&copy; {new Date().getFullYear()} BandLords. For the underground.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
