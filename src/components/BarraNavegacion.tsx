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
}

export function BarraNavegacion({
  pestaniaActiva,
  onCambiarPestania,
  cantidadVencimientosUrgentes,
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

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 text-slate-300">
      <div>
        {/* Cabecera del Estudio */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
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

        {/* Lista de Navegación */}
        <nav className="p-3 space-y-1">
          {itemsMenu.map((item) => {
            const Icono = item.icono;
            const estaSeleccionado = pestaniaActiva === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onCambiarPestania(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
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
    </aside>
  );
}
