/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      router.push('/app/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, []);

  return null;
}
