'use client';

import CardCampaign from '@/components/CardCampaign';
import NoAdminHide from '@/components/NoAdminHide';
import { SelectCompaignStatus } from '@/components/selects/selectCompaignsStatus';
import { config } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { Campaign } from '@/models/campaign';
import { useEffect, useState } from 'react';

async function fetchCampaigns(
  token: string,
  status: string
): Promise<Campaign[]> {
  const response = await fetch(
    `${config.apiBaseUrl}/campaign?status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  return response.json();
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('active');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.assign('/auth/login');
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCampaigns(token, status)
      .then(setCampaigns)
      .catch(error => {
        console.error('Error fetching campaigns:', error);
      })
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className='p-6 m-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-bold text-white'>CAMPAÑAS</h1>
        <div className='flex gap-4 items-center'>
          <SelectCompaignStatus value={status} onChange={setStatus} />
          <NoAdminHide>
            <button
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => window.location.assign('/app/campaigns/create')}
              type='button'
            >
              Crear campaña
            </button>
          </NoAdminHide>
        </div>
      </div>

      {loading ? (
        <p className='text-gray-300'>Cargando campañas...</p>
      ) : campaigns.length === 0 ? (
        <p className='text-gray-600'>No campaigns found.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {campaigns.map(campaign => (
            <CardCampaign key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
