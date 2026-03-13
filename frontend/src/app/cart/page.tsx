'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, total, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setError('');

        try {
            const formattedItems = items.map(item => ({
                merch_id: item.merch_id,
                quantity: item.quantity
            }));

            const res = await fetchWithAuth('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    items: formattedItems,
                    total_amount: total
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            setSuccess(true);
            clearCart();
        } catch (err: any) {
            if (err.message.includes('No token')) {
                setError('You must be logged in to checkout. Please login first.');
            } else {
                setError(err.message);
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto mt-20 text-center card-brutal p-12">
                <h1 className="text-5xl text-accent font-sans uppercase mb-6">Order Confirmed</h1>
                <p className="text-xl text-gray-400 font-body mb-8">
                    Your order has been placed successfully. Support the scene!
                </p>
                <div className="flex justify-center gap-6">
                    <Link href="/merch" className="btn-brutal bg-black border-2 border-accent text-accent">
                        Back to Store
                    </Link>
                    <Link href="/dashboard" className="btn-brutal">
                        My Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl text-white mb-12 uppercase">Your <span className="text-accent">Cart</span></h1>

            {error && (
                <div className="bg-red-900/50 border-l-4 border-accent p-4 mb-8">
                    <p className="text-white mb-2">{error}</p>
                    {error.includes('login') && (
                        <Link href="/login" className="text-accent underline font-bold">Go to Login</Link>
                    )}
                </div>
            )}

            {items.length === 0 ? (
                <div className="card-brutal text-center py-16">
                    <p className="text-2xl text-gray-500 font-sans uppercase mb-6">Your cart is empty.</p>
                    <Link href="/merch" className="btn-brutal inline-block">Browse Gear</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.merch_id} className="card-brutal flex gap-6 p-4">
                                <div className="w-24 h-24 bg-black border border-gray-800 flex-shrink-0 flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs uppercase text-gray-600 font-sans">Gear</span>
                                    )}
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl text-white font-sans uppercase flex justify-between">
                                            {item.name}
                                            <span className="text-accent font-bold">x{item.quantity}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 font-body mb-2">{item.band_name}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="font-sans text-xl">USD {(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeFromCart(item.merch_id)}
                                            className="text-gray-500 hover:text-accent underline text-sm uppercase font-bold tracking-widest transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card-brutal sticky top-28 bg-black">
                            <h2 className="text-2xl border-b-2 border-gray-800 pb-4 mb-6 font-sans uppercase">Order Summary</h2>

                            <div className="flex justify-between mb-4 font-body text-gray-400">
                                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span>USD {total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-6 font-body text-gray-400">
                                <span>Shipping</span>
                                <span>Calculated Later</span>
                            </div>

                            <div className="flex justify-between border-t-2 border-accent pt-6 mb-8">
                                <span className="text-xl font-sans uppercase">Total</span>
                                <span className="text-3xl text-accent font-sans">USD {total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="btn-brutal w-full py-4 text-2xl"
                            >
                                {isCheckingOut ? 'Processing...' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
