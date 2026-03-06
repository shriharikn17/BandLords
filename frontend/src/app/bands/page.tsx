'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Band {
  id: string;
  name: string;
  genre: string;
  city: string;
  country: string;
  band_image_url: string;
}

export default function BandsDirectory() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const fetchBands = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (genre) queryParams.append('genre', genre);

      // We'll mock the data if the backend isn't available yet or use actual fetch
      const res = await fetch(`http://localhost:5000/api/bands?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBands(data);
      } else {
        // Fallback mock data for UI visualization if API is down
        setBands([
          { id: '1', name: 'SLAYER OF GODS', genre: 'Death Metal', city: 'Stockholm', country: 'Sweden', band_image_url: '' },
          { id: '2', name: 'VOID WALKER', genre: 'Black Metal', city: 'Oslo', country: 'Norway', band_image_url: '' },
          { id: '3', name: 'RUST DUST', genre: 'Stoner Rock', city: 'Desert', country: 'USA', band_image_url: '' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch bands', error);
      // Fallback mock data
      setBands([
        { id: '1', name: 'SLAYER OF GODS', genre: 'Death Metal', city: 'Stockholm', country: 'Sweden', band_image_url: '' },
        { id: '2', name: 'VOID WALKER', genre: 'Black Metal', city: 'Oslo', country: 'Norway', band_image_url: '' },
        { id: '3', name: 'RUST DUST', genre: 'Stoner Rock', city: 'Desert', country: 'USA', band_image_url: '' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBands();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBands();
  };

  return (
    <div>
      <h1 className="text-6xl md:text-8xl mb-12 text-center text-white">
        Band <span className="text-accent">Directory</span>
      </h1>

      <div className="card-brutal mb-12 max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search bands..."
            className="input-brutal flex-grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-brutal md:w-1/4"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Death Metal">Death Metal</option>
            <option value="Black Metal">Black Metal</option>
            <option value="Thrash Metal">Thrash Metal</option>
            <option value="Doom Metal">Doom Metal</option>
            <option value="Punk">Punk</option>
            <option value="Hardcore">Hardcore</option>
          </select>
          <button type="submit" className="btn-brutal">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-2xl font-sans text-accent uppercase">Loading Bands...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bands.map((band) => (
            <Link href={`/bands/${band.id}`} key={band.id} className="block">
              <div className="card-brutal h-full flex flex-col group cursor-pointer">
                <div className="bg-black h-48 mb-4 border-2 border-gray-800 flex items-center justify-center overflow-hidden">
                  {band.band_image_url ? (
                    <img src={band.band_image_url} alt={band.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="font-sans text-4xl text-gray-700 opacity-50 uppercase text-center p-4">{band.name}</span>
                  )}
                </div>
                <h2 className="text-3xl text-white mb-2 group-hover:text-accent transition-colors">{band.name}</h2>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800 font-body text-gray-400 uppercase text-sm font-bold">
                  <span className="text-accent">{band.genre}</span>
                  <span>{band.city}, {band.country}</span>
                </div>
              </div>
            </Link>
          ))}
          {bands.length === 0 && (
            <div className="col-span-full text-center text-xl text-gray-500 font-body p-12">
              No bands found in the abyss. Try another search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
