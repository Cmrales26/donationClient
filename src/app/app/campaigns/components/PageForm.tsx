import UserSelect from '@/components/selects/userSelect';
import { useAuth } from '@/context/AuthContext';
import { CampaignFormData } from '@/models/campaign';

export function CampaignForm({
  form,
  setForm
}: {
  form: CampaignFormData;
  setForm: React.Dispatch<React.SetStateAction<CampaignFormData>>;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const { user } = useAuth();

  return (
    <form className='grid grid-cols-1 md:grid-cols-2 gap-4 px-6 text-white'>
      <div>
        <label className='block mb-1 text-sm'>Nombre</label>
        <input
          name='name'
          type='text'
          disabled={!!user?.role && user.role !== 'Administrador'}
          value={form.name}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div>
        <UserSelect
          queryParams={{ user_grup: 2 }}
          value={form.user}
          disabled={!!user?.role && user.role !== 'Administrador'}
          onChange={id => setForm(prev => ({ ...prev, user: id }))}
        />
      </div>
      <div className='md:col-span-2'>
        <label className='block mb-1 text-sm'>Descripción</label>
        <textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={8}
          disabled={!!user?.role && user.role !== 'Administrador'}
        />
      </div>
      <div>
        <label className='block mb-1 text-sm'>Fecha de inicio</label>
        <input
          name='start_date'
          type='date'
          value={form.start_date}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={!!user?.role && user.role !== 'Administrador'}
        />
      </div>
      <div>
        <label className='block mb-1 text-sm'>Fecha de Cierre</label>
        <input
          name='end_date'
          type='date'
          value={form.end_date}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={!!user?.role && user.role !== 'Administrador'}
        />
      </div>
    </form>
  );
}
