import React from 'react';

interface CardFormHeaderProps {
  title: string;
  actionClose?: () => void;
  actionOk?: () => void;
  loadingOk?: boolean;
}

const CardFormHeader = ({
  title,
  actionClose,
  actionOk,
  loadingOk = false
}: CardFormHeaderProps) => {
  return (
    <div className='flex justify-between items-center mb-6 p-6'>
      <h2 className='text-xl font-semibold text-white'>{title}</h2>
      <div className='flex gap-2'>
        {actionClose && (
          <button
            type='button'
            onClick={actionClose}
            className='px-3 py-1 rounded bg-transparent text-white border border-white hover:bg-white hover:text-blue-600 
                        transition cursor-pointer'
          >
            Cerrar
          </button>
        )}
        {actionOk && (
          <button
            type='button'
            onClick={actionOk}
            className='px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-300 transition cursor-pointer'
            disabled={loadingOk}
          >
            {loadingOk ? 'Cargando...' : 'OK'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardFormHeader;
