import type { Metadata } from 'next';
import './globals.css';
import { ProveedoresApp } from '../components/ProveedoresApp';

export const metadata: Metadata = {
  title: 'Estudio Jurídico — Sistema de Gestión de Expedientes y Plazos',
  description: 'Plataforma integral para administración de causas judiciales, control de términos perentorios y custodia documental criptográfica.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
        <ProveedoresApp>{children}</ProveedoresApp>
      </body>
    </html>
  );
}
