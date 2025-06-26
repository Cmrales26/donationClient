import { TaskStatus } from '@/models/task';

interface FilterStatusProps {
  value?: string;
  onChange: (value: string) => void;
  showLabel?: boolean;
  showAll?: boolean;
}

export const SelectTaskStatus = ({
  value,
  onChange,
  showLabel = true,
  showAll = true
}: FilterStatusProps) => {
  return (
    <div>
      {showLabel && <label className='mb-2'>Estado</label>}
      <select
        value={value || undefined}
        onChange={e => onChange(e.target.value)}
        className='p-2 rounded border text-white block w-full'
      >
        {showAll && (
          <option className='text-black' value=''>
            Todos
          </option>
        )}

        {Object.values(TaskStatus).map(status => (
          <option key={status} value={status} className='text-black'>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
