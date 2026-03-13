const IS_PROD = process.env.NODE_ENV === 'production';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (IS_PROD ? '/api' : 'http://localhost:5000/api');

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
};
