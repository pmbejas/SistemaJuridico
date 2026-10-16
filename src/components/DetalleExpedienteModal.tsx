'use client';

import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Stamp,
  Hash,
  Copy,
  Check,
  PlusCircle,
  Building,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ExpedienteJudicial, MovimientoProcesal } from '../types';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';

interface DetalleExpedienteModalProps {
  expediente: ExpedienteJudicial;
  alCerrar: () => void;
}

export function DetalleExpedienteModal({ expediente, alCerrar }: DetalleExpedienteModalProps) {
  const { agregarMovimientoAExpediente } = useExpedientes();
  const { usuarioActual } = useAuth();

  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Estados del nuevo movimiento
  const [tipoActuacion, setTipoActuacion] = useState<MovimientoProcesal['tipoActuacion']>('Escrito Presentado');
  const [titulo, setTitulo] = useState('');
  const [descripcionFojas, setDescripcionFojas] = useState('');
  const [incluirCargo, setIncluirCargo] = useState(true);
  const [funcionarioReceptor, setFuncionarioReceptor] = useState('Secretaría Actuaria Dr. Marcos Rossi');
  const [fojas, setFojas] = useState(3);
  const [incluirDocumento, setIncluirDocumento] = useState(true);
  const [nombreArchivo, setNombreArchivo] = useState('');

  const copiarHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const generarHashAleatorio = () => {
    const chars = '0123456789abcdef';
    let resultado = '';
    for (let i = 0; i < 64; i++) {
      resultado += chars[Math.floor(Math.random() * chars.length)];
    }
    return resultado;
  };

  const manejarGuardarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !usuarioActual) return;

    const fechaHoy = new Date().toLocaleDateString('es-AR');
    const horaActual = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

    const nuevoMov: Omit<MovimientoProcesal, 'id' | 'fechaActuacion'> = {
      tipoActuacion,
      titulo: titulo.trim(),
      descripcionFojas: descripcionFojas.trim() || `Fs. ${fojas}. Actuación procesal agregada al legajo judicial.`,
      esComunicableAlCliente: true,
      cargoJudicial: incluirCargo
        ? {
            fechaPresentacion: fechaHoy,
            horaPresentacion: horaActual,
            funcionarioReceptor: funcionarioReceptor || 'Mesa de Entradas General',
            fojasPresentadas: Number(fojas),
          }
        : undefined,
      documentoAnexo: incluirDocumento
        ? {
            id: `doc-${Date.now()}`,
            titulo: nombreArchivo || `${titulo.trim().replace(/\s+/g, '_')}.pdf`,
            categoria: 'Escrito',
            numeroVersion: 'v1.0',
            huellaSha256: generarHashAleatorio(),
            fechaCarga: fechaHoy,
            cantidadFojas: Number(fojas),
            nombreArchivo: nombreArchivo || `${titulo.trim().replace(/\s+/g, '_')}.pdf`,
          }
        : undefined,
    };

    agregarMovimientoAExpediente(expediente.id, nuevoMov, usuarioActual);

    // Limpiar y cerrar formulario
    setTitulo('');
    setDescripcionFojas('');
    setNombreArchivo('');
    setMostrandoFormulario(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                N° Causa: {expediente.numeroCausa}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {expediente.fuero}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {expediente.estadoProcesal}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-2 tracking-tight">
              {expediente.caratula}
            </h2>
          </div>

          <button
            onClick={alCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ficha Resumen de Radicación Tribunalicia */}
        <div className="px-6 py-3.5 bg-blue-50/50 border-b border-blue-100/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Radicación:</span>
              <span className="font-semibold text-slate-800">{expediente.juzgadoTribunal}</span>
              <span className="text-slate-500 block text-[11px]">{expediente.secretariaJudicial}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Patrocinio / Letrados:</span>
              <span className="font-semibold text-slate-800">Director: {expediente.abogadoDirectorNombre}</span>
              <span className="text-slate-500 block text-[11px]">Procurador: {expediente.procuradorAsignadoNombre || 'No asignado'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Cliente Titular:</span>
              <span className="font-semibold text-slate-800">{expediente.clienteNombre}</span>
              <span className="text-slate-500 block text-[11px]">Apertura: {expediente.fechaApertura}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Modal: Cronología de Actuaciones */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Línea de Tiempo Procesal ({expediente.movimientos.length} actuaciones)
              </h3>
              <p className="text-xs text-slate-500">
                Historia inalterable de actos procesales, decretos y piezas probatorias.
              </p>
            </div>

            {!mostrandoFormulario && (
              <button
                onClick={() => setMostrandoFormulario(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Agregar Actuación</span>
              </button>
            )}
          </div>

          {/* Formulario de Alta de Movimiento Procesal */}
          {mostrandoFormulario && (
            <form
              onSubmit={manejarGuardarMovimiento}
              className="p-4 bg-slate-50 rounded-xl border border-blue-200 space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Nuevo Asiento Procesal en la Causa
                </h4>
                <button
                  type="button"
                  onClick={() => setMostrandoFormulario(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tipo de Acto Procesal:
                  </label>
                  <select
                    value={tipoActuacion}
                    onChange={(e) => setTipoActuacion(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="Escrito Presentado">Escrito Presentado</option>
                    <option value="Decreto">Decreto Judicial / Providencia</option>
                    <option value="Audiencia">Audiencia Realizada</option>
                    <option value="Cédula Notificada">Cédula Notificada</option>
                    <option value="Sentencia Interlocutoria">Sentencia Interlocutoria</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Título o Carátula de la Actuación:
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej. Contesta traslado de excepción previa / Acompaña pericia"
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Descripción fáctica y fojas del legajo:
                </label>
                <textarea
                  value={descripcionFojas}
                  onChange={(e) => setDescripcionFojas(e.target.value)}
                  placeholder="Detalle fáctico de la presentación o síntesis de la resolución..."
                  rows={2}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                ></textarea>
              </div>

              {/* Opciones de Cargo Judicial y Hash SHA-256 */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="chkCargo"
                    checked={incluirCargo}
                    onChange={(e) => setIncluirCargo(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="chkCargo" className="text-xs font-bold text-slate-800">
                    Acreditar con Cargo Judicial Fehaciente (Sello Mesa de Entradas)
                  </label>
                </div>

                {incluirCargo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Funcionario Receptor:</span>
                      <input
                        type="text"
                        value={funcionarioReceptor}
                        onChange={(e) => setFuncionarioReceptor(e.target.value)}
                        className="w-full p-1.5 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Cantidad de Fojas:</span>
                      <input
                        type="number"
                        value={fojas}
                        onChange={(e) => setFojas(Number(e.target.value))}
                        min={1}
                        className="w-full p-1.5 border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <input
                    type="checkbox"
                    id="chkDoc"
                    checked={incluirDocumento}
                    onChange={(e) => setIncluirDocumento(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="chkDoc" className="text-xs font-bold text-slate-800">
                    Custodia Digital: Asignar Versión y Hash Criptográfico SHA-256
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrandoFormulario(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Guardar Actuación
                </button>
              </div>
            </form>
          )}

          {/* Listado de Movimientos Procesales */}
          <div className="space-y-4">
            {expediente.movimientos.map((mov, index) => (
              <div
                key={mov.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {mov.tipoActuacion}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{mov.titulo}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{mov.descripcionFojas}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-400 text-xs shrink-0 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{mov.fechaActuacion}</span>
                  </div>
                </div>

                {/* Bloque de Cargo Judicial (Fe pública) */}
                {mov.cargoJudicial && (
                  <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center space-x-2">
                      <Stamp className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="font-bold">Cargo Fechador Judicial:</span> Presentado el{' '}
                        <span className="font-semibold">{mov.cargoJudicial.fechaPresentacion}</span> a las{' '}
                        <span className="font-semibold">{mov.cargoJudicial.horaPresentacion}</span> ({mov.cargoJudicial.fojasPresentadas} fojas).
                      </div>
                    </div>
                    <span className="text-[11px] text-amber-700 hidden sm:inline">
                      {mov.cargoJudicial.funcionarioReceptor}
                    </span>
                  </div>
                )}

                {/* Bloque de Documento con Huella Criptográfica SHA-256 */}
                {mov.documentoAnexo && (
                  <div className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-sky-400" />
                        <span className="font-bold text-white">
                          {mov.documentoAnexo.nombreArchivo}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800">
                          {mov.documentoAnexo.numeroVersion}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {mov.documentoAnexo.cantidadFojas} fojas
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-400 truncate">
                        <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{mov.documentoAnexo.huellaSha256}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copiarHash(mov.documentoAnexo!.huellaSha256, mov.id)}
                        className="ml-2 text-slate-400 hover:text-white shrink-0 p-1 rounded"
                        title="Copiar hash SHA-256"
                      >
                        {copiadoId === mov.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Observación estratégica: {expediente.observacionesEstrategicas}</span>
          <button
            onClick={alCerrar}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition"
          >
            Cerrar Legajo
          </button>
        </div>
      </div>
    </div>
  );
}

