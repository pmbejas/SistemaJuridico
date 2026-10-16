'use client';

import React from 'react';
import {
  LayoutDashboard,
  Gavel,
  ClockAlert,
  ListTodo,
  Users,
  ShieldCheck,
  Scale,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PestaniaActiva =
  | 'dashboard'
  | 'expedientes'
  | 'vencimientos'
  | 'tareas'
  | 'clientes'
  | 'auditoria';

interface BarraNavegacionProps {
  pestaniaActiva: PestaniaActiva;
  onCambiarPestania: (pestania: PestaniaActiva) => void;
  cantidadVencimientosUrgentes: number;
  menuMovilAbierto: boolean;
  onCerrarMenuMovil: () => void;
  onAbrirMenuMovil: () => void;
}

export function BarraNavegacion({
  pestaniaActiva,
  onCambiarPestania,
  cantidadVencimientosUrgentes,
  menuMovilAbierto,
  onCerrarMenuMovil,
  onAbrirMenuMovil,
}: BarraNavegacionProps) {
  const { usuarioActual } = useAuth();

  const itemsMenu: { id: PestaniaActiva; etiqueta: string; icono: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', etiqueta: 'Panel Principal', icono: LayoutDashboard },
    { id: 'expedientes', etiqueta: 'Expedientes Judiciales', icono: Gavel },
    {
      id: 'vencimientos',
      etiqueta: 'Plazos y Vencimientos',
      icono: ClockAlert,
      badge: cantidadVencimientosUrgentes > 0 ? cantidadVencimientosUrgentes : undefined,
    },
    { id: 'tareas', etiqueta: 'Tareas del Estudio', icono: ListTodo },
    { id: 'clientes', etiqueta: 'Clientes Patrocinados', icono: Users },
    { id: 'auditoria', etiqueta: 'Auditoría y Control', icono: ShieldCheck },
  ];

  const contenidoNavegacion = (alSeleccionar?: () => void) => (
    <>
      <div>
        {/* Cabecera del Estudio */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                ESTUDIO JURÍDICO
              </h1>
              <p className="text-xs text-sky-400 font-medium">Gestión Forense Integral</p>
            </div>
          </div>

          {alSeleccionar && (
            <button
              onClick={alSeleccionar}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Lista de Navegación */}
        <nav className="p-3 space-y-1">
          {itemsMenu.map((item) => {
            const Icono = item.icono;
            const estaSeleccionado = pestaniaActiva === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onCambiarPestania(item.id);
                  if (alSeleccionar) alSeleccionar();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  estaSeleccionado
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icono
                    className={`w-4 h-4 ${
                      estaSeleccionado ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.etiqueta}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pie de Barra Lateral: Resumen de Rol */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-xs text-slate-400 mb-1">Entorno Activo:</div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {usuarioActual?.sectorOArea || 'Plataforma Forense'}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Barra Lateral de Escritorio (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0 text-slate-300">
        {contenidoNavegacion()}
      </aside>

      {/* 2. Cajón Desplegable para Móviles (Slide-over Drawer) */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Fondo oscuro con desenfoque */}
          <div
            onClick={onCerrarMenuMovil}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Menú lateral flotante */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 h-full flex flex-col justify-between text-slate-300 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {contenidoNavegacion(onCerrarMenuMovil)}
          </aside>
        </div>
      )}

      {/* 3. Barra de Navegación Inferior Móvil (Bottom Navigation Bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onCambiarPestania('dashboard')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
            pestaniaActiva === 'dashboard' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Panel</span>
        </button>

        <button
          onClick={() => onCambiarPestania('expedientes')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
            pestaniaActiva === 'expedientes' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gavel className="w-5 h-5 mb-0.5" />
          <span>Causas</span>
        </button>

        <button
          onClick={() => onCambiarPestania('vencimientos')}
          className={`relative flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
            pestaniaActiva === 'vencimientos' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <ClockAlert className="w-5 h-5 mb-0.5" />
            {cantidadVencimientosUrgentes > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {cantidadVencimientosUrgentes}
              </span>
            )}
          </div>
          <span>Plazos</span>
        </button>

        <button
          onClick={() => onCambiarPestania('tareas')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
            pestaniaActiva === 'tareas' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-5 h-5 mb-0.5" />
          <span>Tareas</span>
        </button>

        <button
          onClick={onAbrirMenuMovil}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-white transition"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Más</span>
        </button>
      </nav>
    </>
  );
}
