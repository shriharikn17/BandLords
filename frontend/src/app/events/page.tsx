'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  band_id: string;
  band_name: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  city: string;
  event_date: string;
  poster_image_url: string;
  ticket_link: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append('city', city);

      const res = await fetch(`http://localhost:5000/api/events?${queryParams.toString()}`);
      if (res.ok) {
        setEvents(await res.json());
      } else {
        // Mock data
        setEvents([
          {
            id: '1',
            band_id: '1',
            band_name: 'SLAYER OF GODS',
            title: 'Summer Deathfest',
            description: 'A night of pure brutality. Be there or be dead.',
            venue: 'The Black Room',
            location: 'Downtown',
            city: 'Stockholm',
            event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
            poster_image_url: '',
            ticket_link: '#'
          },
          {
            id: '2',
            band_id: '2',
            band_name: 'VOID WALKER',
            title: 'Into the Abyss Tour',
            description: 'The void comes to your city.',
            venue: 'Underground Cellar',
            location: 'East Side',
            city: 'Oslo',
            event_date: new Date(Date.now() + 86400000 * 14).toISOString(),
            poster_image_url: '',
            ticket_link: '#'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Mock data
      setEvents([
        {
          id: '1',
          band_id: '1',
          band_name: 'SLAYER OF GODS',
          title: 'Summer Deathfest',
          description: 'A night of pure brutality. Be there or be dead.',
          venue: 'The Black Room',
          location: 'Downtown',
          city: 'Stockholm',
          event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
          poster_image_url: '',
          ticket_link: '#'
        },
        {
          id: '2',
          band_id: '2',
          band_name: 'VOID WALKER',
          title: 'Into the Abyss Tour',
          description: 'The void comes to your city.',
          venue: 'Underground Cellar',
          location: 'East Side',
          city: 'Oslo',
          event_date: new Date(Date.now() + 86400000 * 14).toISOString(),
          poster_image_url: '',
          ticket_link: '#'
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div>
      <h1 className="text-6xl md:text-8xl mb-12 text-center text-white">
        Upcoming <span className="text-accent">Gigs</span>
      </h1>

      <div className="card-brutal mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by city..."
            className="input-brutal flex-grow"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="btn-brutal">Find</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-2xl font-sans text-accent uppercase">Scanning the radar...</div>
      ) : (
        <div className="space-y-8">
          {events.length > 0 ? (
            events.map((event) => {
              const date = new Date(event.event_date);
              return (
                <div key={event.id} className="card-brutal flex flex-col md:flex-row gap-8 items-start">
                  {/* Date Block */}
                  <div className="flex-shrink-0 w-full md:w-32 bg-black border-2 border-accent p-4 text-center">
                    <div className="text-accent font-sans text-xl uppercase mb-1">{date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-white font-sans text-5xl">{date.getDate()}</div>
                    <div className="text-gray-400 font-body text-sm mt-2">{date.getFullYear()}</div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow">
                    <Link href={`/bands/${event.band_id}`} className="inline-block bg-accent text-white px-3 py-1 font-sans text-sm uppercase mb-4 hover:bg-white hover:text-black transition-colors">
                      {event.band_name}
                    </Link>
                    <h2 className="text-3xl text-white mb-2 uppercase">{event.title}</h2>
                    <p className="text-xl text-gray-300 font-body mb-4">{event.venue} — {event.city}</p>
                    <p className="text-gray-500 font-body text-sm mb-6 max-w-2xl">{event.description}</p>

                    {event.ticket_link && (
                      <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="btn-brutal inline-block">
                        Get Tickets
                      </a>
                    )}
                  </div>

                  {/* Poster (Optional) */}
                  {event.poster_image_url && (
                    <div className="hidden lg:block flex-shrink-0 w-48 h-64 bg-gray-900 border border-gray-800">
                      <img src={event.poster_image_url} alt="Event Poster" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-xl text-gray-500 font-body p-12 card-brutal">
              No gigs found in {city || 'the area'}. The scene is dead tonight.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
