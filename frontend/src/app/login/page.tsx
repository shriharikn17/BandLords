'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setToken, fetchWithAuth } from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetchWithAuth('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setToken(data.token);

            // Store user info briefly for frontend usage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'band') {
                router.push('/dashboard');
            } else {
                router.push('/bands');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="card-brutal">
                <h1 className="text-4xl text-accent mb-6 font-sans uppercase">Login</h1>
                <p className="text-gray-400 mb-8 font-body">Enter the void. Welcome back.</p>

                {error && (
                    <div className="bg-red-900/50 border-l-4 border-accent p-4 mb-6">
                        <p className="text-white">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-white font-sans text-xl mb-2 uppercase" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-brutal w-full"
                            placeholder="you@underground.com"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-sans text-xl mb-2 uppercase" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-brutal w-full"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-brutal w-full mt-8"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entering...' : 'Login'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-accent hover:underline font-bold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
