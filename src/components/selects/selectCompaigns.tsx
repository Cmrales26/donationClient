import { Campaign } from '@/models/campaign';
import { useEffect, useState } from 'react';

/* eslint-disable react-hooks/exhaustive-deps */

interface CampaignSelectProps {
  value: number;
  onChange: (value: number) => void;
  queryParams?: Record<string, string | number>;
}

const CampaignSelect = ({
  value,
  queryParams,
  onChange
}: CampaignSelectProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaign?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <label className=''>Campaña</label>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={loading}
        className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <option value=''>Seleccione una campaña</option>
        {campaigns.map(campaign => (
          <option key={campaign.id} value={campaign.id} className='text-black'>
            {campaign.name} - {campaign.status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampaignSelect;
