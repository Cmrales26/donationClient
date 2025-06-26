import { SelectTaskStatus } from '@/components/selects/selectTaskStatus';
import { TaskFormData } from '@/models/task';
import { TaskStatus } from '@/models/task';

export function TaskForm({
  form,
  setForm
}: {
  form: TaskFormData;
  setForm: React.Dispatch<React.SetStateAction<TaskFormData>>;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className='grid grid-cols-1 md:grid-cols-2 gap-4 px-6 text-white'>
      <div className='md:col-span-2'>
        <label className='block mb-1 text-sm'>Título</label>
        <input
          name='title'
          type='text'
          value={form.title}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='md:col-span-2'>
        <label className='block mb-1 text-sm'>Descripción</label>
        <textarea
          name='description'
          value={form.description || ''}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={8}
        />
      </div>
      <div>
        <label className='block mb-2 text-sm'>Estado</label>
        <SelectTaskStatus
          showLabel={false}
          showAll={false}
          onChange={value => {
            setForm(prev => ({ ...prev, status: value as TaskStatus }));
          }}
        />
      </div>
      <div>
        <label className='block mb-1 text-sm'>Fecha de entrega</label>
        <input
          name='delivery_date'
          type='date'
          value={form.delivery_date}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
    </form>
  );
}
