'use client';

import React from 'react';
import {
  Gavel,
  ClockAlert,
  ListTodo,
  Users,
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Calendar,
  Building2,
} from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';
import { PestaniaActiva } from './BarraNavegacion';

interface DashboardProps {
  onNavegar: (pestania: PestaniaActiva) => void;
  onSeleccionarExpediente: (expedienteId: string) => void;
}

export function Dashboard({ onNavegar, onSeleccionarExpediente }: DashboardProps) {
  const { expedientes, vencimientos, tareas, clientes } = useExpedientes();
  const { usuarioActual } = useAuth();

  const vencimientosPendientes = vencimientos.filter((v) => !v.cumplido);
  const tareasPendientes = tareas.filter((t) => t.estado !== 'Finalizada');

  // Conteo de causas por fuero
  const causasPorFuero = expedientes.reduce((acc, exp) => {
    acc[exp.fuero] = (acc[exp.fuero] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida y Estado del Estudio */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/30 text-sky-200 border border-blue-400/30 inline-block mb-2">
            Despacho Judicial Activo
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Bienvenido, {usuarioActual?.nombreCompleto}
          </h2>
          <p className="text-xs md:text-sm text-sky-100/90 mt-1">
            Usted está operando con perfil de{' '}
            <span className="font-semibold text-white">{usuarioActual?.tituloProfesional}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavegar('expedientes')}
            className="px-4 py-2 bg-white text-blue-900 font-semibold text-xs rounded-xl shadow-xs hover:bg-sky-50 transition flex items-center space-x-1.5"
          >
            <span>Ver Causas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alerta de Vencimiento Inminente (Si hay plazos fatales) */}
      {vencimientosPendientes.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 shadow-2xs">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Atención: Plazos Perentorios en Curso
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Hay <span className="font-bold">{vencimientosPendientes.length} término(s) judicial(es) pendiente(s)</span>. Revise la agenda procesal para evitar preclusión de instancias.
            </p>
          </div>
          <button
            onClick={() => onNavegar('vencimientos')}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 underline shrink-0 mt-0.5"
          >
            Controlar plazos →
          </button>
        </div>
      )}

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Expedientes */}
        <div
          onClick={() => onNavegar('expedientes')}
          className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Expedientes Activos
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{expedientes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span className="text-blue-600 font-semibold">100%</span>
            <span>radicados con seguimiento</span>
          </div>
        </div>

        {/* Métrica 2: Vencimientos */}
        <div
          onClick={() => onNavegar('vencimientos')}
          className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-rose-300 hover:shadow-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Vencimientos Fatales
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{vencimientosPendientes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {vencimientosPendientes.filter((v) => v.nivelCriticidad === 'Alta').length} con criticidad alta
          </div>
        </div>

        {/* Métrica 3: Tareas */}
        <div
          onClick={() => onNavegar('tareas')}
          className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-sky-300 hover:shadow-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tareas del Estudio
            </span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{tareasPendientes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Diligencias en curso en tribunales</div>
        </div>

        {/* Métrica 4: Clientes */}
        <div
          onClick={() => onNavegar('clientes')}
          className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Clientes Titulares
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">{clientes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Patrocinios activos en cartera</div>
        </div>
      </div>

      {/* Sección Inferior: Distribución por Fueros y Últimas Actuaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por Fueros */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Radicación por Fueros</h3>
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(causasPorFuero).map(([fuero, cantidad]) => (
              <div key={fuero} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{fuero}</span>
                  <span className="font-bold text-slate-900">{cantidad} causa(s)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(cantidad / expedientes.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Actuaciones y Movimientos */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Cronología Procesal Reciente</h3>
            </div>
            <button
              onClick={() => onNavegar('expedientes')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Ver todas las causas →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {expedientes.slice(0, 4).map((exp) => {
              const ultimoMov = exp.movimientos[exp.movimientos.length - 1];

              return (
                <div
                  key={exp.id}
                  onClick={() => onSeleccionarExpediente(exp.id)}
                  className="py-3 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {exp.numeroCausa}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {exp.caratula}
                      </span>
                    </div>

                    {ultimoMov && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        <span className="font-medium text-slate-700">{ultimoMov.tipoActuacion}:</span>{' '}
                        {ultimoMov.titulo}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{ultimoMov?.fechaActuacion || exp.fechaApertura}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
