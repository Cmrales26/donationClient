'use client';

import { useState } from 'react';
import { config } from '@/constants/config';

interface AccountFormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const initialForm: AccountFormData = {
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: ''
};

function useAccountForm(onSuccess: () => void) {
  const [form, setForm] = useState<AccountFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AccountFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(form).some(v => !v)) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await createAccount(form);
      alert('Account created! You can now log in.');
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { form, handleChange, handleSubmit, loading };
}

async function createAccount(data: AccountFormData) {
  const response = await fetch(`${config.apiBaseUrl}/user/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.detail || 'Account creation failed');
}

function AccountForm({
  form,
  onChange,
  onSubmit,
  loading
}: {
  form: AccountFormData;
  onChange: (field: keyof AccountFormData, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className='bg-gray-900 shadow-md rounded-lg p-8 w-full max-w-sm'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Create Account</h1>
      <input
        placeholder='Username'
        value={form.username}
        onChange={e => onChange('username', e.target.value)}
        className='w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        placeholder='Email'
        type='email'
        value={form.email}
        onChange={e => onChange('email', e.target.value)}
        className='w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        placeholder='Password'
        type='password'
        value={form.password}
        onChange={e => onChange('password', e.target.value)}
        className='w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        placeholder='First Name'
        value={form.first_name}
        onChange={e => onChange('first_name', e.target.value)}
        className='w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        placeholder='Last Name'
        value={form.last_name}
        onChange={e => onChange('last_name', e.target.value)}
        className='w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
      >
        {loading ? 'Creating...' : 'Create Account'}
      </button>
    </div>
  );
}

export default function CreateAccountPage() {
  const { form, handleChange, handleSubmit, loading } = useAccountForm(() => {
    window.location.href = '/auth/login';
  });

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <AccountForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
