'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ExpedientesProvider } from '../context/ExpedientesContext';

export function ProveedoresApp({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ExpedientesProvider>{children}</ExpedientesProvider>
    </AuthProvider>
  );
}
