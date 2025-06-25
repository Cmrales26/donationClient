import { Campaign } from '@/models/campaign';
import { useRouter } from 'next/navigation';
import React from 'react';

export interface CardCampaignProps {
  campaign: Campaign;
}

const CardCampaign = ({ campaign }: CardCampaignProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/app/campaigns/${campaign.id}`);
  };
  return (
    <div
      className='rounded-xl p-4 bg-gray-900 hover:shadow-lg hover:scale-105 transition duration-300 w-full 
                 max-w-md mx-auto cursor-pointer'
      onClick={handleClick}
    >
      <h2 className='text-xl font-semibold text-shadow-white mb-2'>
        {campaign.name}
      </h2>
      <p className='text-sm text-white mb-1'>{campaign.description}</p>

      <div className='text-sm text-white mb-2'>
        <span className='font-medium'>Inicio:</span> {campaign.start_date}
        <br />
        <span className='font-medium'>Fin:</span> {campaign.end_date}
        <br />
        <span className='font-medium'>Estado:</span> {campaign.status}
      </div>

      <div className='text-sm text-white-600'>
        <span className='font-medium'>Beneficiario:</span>{' '}
        {`${campaign.user_data.first_name} ${campaign.user_data.last_name}`} (
        {campaign.user_data.email})
      </div>
    </div>
  );
};

export default CardCampaign;
