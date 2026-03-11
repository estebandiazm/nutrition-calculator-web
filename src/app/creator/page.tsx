'use client';

import React from 'react';
import ClientProvider from '../../context/ClientContext';
import Creator from '../../components/creator/Creator';

export default function CreatorPage() {
  return (
    <ClientProvider>
      <Creator />
    </ClientProvider>
  );
}
