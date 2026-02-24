'use client';

import React from 'react';
import ClientProvider from '../context/ClientContext';
import Creator from '../components/creator/Creator';

export default function HomePage() {
  return (
    <ClientProvider>
      <Creator />
    </ClientProvider>
  );
}