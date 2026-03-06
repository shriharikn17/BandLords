import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-32">
      {/* Hero Section */}
      <section className="relative py-20 md:py-40 flex flex-col items-center justify-center border-b-8 border-accent">
        <div className="absolute inset-0 bg-black z-0 opacity-80 pointer-events-none border-[12px] border-accent/20"></div>
        <div className="relative z-10 text-center max-w-5xl px-4">
          <h1 className="text-6xl md:text-9xl text-white mb-6 uppercase tracking-tighter" style={{ textShadow: '6px 6px 0px #ff0033' }}>
            Welcome to the <br/>
            <span className="text-accent bg-white px-4 leading-none inline-block mt-4">Underground</span>
          </h1>
          <p className="text-xl md:text-3xl font-body text-gray-300 font-bold uppercase tracking-widest mb-12 border-y-2 border-gray-800 py-4 inline-block">
            The Ultimate Network for Rock & Metal
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/bands" className="btn-brutal text-2xl py-6 px-12">
              Discover Bands
            </Link>
            <Link href="/events" className="btn-brutal bg-black text-white border-white hover:bg-white hover:text-black hover:border-white text-2xl py-6 px-12">
              Find Gigs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-brutal group">
          <div className="h-32 bg-accent mb-6 flex items-center justify-center border-4 border-black group-hover:bg-white transition-colors">
            <span className="font-sans text-5xl text-black uppercase">Bands</span>
          </div>
          <h3 className="text-3xl text-white mb-4 uppercase">Direct Connection</h3>
          <p className="font-body text-gray-400 text-lg">
            No corporate algorithms. Find real underground bands, follow their updates, and support the scene directly.
          </p>
        </div>

        <div className="card-brutal group border-accent">
          <div className="h-32 bg-gray-800 mb-6 flex items-center justify-center border-4 border-accent group-hover:bg-accent transition-colors">
            <span className="font-sans text-5xl text-white uppercase">Gigs</span>
          </div>
          <h3 className="text-3xl text-accent mb-4 uppercase">Live & Loud</h3>
          <p className="font-body text-gray-400 text-lg">
            From dive bars to abandoned warehouses. Never miss a local show again with our brutal gig radar.
          </p>
        </div>

        <div className="card-brutal group">
          <div className="h-32 bg-white mb-6 flex items-center justify-center border-4 border-black group-hover:bg-accent transition-colors">
            <span className="font-sans text-5xl text-black uppercase">Merch</span>
          </div>
          <h3 className="text-3xl text-white mb-4 uppercase">Support the Scene</h3>
          <p className="font-body text-gray-400 text-lg">
            Buy vinyl, cassettes, and bloody t-shirts directly from the artists. Real support for real music.
          </p>
        </div>
      </section>

      {/* Call to Action for Bands */}
      <section className="bg-accent py-24 text-center border-y-8 border-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl text-black uppercase mb-8 font-black tracking-tighter">
            Are you in a band?
          </h2>
          <p className="text-2xl text-white font-body mb-12 max-w-3xl mx-auto font-bold">
            Stop relying on mainstream social media. Build your brutal profile, list your gigs, and sell your merch directly to the real fans.
          </p>
          <Link href="/register?role=band" className="inline-block bg-black text-white font-sans text-3xl uppercase px-12 py-6 border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)]">
            Join the Horde
          </Link>
        </div>
      </section>
    </div>
  );
}
