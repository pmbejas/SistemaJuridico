'use client';

import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { FueroJudicial, EstadoProcesal, ExpedienteJudicial } from '../types';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

interface NuevoExpedienteModalProps {
  alCerrar: () => void;
}

export function NuevoExpedienteModal({ alCerrar }: NuevoExpedienteModalProps) {
  const { clientes, agregarExpediente } = useExpedientes();
  const { usuarioActual } = useAuth();

  const [numeroCausa, setNumeroCausa] = useState('');
  const [caratula, setCaratula] = useState('');
  const [fuero, setFuero] = useState<FueroJudicial>('Civil y Comercial');
  const [juzgadoTribunal, setJuzgadoTribunal] = useState('Juzgado Civil y Comercial N° 5');
  const [secretariaJudicial, setSecretariaJudicial] = useState('Secretaría N° 1');
  const [estadoProcesal, setEstadoProcesal] = useState<EstadoProcesal>('En Trámite');
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [abogadoDirectorId, setAbogadoDirectorId] = useState(usuarioActual?.id || USUARIOS_MOCK[0].id);
  const [procuradorAsignado, setProcuradorAsignado] = useState('Dr. Alejo Salas');
  const [observaciones, setObservaciones] = useState('');

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroCausa.trim() || !caratula.trim() || !usuarioActual) return;

    const clienteSeleccionado = clientes.find((c) => c.id === clienteId);
    const abogadoSeleccionado = USUARIOS_MOCK.find((u) => u.id === abogadoDirectorId);

    const nuevoExp: Omit<ExpedienteJudicial, 'id' | 'movimientos'> = {
      numeroCausa: numeroCausa.trim(),
      caratula: caratula.trim().toUpperCase(),
      fuero,
      juzgadoTribunal: juzgadoTribunal.trim(),
      secretariaJudicial: secretariaJudicial.trim(),
      estadoProcesal,
      fechaApertura: new Date().toLocaleDateString('es-AR'),
      clienteId: clienteSeleccionado?.id || 'cli-1',
      clienteNombre: clienteSeleccionado?.nombreRazonSocial || 'Cliente General',
      abogadoDirectorId: abogadoSeleccionado?.id || usuarioActual.id,
      abogadoDirectorNombre: abogadoSeleccionado?.nombreCompleto || usuarioActual.nombreCompleto,
      procuradorAsignadoNombre: procuradorAsignado,
      observacionesEstrategicas: observaciones.trim() || 'Apertura inicial del legajo judicial.',
    };

    agregarExpediente(nuevoExp, usuarioActual);
    alCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">Abrir Nuevo Expediente Judicial</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Registrar legajo de causa en el sistema</p>
            </div>
          </div>
          <button
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Número de Causa:</label>
              <input
                type="text"
                value={numeroCausa}
                onChange={(e) => setNumeroCausa(e.target.value)}
                placeholder="Ej. 1824/2026"
                className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Carátula Formal:</label>
              <input
                type="text"
                value={caratula}
                onChange={(e) => setCaratula(e.target.value)}
                placeholder="ACTOR C/ DEMANDADO S/ MATERIA"
                className="w-full p-2 border border-slate-300 rounded-lg font-medium uppercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fuero Jurisdiccional:</label>
              <select
                value={fuero}
                onChange={(e) => setFuero(e.target.value as FueroJudicial)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Civil y Comercial">Civil y Comercial</option>
                <option value="Laboral">Laboral</option>
                <option value="Familia y Sucesiones">Familia y Sucesiones</option>
                <option value="Contencioso Administrativo">Contencioso Administrativo</option>
                <option value="Penal">Penal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estado Procesal Inicial:</label>
              <select
                value={estadoProcesal}
                onChange={(e) => setEstadoProcesal(e.target.value as EstadoProcesal)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="En Trámite">En Trámite</option>
                <option value="A Prueba">A Prueba</option>
                <option value="Para Sentencia">Para Sentencia</option>
                <option value="En Apelación">En Apelación</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Juzgado / Tribunal:</label>
              <input
                type="text"
                value={juzgadoTribunal}
                onChange={(e) => setJuzgadoTribunal(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Secretaría Actuaria:</label>
              <input
                type="text"
                value={secretariaJudicial}
                onChange={(e) => setSecretariaJudicial(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cliente Titular:</label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {clientes.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nombreRazonSocial} ({cli.identificadorFiscal})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Letrado Director:</label>
              <select
                value={abogadoDirectorId}
                onChange={(e) => setAbogadoDirectorId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {USUARIOS_MOCK.filter((u) => u.rol !== 'PROCURADOR').map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombreCompleto} ({u.sectorOArea})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Observaciones Estratégicas y Medidas Cautelares:
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Anotaciones de fondo, riesgos de caducidad o estrategia legal..."
              rows={2}
              className="w-full p-2 border border-slate-300 rounded-lg font-medium"
            ></textarea>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={alCerrar}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer text-center"
            >
              Registrar Expediente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

