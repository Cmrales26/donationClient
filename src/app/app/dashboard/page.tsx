/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import DashboardCard from '@/components/CardMetricsNumber';
import { useAuth } from '@/context/AuthContext';
import { Metrics } from '@/models/metrics';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user, loaded } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (loaded && !user) {
      redirect('/auth/login');
    } else if (user && user.role !== 'Administrador') {
      redirect('/app/campaigns');
    } else {
      fetchMetrics();
    }
  }, [user, loaded]);

  const fetchMetrics = async () => {
    try {
      if (!user) {
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/metrics`,
        {
          headers: {
            Authorization: `Bearer ${user.access}`
          }
        }
      );
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  if (!metrics) {
    return (
      <div className='text-white text-center mt-10'>Cargando métricas...</div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 p-6'>
      <DashboardCard
        title='Usuarios'
        value={metrics.total_users}
        bgColor='bg-gray-800'
      />
      <DashboardCard
        title='Campañas'
        value={metrics.total_campaigns}
        bgColor='bg-gray-800'
      />
      <DashboardCard
        title='Tareas'
        value={metrics.total_tasks}
        bgColor='bg-gray-800'
      />
    </div>
  );
};

export default Dashboard;
