'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  if (!user) return <></>;

  return (
    <nav className='bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow'>
      <div className='text-xl font-bold'>LearnDonation</div>

      <div className='flex gap-6 text-sm font-medium'>
        <Link href='/app/campaigns' className='hover:text-blue-400 transition'>
          Campañas
        </Link>
        <Link href='/app/task' className='hover:text-blue-400 transition'>
          Tareas
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className='bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm font-medium'
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
