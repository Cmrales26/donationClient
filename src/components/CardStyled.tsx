'use client';

import React from 'react';

type CardStyledProps = {
  children: React.ReactNode;
};

const CardStyled = ({ children }: CardStyledProps) => {
  return (
    <div className='min-h-[calc(100vh-2rem*2)] m-7 p-6 bg-gray-900 rounded-xl box-border'>
      {children}
    </div>
  );
};

export default CardStyled;
