'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BandMember {
  id: string;
  name: string;
  role: string;
  instrument: string;
}

interface BandProfile {
  id: string;
  name: string;
  genre: string;
  city: string;
  country: string;
  bio: string;
  banner_image_url: string;
  band_image_url: string;
  members: BandMember[];
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  venue: string;
  city: string;
  ticket_link: string;
}

interface Post {
  id: string;
  type: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function BandProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [band, setBand] = useState<BandProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBandData = async () => {
      setLoading(true);
      try {
        const [bandRes, eventsRes, postsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/bands/${id}`),
          fetch(`http://localhost:5000/api/events?band_id=${id}`),
          fetch(`http://localhost:5000/api/posts?band_id=${id}`)
        ]);

        if (bandRes.ok) {
          setBand(await bandRes.json());
        } else {
          // Mock data
          setBand({
            id,
            name: 'SLAYER OF GODS',
            genre: 'Death Metal',
            city: 'Stockholm',
            country: 'Sweden',
            bio: 'Forged in the depths of the Swedish underground, Slayer of Gods brings unrelenting brutality and darkness to the masses.',
            banner_image_url: '',
            band_image_url: '',
            members: [
              { id: '1', name: 'Bjorn', role: 'Vocals', instrument: 'Vocals' },
              { id: '2', name: 'Sven', role: 'Lead Guitar', instrument: 'Guitar' }
            ]
          });
        }

        if (eventsRes.ok) {
          setEvents(await eventsRes.json());
        } else {
          // Mock data
          setEvents([
            { id: '1', title: 'Summer Deathfest', event_date: new Date().toISOString(), venue: 'The Black Room', city: 'Stockholm', ticket_link: '#' }
          ]);
        }

        if (postsRes.ok) {
          setPosts(await postsRes.json());
        } else {
          // Mock data
          setPosts([
            { id: '1', type: 'announcement', content: 'New album dropping next month. Prepare for devastation.', image_url: '', created_at: new Date().toISOString() }
          ]);
        }
      } catch (error) {
        console.error('Error fetching band data:', error);
      }
      setLoading(false);
    };

    if (id) {
      fetchBandData();
    }
  }, [id]);

  if (loading) return <div className="text-center text-4xl font-sans text-accent mt-20 uppercase">Summoning Band...</div>;
  if (!band) return <div className="text-center text-4xl font-sans text-white mt-20 uppercase">Band not found in the void</div>;

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-64 md:h-96 bg-gray-900 border-b-4 border-accent mb-12 relative overflow-hidden flex items-center justify-center">
        {band.banner_image_url ? (
          <img src={band.banner_image_url} alt={`${band.name} banner`} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-80"></div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-8xl text-white font-sans uppercase mb-2" style={{ textShadow: '4px 4px 0px #ff0033' }}>
              {band.name}
            </h1>
            <p className="text-2xl font-body text-gray-300 font-bold uppercase tracking-widest">
              {band.genre} | {band.city}, {band.country}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info & Events */}
        <div className="lg:col-span-1 space-y-12">
          {/* Bio */}
          <div className="card-brutal">
            <h2 className="text-3xl text-white mb-6 border-b-2 border-gray-800 pb-2">About the Band</h2>
            <p className="text-gray-300 font-body text-lg leading-relaxed whitespace-pre-wrap">{band.bio || 'No bio available.'}</p>
          </div>

          {/* Members */}
          <div className="card-brutal">
            <h2 className="text-3xl text-white mb-6 border-b-2 border-gray-800 pb-2">Lineup</h2>
            {band.members && band.members.length > 0 ? (
              <ul className="space-y-4">
                {band.members.map(member => (
                  <li key={member.id} className="flex justify-between items-center text-lg font-body border-b border-gray-800 pb-2">
                    <span className="text-white font-bold">{member.name}</span>
                    <span className="text-accent uppercase text-sm">{member.instrument || member.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 font-body">No lineup information available.</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="card-brutal border-accent">
            <h2 className="text-3xl text-accent mb-6 border-b-2 border-accent pb-2">Upcoming Gigs</h2>
            {events.length > 0 ? (
              <div className="space-y-6">
                {events.map(event => {
                  const eventDate = new Date(event.event_date);
                  return (
                    <div key={event.id} className="border border-gray-700 p-4 hover:border-accent transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <p className="text-accent font-sans text-xl mb-1">{eventDate.toLocaleDateString()} - {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <h3 className="text-white text-xl uppercase mb-1">{event.title}</h3>
                          <p className="text-gray-400 font-body text-sm uppercase">{event.venue}, {event.city}</p>
                        </div>
                        {event.ticket_link && (
                          <a href={event.ticket_link} target="_blank" rel="noopener noreferrer" className="btn-brutal text-sm px-4 py-2 text-center">
                            Tickets
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 font-body">No upcoming gigs in the crypt.</p>
            )}
          </div>
        </div>

        {/* Right Column: Posts & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl text-white mb-8 border-b-4 border-gray-800 inline-block pb-2">Latest Transmissions</h2>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map(post => (
                <div key={post.id} className="card-brutal">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
                    <div className="w-12 h-12 bg-accent flex items-center justify-center font-sans text-white text-2xl uppercase">
                      {band.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white text-xl uppercase">{band.name}</h3>
                      <p className="text-gray-500 font-body text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto bg-gray-900 px-3 py-1 text-accent border border-gray-700 font-body text-xs uppercase">
                      {post.type.replace('_', ' ')}
                    </div>
                  </div>

                  {post.image_url && (
                    <div className="mb-6 bg-black border border-gray-800">
                      <img src={post.image_url} alt="Post image" className="w-full h-auto max-h-96 object-contain" />
                    </div>
                  )}

                  <p className="text-gray-300 font-body text-lg whitespace-pre-wrap">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-brutal text-center py-16">
              <p className="text-gray-500 font-body text-xl">The band has been silent. No recent transmissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
