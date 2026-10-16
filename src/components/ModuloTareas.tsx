'use client';

import React, { useState } from 'react';
import {
  ListTodo,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';
import { EstadoTarea, PrioridadTarea, TareaOperativa } from '../types';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

export function ModuloTareas() {
  const { tareas, expedientes, alternarEstadoTarea, agregarTarea } = useExpedientes();
  const { usuarioActual } = useAuth();

  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Formulario nueva tarea
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [expedienteId, setExpedienteId] = useState(expedientes[0]?.id || '');
  const [asignadaA, setAsignadaA] = useState('Alejo Salas');
  const [prioridad, setPrioridad] = useState<PrioridadTarea>('Normal');
  const [fechaCompromiso, setFechaCompromiso] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')
  );

  const tareasFiltradas = tareas.filter((t) =>
    filtroEstado === 'TODAS' ? true : t.estado === filtroEstado
  );

  const manejarCrearTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !usuarioActual) return;

    const expVinculado = expedientes.find((e) => e.id === expedienteId);

    agregarTarea(
      {
        titulo: titulo.trim(),
        descripcionDetallada: descripcion.trim() || 'Gestión operativa del estudio.',
        expedienteId: expVinculado?.id,
        numeroCausa: expVinculado?.numeroCausa,
        asignadaANombre: asignadaA,
        nivelPrioridad: prioridad,
        estado: 'Pendiente',
        fechaCompromiso: fechaCompromiso,
      },
      usuarioActual
    );

    setTitulo('');
    setDescripcion('');
    setModalAbierto(false);
  };

  const badgeEstado = (estado: EstadoTarea) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'En Curso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finalizada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const badgePrioridad = (p: PrioridadTarea) => {
    switch (p) {
      case 'Urgente':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Normal':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'Secundaria':
        return 'text-sky-600 bg-sky-50 border-sky-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros y Acción */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 mr-2 uppercase text-[11px]">Estado:</span>
          {['TODAS', 'Pendiente', 'En Curso', 'Finalizada'].map((est) => (
            <button
              key={est}
              onClick={() => setFiltroEstado(est)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filtroEstado === est
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {est === 'TODAS' ? 'Todas las Tareas' : est}
            </button>
          ))}
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Listado de Tareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tareasFiltradas.map((tar) => (
          <div
            key={tar.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 shadow-2xs transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgePrioridad(
                    tar.nivelPrioridad
                  )}`}
                >
                  Prioridad {tar.nivelPrioridad}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeEstado(
                    tar.estado
                  )}`}
                >
                  {tar.estado}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 tracking-tight">{tar.titulo}</h4>

              <p className="text-xs text-slate-600 leading-relaxed">{tar.descripcionDetallada}</p>

              {tar.numeroCausa && (
                <div className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md inline-block">
                  Causa: {tar.numeroCausa}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="space-y-0.5">
                <div>
                  Asignada a: <strong className="text-slate-800">{tar.asignadaANombre}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Por: {tar.encomendadaPorNombre} • Límite: {tar.fechaCompromiso}
                </div>
              </div>

              <button
                onClick={() => {
                  if (usuarioActual) alternarEstadoTarea(tar.id, usuarioActual);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-700 transition flex items-center space-x-1"
                title="Avanzar de estado"
              >
                <span>Avanzar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Tarea */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Encomendar Nueva Tarea</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarCrearTarea} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Gestión:</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Diligenciar oficio en el Registro de la Propiedad"
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detalle de Instrucciones:</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  placeholder="Indicaciones precisas para el cumplimiento de la diligencia..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asignar a:</label>
                  <select
                    value={asignadaA}
                    onChange={(e) => setAsignadaA(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {USUARIOS_MOCK.map((u) => (
                      <option key={u.id} value={u.nombreCompleto}>
                        {u.nombreCompleto} ({u.rol === 'PROCURADOR' ? 'Procurador' : 'Abogado'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridad:</label>
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as PrioridadTarea)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Normal">Normal</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Asignar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

