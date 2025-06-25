import { CampaignStatus } from '@/models/campaign';

interface FilterStatusProps {
  value: string;
  onChange: (value: string) => void;
}

export const SelectCompaignStatus = ({
  value,
  onChange
}: FilterStatusProps) => {
  return (
    <div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className='p-2 rounded border text-white'
      >
        {Object.values(CampaignStatus).map(status => (
          <option key={status} value={status} className='text-black'>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
