'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpedientes } from '../context/ExpedientesContext';
import { LoginModal } from '../components/LoginModal';
import { BarraNavegacion, PestaniaActiva } from '../components/BarraNavegacion';
import { BarraSuperior } from '../components/BarraSuperior';
import { Dashboard } from '../components/Dashboard';
import { ModuloExpedientes } from '../components/ModuloExpedientes';
import { ModuloVencimientos } from '../components/ModuloVencimientos';
import { ModuloTareas } from '../components/ModuloTareas';
import { ModuloClientes } from '../components/ModuloClientes';
import { ModuloAuditoria } from '../components/ModuloAuditoria';

export default function PaginaPrincipal() {
  const { estaAutenticado } = useAuth();
  const { vencimientos } = useExpedientes();

  const [pestaniaActiva, setPestaniaActiva] = useState<PestaniaActiva>('dashboard');
  const [expedienteSeleccionadoId, setExpedienteSeleccionadoId] = useState<string | null>(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Si no está autenticado, renderiza pantalla de login limpia
  if (!estaAutenticado) {
    return <LoginModal />;
  }

  const cantidadVencimientosUrgentes = vencimientos.filter(
    (v) => !v.cumplido && v.nivelCriticidad === 'Alta'
  ).length;

  const obtenerTituloVista = () => {
    switch (pestaniaActiva) {
      case 'dashboard':
        return 'Panel de Control Forense';
      case 'expedientes':
        return 'Expedientes y Causas Judiciales';
      case 'vencimientos':
        return 'Control de Vencimientos Fatales';
      case 'tareas':
        return 'Tareas y Diligencias del Despacho';
      case 'clientes':
        return 'Directorio de Clientes Patrocinados';
      case 'auditoria':
        return 'Bitácora Inmutable de Auditoría';
      default:
        return 'Gestión Jurídica';
    }
  };

  const irAExpediente = (id: string) => {
    setExpedienteSeleccionadoId(id);
    setPestaniaActiva('expedientes');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Barra de Navegación Lateral (Desktop y Drawer Móvil) */}
      <BarraNavegacion
        pestaniaActiva={pestaniaActiva}
        onCambiarPestania={(nuevaPestania) => {
          setPestaniaActiva(nuevaPestania);
          if (nuevaPestania !== 'expedientes') {
            setExpedienteSeleccionadoId(null);
          }
        }}
        cantidadVencimientosUrgentes={cantidadVencimientosUrgentes}
        menuMovilAbierto={menuMovilAbierto}
        onCerrarMenuMovil={() => setMenuMovilAbierto(false)}
        onAbrirMenuMovil={() => setMenuMovilAbierto(true)}
      />

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barra Superior con Perfil, Switcher de Roles y Botón Salir */}
        <BarraSuperior
          tituloVista={obtenerTituloVista()}
          onAbrirMenuMovil={() => setMenuMovilAbierto(true)}
        />

        {/* Área de Contenido Dinámico con padding inferior para no solaparse con la barra móvil */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 pb-24 lg:pb-8 bg-slate-50/70">
          <div className="max-w-7xl mx-auto">
            {pestaniaActiva === 'dashboard' && (
              <Dashboard
                onNavegar={(p) => setPestaniaActiva(p)}
                onSeleccionarExpediente={irAExpediente}
              />
            )}

            {pestaniaActiva === 'expedientes' && (
              <ModuloExpedientes
                expedienteSeleccionadoId={expedienteSeleccionadoId}
                onLimpiarSeleccion={() => setExpedienteSeleccionadoId(null)}
              />
            )}

            {pestaniaActiva === 'vencimientos' && <ModuloVencimientos />}

            {pestaniaActiva === 'tareas' && <ModuloTareas />}

            {pestaniaActiva === 'clientes' && <ModuloClientes />}

            {pestaniaActiva === 'auditoria' && <ModuloAuditoria />}
          </div>
        </main>
      </div>
    </div>
  );
}
