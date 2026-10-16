'use client';

import React, { useState } from 'react';
import {
  FolderPlus,
  Search,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  User,
} from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';
import { DetalleExpedienteModal } from './DetalleExpedienteModal';
import { NuevoExpedienteModal } from './NuevoExpedienteModal';

interface ModuloExpedientesProps {
  expedienteSeleccionadoId?: string | null;
  onLimpiarSeleccion?: () => void;
}

export function ModuloExpedientes({
  expedienteSeleccionadoId,
  onLimpiarSeleccion,
}: ModuloExpedientesProps) {
  const { expedientes } = useExpedientes();

  const [busqueda, setBusqueda] = useState('');
  const [fueroFiltro, setFueroFiltro] = useState<string>('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('TODOS');
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [expedienteModalId, setExpedienteModalId] = useState<string | null>(
    expedienteSeleccionadoId || null
  );

  // Filtrado de expedientes
  const expedientesFiltrados = expedientes.filter((exp) => {
    const coincideTexto =
      exp.numeroCausa.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.caratula.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.juzgadoTribunal.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFuero = fueroFiltro === 'TODOS' || exp.fuero === fueroFiltro;
    const coincideEstado = estadoFiltro === 'TODOS' || exp.estadoProcesal === estadoFiltro;

    return coincideTexto && coincideFuero && coincideEstado;
  });

  const expedienteActivo = expedientes.find((e) => e.id === expedienteModalId);

  return (
    <div className="space-y-5">
      {/* Barra de Acciones y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Buscador Rápido */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por número de causa, carátula, juzgado o cliente..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <button
            onClick={() => setModalNuevoAbierto(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nuevo Expediente</span>
          </button>
        </div>

        {/* Filtros por Fuero y Estado */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Filtros:</span>

          <select
            value={fueroFiltro}
            onChange={(e) => setFueroFiltro(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
          >
            <option value="TODOS">Todos los Fueros</option>
            <option value="Civil y Comercial">Civil y Comercial</option>
            <option value="Laboral">Laboral</option>
            <option value="Familia y Sucesiones">Familia y Sucesiones</option>
            <option value="Contencioso Administrativo">Contencioso Administrativo</option>
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="En Trámite">En Trámite</option>
            <option value="A Prueba">A Prueba</option>
            <option value="Para Sentencia">Para Sentencia</option>
            <option value="En Apelación">En Apelación</option>
          </select>

          {(busqueda || fueroFiltro !== 'TODOS' || estadoFiltro !== 'TODOS') && (
            <button
              onClick={() => {
                setBusqueda('');
                setFueroFiltro('TODOS');
                setEstadoFiltro('TODOS');
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold ml-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Listado de Causas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Causas Radicadas en el Estudio ({expedientesFiltrados.length})
          </h3>
          <span className="text-[11px] text-slate-400">Haga clic en una causa para ver su legajo</span>
        </div>

        {expedientesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No se encontraron expedientes que coincidan con el criterio de búsqueda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expedientesFiltrados.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setExpedienteModalId(exp.id)}
                className="p-4 hover:bg-blue-50/40 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      N° {exp.numeroCausa}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exp.fuero}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {exp.estadoProcesal}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition tracking-tight">
                    {exp.caratula}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.juzgadoTribunal}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cliente: <strong className="text-slate-700">{exp.clienteNombre}</strong></span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Apertura: {exp.fechaApertura}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-900 flex items-center space-x-1 justify-end">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{exp.movimientos.length} actuación(es)</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Dir: {exp.abogadoDirectorNombre.split(' ')[1]}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {modalNuevoAbierto && (
        <NuevoExpedienteModal alCerrar={() => setModalNuevoAbierto(false)} />
      )}

      {expedienteActivo && (
        <DetalleExpedienteModal
          expediente={expedienteActivo}
          alCerrar={() => {
            setExpedienteModalId(null);
            if (onLimpiarSeleccion) onLimpiarSeleccion();
          }}
        />
      )}
    </div>
  );
}

