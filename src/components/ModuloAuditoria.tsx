'use client';

import React from 'react';
import { ShieldCheck, Eye, Terminal, Clock, User, Globe } from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';

export function ModuloAuditoria() {
  const { auditoria } = useExpedientes();

  const badgeOperacion = (tipo: string) => {
    switch (tipo) {
      case 'ACCESO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CREACION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MODIFICACION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONTROL_CUMPLIDO':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Cabecera Informativa */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Bitácora Inmutable de Auditoría y Control
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro secuencial inalterable para control de calidad, peritajes forenses y deslinde de responsabilidades del despacho.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          {auditoria.length} evento(s) auditado(s)
        </span>
      </div>

      {/* Vista Móvil: Tarjetas de Eventos (sm:hidden) */}
      <div className="sm:hidden space-y-2.5">
        {auditoria.map((aud) => (
          <div
            key={aud.id}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeOperacion(
                  aud.tipoOperacion
                )}`}
              >
                {aud.tipoOperacion}
              </span>

              <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{aud.fechaHora}</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {aud.detalle}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <strong className="text-slate-800">{aud.usuarioNombre}</strong>{' '}
                <span className="text-slate-400">({aud.rolUsuario})</span>
              </div>
              <div className="flex items-center space-x-1 font-mono text-slate-400">
                <Globe className="w-3 h-3 text-slate-300" />
                <span>{aud.ipOrigen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Escritorio: Tabla Clásica de Eventos (hidden sm:block) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Fecha / Hora</th>
                <th className="p-3.5">Usuario Interviniente</th>
                <th className="p-3.5">Operación</th>
                <th className="p-3.5">Detalle del Suceso</th>
                <th className="p-3.5 text-right">IP Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditoria.map((aud) => (
                <tr key={aud.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{aud.fechaHora}</span>
                    </div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{aud.usuarioNombre}</div>
                    <span className="text-[10px] text-slate-400">{aud.rolUsuario}</span>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeOperacion(
                        aud.tipoOperacion
                      )}`}
                    >
                      {aud.tipoOperacion}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-700 leading-relaxed font-medium">
                    {aud.detalle}
                  </td>

                  <td className="p-3.5 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <Globe className="w-3 h-3 text-slate-300" />
                      <span>{aud.ipOrigen}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

