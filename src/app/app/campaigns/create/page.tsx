'use client';

import CardFormHeader from '@/components/CardFormHeader';
import CardStyled from '@/components/CardStyled';
import { config } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { CampaignFormData } from '@/models/campaign';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignForm } from '../components/PageForm';

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

  const validate = (data: CampaignFormData) =>
    !!(
      data.name.trim() &&
      data.description.trim() &&
      data.start_date &&
      data.end_date &&
      data.user
    );

  const submit = async () => {
    if (!validate(form)) {
      alert('Por favor complete todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${config.apiBaseUrl}/campaign/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert('Se creó la campaña correctamente.');
        onSuccess();
      } else {
        alert('Error al crear la campaña.');
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

const CreateCampaign = () => {
  const router = useRouter();

  const onSuccess = () => {
    router.push('/app/campaigns');
  };
  const { form, setForm, loading, submit } = useCampaignForm(onSuccess);

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

  return (
    <CardStyled>
      <CardFormHeader
        title='Crear Compaña'
        actionOk={submit}
        actionClose={handleCancel}
        loadingOk={loading}
      />
      <CampaignForm form={form} setForm={setForm} />
    </CardStyled>
  );
};

export default CreateCampaign;
