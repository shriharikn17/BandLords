'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { setToken, fetchWithAuth } from '@/lib/api';

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'fan' | 'band'>('fan');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'band') {
            setRole('band');
        }
    }, [searchParams]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetchWithAuth('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

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
                <h1 className="text-4xl text-accent mb-6 font-sans uppercase">Join the Scene</h1>
                <p className="text-gray-400 mb-8 font-body">Create an account to support or tear down the house.</p>

                {error && (
                    <div className="bg-red-900/50 border-l-4 border-accent p-4 mb-6">
                        <p className="text-white">{error}</p>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('fan')}
                            className={`flex-1 py-3 font-sans text-xl uppercase transition-all border-2 ${role === 'fan' ? 'bg-accent border-accent text-white' : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}
                        >
                            Fan
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('band')}
                            className={`flex-1 py-3 font-sans text-xl uppercase transition-all border-2 ${role === 'band' ? 'bg-accent border-accent text-white' : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}
                        >
                            Band
                        </button>
                    </div>

                    <div>
                        <label className="block text-white font-sans text-xl mb-2 uppercase" htmlFor="name">
                            {role === 'band' ? 'Band Name' : 'Your Name'}
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-brutal w-full"
                            placeholder={role === 'band' ? 'Black Sabbath' : 'John Doe'}
                        />
                    </div>

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
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-brutal w-full mt-8"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Forging...' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-accent hover:underline font-bold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="text-center text-accent font-sans text-2xl mt-20">Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
