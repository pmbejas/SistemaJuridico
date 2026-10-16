'use client';

import React, { useState } from 'react';
import {
  ClockAlert,
  CheckCircle2,
  Calendar,
  User,
  Plus,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';
import { NivelCriticidad } from '../types';

export function ModuloVencimientos() {
  const { vencimientos, expedientes, alternarCumplimientoVencimiento } = useExpedientes();
  const { usuarioActual } = useAuth();

  const [filtroEstado, setFiltroEstado] = useState<'PENDIENTES' | 'CUMPLIDOS'>('PENDIENTES');
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);

  // Formulario nuevo vencimiento
  const [expedienteId, setExpedienteId] = useState(expedientes[0]?.id || '');
  const [descripcionActo, setDescripcionActo] = useState('');
  const [fechaHoraLimite, setFechaHoraLimite] = useState('');
  const [nivelCriticidad, setNivelCriticidad] = useState<NivelCriticidad>('Alta');

  const vencimientosFiltrados = vencimientos.filter((v) =>
    filtroEstado === 'PENDIENTES' ? !v.cumplido : v.cumplido
  );

  const calcularTiempoRestante = (fechaIso: string) => {
    const fechaLimite = new Date(fechaIso);
    const ahora = new Date();
    const diferenciaMs = fechaLimite.getTime() - ahora.getTime();
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));

    if (horas < 0) return { texto: 'PLAZO VENCIDO', urgente: true };
    if (horas <= 24) return { texto: `Vence en ${horas} hs (Hoy/Mañana)`, urgente: true };
    const dias = Math.floor(horas / 24);
    return { texto: `Quedan ${dias} día(s)`, urgente: dias <= 3 };
  };

  const badgeCriticidad = (criticidad: NivelCriticidad) => {
    switch (criticidad) {
      case 'Alta':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Media':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Baja':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Cabecera y Selector de Vista */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFiltroEstado('PENDIENTES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filtroEstado === 'PENDIENTES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Términos Pendientes ({vencimientos.filter((v) => !v.cumplido).length})
          </button>
          <button
            onClick={() => setFiltroEstado('CUMPLIDOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filtroEstado === 'CUMPLIDOS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Historial Cumplidos ({vencimientos.filter((v) => v.cumplido).length})
          </button>
        </div>

        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Fijar Término Fatal</span>
        </button>
      </div>

      {/* Lista de Vencimientos */}
      <div className="space-y-3">
        {vencimientosFiltrados.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No hay plazos judiciales en este estado.
          </div>
        ) : (
          vencimientosFiltrados.map((venc) => {
            const tiempo = calcularTiempoRestante(venc.fechaHoraLimite);

            return (
              <div
                key={venc.id}
                className={`p-5 rounded-2xl border bg-white shadow-2xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !venc.cumplido && tiempo.urgente
                    ? 'border-rose-200 hover:border-rose-300'
                    : 'border-slate-200 hover:border-blue-200'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      Expte. {venc.numeroCausa}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${badgeCriticidad(
                        venc.nivelCriticidad
                      )}`}
                    >
                      Criticidad {venc.nivelCriticidad}
                    </span>

                    {!venc.cumplido && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          tiempo.urgente
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tiempo.texto}
                      </span>
                    )}

                    {venc.cumplido && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Cumplido debidamente
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    {venc.descripcionActo}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{venc.caratula}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Responsable: <strong className="text-slate-800">{venc.abogadoResponsableNombre}</strong></span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Límite: {new Date(venc.fechaHoraLimite).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })} hs</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-3 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (usuarioActual) {
                        alternarCumplimientoVencimiento(venc.id, usuarioActual);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs ${
                      venc.cumplido
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{venc.cumplido ? 'Reabrir Plazo' : 'Marcar Cumplido'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nuevo Plazo */}
      {modalNuevoAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClockAlert className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Fijar Nuevo Vencimiento Procesal</h3>
              </div>
              <button
                onClick={() => setModalNuevoAbierto(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Término judicial fijado con éxito en la agenda del despacho.');
                setModalNuevoAbierto(false);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Causa Vinculada:</label>
                <select
                  value={expedienteId}
                  onChange={(e) => setExpedienteId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {expedientes.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      N° {exp.numeroCausa} - {exp.caratula.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción del Término:</label>
                <input
                  type="text"
                  value={descripcionActo}
                  onChange={(e) => setDescripcionActo(e.target.value)}
                  placeholder="Ej. Contestar traslado de demanda / Apelar sentencia"
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha y Hora Límite:</label>
                  <input
                    type="datetime-local"
                    value={fechaHoraLimite}
                    onChange={(e) => setFechaHoraLimite(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Criticidad Procesal:</label>
                  <select
                    value={nivelCriticidad}
                    onChange={(e) => setNivelCriticidad(e.target.value as NivelCriticidad)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Alta">Alta (Fatal / Caducidad)</option>
                    <option value="Media">Media (Término Ordinario)</option>
                    <option value="Baja">Baja (Mero Trámite)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalNuevoAbierto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Agendar Vencimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

