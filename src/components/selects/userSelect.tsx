/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { UserData } from '@/models/userData';
import { useEffect, useState } from 'react';

interface UserSelectProps {
  value: number;
  onChange: (value: number) => void;
  queryParams?: Record<string, string | number>;
}

const UserSelect = ({ value, queryParams, onChange }: UserSelectProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <label className='block mb-1 text-sm'>Usuario</label>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={loading}
        className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <option value=''>Seleccione un usuario</option>
        {users.map(user => {
          const displayName =
            user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username;

          return (
            <option key={user.id} value={user.id} className='text-black'>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default UserSelect;
