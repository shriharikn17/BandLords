'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import { useCart } from '@/context/CartContext';

interface MerchItem {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    type: string;
    image_url: string;
    stock_quantity: number;
    band_name: string;
    band_id: string;
}

export default function MerchPage() {
    const [merch, setMerch] = useState<MerchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMerch = async () => {
            try {
                const res = await fetch(`${API_URL}/merch`);
                if (!res.ok) throw new Error('Failed to load merch');
                const data = await res.json();
                setMerch(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMerch();
    }, []);

    if (loading) return <div className="text-center text-2xl font-sans text-accent uppercase mt-20">Loading Merch...</div>;
    if (error) return <div className="text-red-500 font-bold mb-4">{error}</div>;

    return (
        <div>
            <h1 className="text-5xl md:text-6xl text-white mb-4 uppercase">Merch <span className="text-accent">Store</span></h1>
            <p className="text-xl text-gray-400 font-body mb-12">Support the bands. Wear the armor.</p>

            {merch.length === 0 ? (
                <div className="text-gray-500 font-body text-xl">No merch available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {merch.map((item) => (
                        <div key={item.id} className="card-brutal flex flex-col items-start h-full">
                            <div className="w-full aspect-square bg-black border-2 border-gray-800 mb-6 flex items-center justify-center overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-sans text-gray-700 text-3xl uppercase">{item.type || 'Gear'}</span>
                                )}
                            </div>
                            <p className="text-accent font-sans text-lg uppercase tracking-wider mb-2">{item.band_name}</p>
                            <h3 className="text-2xl text-white mb-4 leading-tight">{item.name}</h3>
                            <p className="text-gray-400 font-body mb-6 flex-grow">{item.description}</p>

                            <div className="w-full mt-auto flex items-end justify-between border-t border-gray-800 pt-6">
                                <p className="font-sans text-3xl">{item.currency || 'USD'} {Number(item.price).toFixed(2)}</p>

                                {item.stock_quantity > 0 ? (
                                    <button
                                        onClick={() => {
                                            addToCart({
                                                merch_id: item.id,
                                                name: item.name,
                                                price: Number(item.price),
                                                quantity: 1,
                                                band_name: item.band_name,
                                                image_url: item.image_url
                                            });
                                            alert(`Added ${item.name} to cart!`);
                                        }}
                                        className="btn-brutal text-lg py-2"
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <span className="text-red-500 font-bold uppercase font-sans border-2 border-red-900 border-dashed px-4 py-2">Sold Out</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
