/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CardStyled from '@/components/CardStyled';
import CardFormHeader from '@/components/CardFormHeader';

import { config } from '@/constants/config';
import { CampaignFormData } from '@/models/campaign';
import { useAuth } from '@/context/AuthContext';
import { CampaignForm } from '../components/PageForm';
import { SelectCompaignStatus } from '@/components/selects/selectCompaignsStatus';
import NoAdminHide from '@/components/NoAdminHide';

function useCampaignForm(onSuccess: () => void) {
  const [form, setForm] = useState<CampaignFormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    user: 0
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();

  const validate = (data: CampaignFormData) =>
    !!(
      data.name.trim() &&
      data.description.trim() &&
      data.start_date &&
      data.end_date &&
      data.user
    );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    fetch(`${config.apiBaseUrl}/campaign/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          description: data.description || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          user: data.user || 0,
          status: data.status
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading campaign:', err);
        setLoading(false);
      });
  }, []);

  const submit = async () => {
    if (!validate(form)) {
      alert('Por favor complete todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${config.apiBaseUrl}/campaign/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert('Se editó la campaña correctamente.');
        onSuccess();
      } else {
        alert('Error al editar la campaña.');
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
    submit
  };
}

export default function EditCampaignPage() {
  const router = useRouter();
  const onSuccess = () => {
    router.push('/app/campaigns');
  };
  const { id } = useParams();

  const { form, setForm, loading, submit } = useCampaignForm(onSuccess);
  const { user } = useAuth();

  const handleCancel = () => {
    router.push('/app/campaigns');
    setForm({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      user: 0
    });
  };

  const onChangeStatus = (status: CampaignFormData['status']) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token not found');
      return;
    }
    fetch(`${config.apiBaseUrl}/campaign/${id}/update-status/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(data => {
        setForm(prev => ({ ...prev, ...data }));
      })
      .catch(err => {
        alert('Error al actualizar el estado');
        console.error(err);
      });
  };

  return (
    <CardStyled>
      <CardFormHeader
        title='Editar Campaña'
        loadingOk={loading}
        actionOk={user?.role === 'Administrador' ? submit : undefined}
        actionClose={handleCancel}
      />
      <CampaignForm form={form} setForm={setForm} />
      <NoAdminHide>
        <div className='my-6 flex align-center gap-2.5 px-6'>
          <h1 className='mt-1'>Cambiar Estado:</h1>
          <SelectCompaignStatus
            onChange={value =>
              onChangeStatus(value as CampaignFormData['status'])
            }
            value={form.status ? form.status : 'active'}
          />
        </div>
      </NoAdminHide>
    </CardStyled>
  );
}
