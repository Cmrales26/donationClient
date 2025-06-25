/* eslint-disable react/no-unescaped-entities */
'use client';

import { config } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function useLogin(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onLogin = async (username: string, password: string) => {
    if (!username || !password) {
      alert('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');
      login({
        access: data.access,
        refresh: data.refresh,
        username: data.username,
        email: data.email,
        role: data.role
      });
      alert('Logged in!');
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { onLogin, loading };
}

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void;
  loading: boolean;
};

function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-gray-900 shadow-md rounded-lg p-8 w-full max-w-sm'
    >
      <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>
      <input
        type='text'
        placeholder='username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className='w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <span>
        <p className='text-sm text-gray-400 mb-4'>
          Don't have an account?{' '}
          <a href='/auth/create' className='text-blue-500 hover:underline'>
            Register
          </a>
        </p>
      </span>
      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/app/dashboard');
  }, [router]);

  const { onLogin, loading } = useLogin(() => {
    window.location.href = '/app/dashboard';
  });

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <LoginForm onSubmit={onLogin} loading={loading} />
    </div>
  );
}
