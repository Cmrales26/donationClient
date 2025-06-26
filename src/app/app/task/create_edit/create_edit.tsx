import CardFormHeader from '@/components/CardFormHeader';
import CardStyled from '@/components/CardStyled';
import { config } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { Task, TaskFormData, TaskStatus } from '@/models/task';
import React, { useEffect } from 'react';
import { TaskForm } from '../components/pageForm';

function useTaskForm(
  campaignId: number,
  actionMode: 'create' | 'edit' = 'create',
  seletedTask_id?: number,
  setnewTask?: (task: Task) => void,
  onSuccess?: () => void
) {
  const [form, setForm] = React.useState<TaskFormData>({
    title: '',
    description: '',
    status: TaskStatus.Pending,
    delivery_date: '',
    campaign: campaignId
  });

  useEffect(() => {
    setForm({
      title: '',
      description: '',
      status: TaskStatus.Pending,
      delivery_date: '',
      campaign: campaignId
    });
  }, [campaignId]);

  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();

  const validate = (data: TaskFormData) =>
    !!(
      data.title.trim() &&
      typeof data.description === 'string' &&
      data.description.trim() &&
      data.delivery_date &&
      data.campaign
    );

  const submit = async () => {
    if (!validate(form)) {
      alert('Por favor complete todos los campos.');
      return;
    }
    setLoading(true);
    try {
      let res: Response;
      if (actionMode === 'edit' && seletedTask_id) {
        res = await fetch(`${config.apiBaseUrl}/tasks/${seletedTask_id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.access}`
          },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${config.apiBaseUrl}/tasks/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.access}`
          },
          body: JSON.stringify(form)
        });
      }
      if (res.ok) {
        const data = await res.json();
        if (setnewTask) setnewTask(data);
        setForm({
          title: '',
          description: '',
          status: TaskStatus.Pending,
          delivery_date: '',
          campaign: campaignId
        });
        onSuccess?.();
        alert(
          actionMode === 'edit'
            ? 'Se editó la tarea correctamente.'
            : 'Se creó la tarea correctamente.'
        );
      } else {
        alert(
          actionMode === 'edit'
            ? 'Error al editar la tarea.'
            : 'Error al crear la tarea.'
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    validate,
    submit
  };
}

interface CreateTaskProps {
  campaignId: number;
  actionMode: 'create' | 'edit';
  selectedTask?: Task | null;
  setnewTask?: (task: Task) => void;
  setEdited?: (value: boolean) => void;
  hideForm?: (value: boolean) => void;
}
const CreateTask = ({
  campaignId,
  actionMode,
  selectedTask,
  setnewTask,
  setEdited,
  hideForm
}: CreateTaskProps) => {
  const onSuccess = () => {
    if (setEdited) setEdited(false);
  };
  const { form, setForm, loading, submit } = useTaskForm(
    campaignId,
    actionMode,
    selectedTask?.id,
    setnewTask,
    onSuccess
  );

  useEffect(() => {
    if (actionMode === 'edit' && selectedTask) {
      setForm({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        delivery_date: selectedTask.delivery_date,
        campaign: campaignId
      });
    }
  }, [actionMode, campaignId, selectedTask, setForm]);

  const handleCancel = () => {
    if (setEdited) setEdited(false);
    if (hideForm) hideForm(true);
    setForm({
      title: '',
      description: '',
      status: TaskStatus.Pending,
      delivery_date: '',
      campaign: campaignId
    });
  };

  return (
    <CardStyled>
      <CardFormHeader
        title={`${actionMode === 'edit' ? 'Editar' : 'Crear'} Tarea${
          campaignId ? `: Campaña - ${campaignId}` : ''
        }`}
        actionOk={submit}
        actionClose={handleCancel}
        loadingOk={loading}
      />
      <TaskForm form={form} setForm={setForm} />
    </CardStyled>
  );
};

export default CreateTask;
