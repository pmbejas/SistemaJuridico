'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, MapPin, Building, Briefcase } from 'lucide-react';
import { useExpedientes } from '../context/ExpedientesContext';
import { useAuth } from '../context/AuthContext';
import { TipoPersona } from '../types';

export function ModuloClientes() {
  const { clientes, agregarCliente } = useExpedientes();
  const { usuarioActual } = useAuth();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [identificadorFiscal, setIdentificadorFiscal] = useState('');
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>('Fisica');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [domicilio, setDomicilio] = useState('');

  const manejarCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !identificadorFiscal.trim() || !usuarioActual) return;

    agregarCliente(
      {
        nombreRazonSocial: nombre.trim(),
        identificadorFiscal: identificadorFiscal.trim(),
        tipoPersona,
        telefonoContacto: telefono.trim() || 'No informado',
        emailContacto: email.trim() || 'No informado',
        domicilioConstituido: domicilio.trim() || 'San Miguel de Tucumán',
      },
      usuarioActual
    );

    setNombre('');
    setIdentificadorFiscal('');
    setTelefono('');
    setEmail('');
    setDomicilio('');
    setModalAbierto(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Barra de Acciones */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Directorio de Clientes Patrocinados</h3>
          <p className="text-xs text-slate-500">Personas físicas y jurídicas titulares de derechos litigiosos</p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {clientes.map((cli) => (
          <div
            key={cli.id}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-2xs transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  Persona {cli.tipoPersona}
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1 tracking-tight">
                  {cli.nombreRazonSocial}
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  CUIT/DNI: {cli.identificadorFiscal}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                {cli.tipoPersona === 'Juridica' ? (
                  <Building className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{cli.telefonoContacto}</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{cli.emailContacto}</span>
              </div>
              <div className="flex items-start space-x-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{cli.domicilioConstituido}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Patrocinio habilitado</span>
              <span className="font-semibold text-blue-700 flex items-center space-x-1">
                <Briefcase className="w-3 h-3" />
                <span>{cli.cantidadCausasActivas} causa(s) en trámite</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nuevo Cliente */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Registrar Nuevo Cliente</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarCrearCliente} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nombre y Apellido o Razón Social:</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. González y Cía. S.A. o Mario Gómez"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identificador Fiscal (CUIT/DNI):</label>
                  <input
                    type="text"
                    value={identificadorFiscal}
                    onChange={(e) => setIdentificadorFiscal(e.target.value)}
                    placeholder="20-12345678-9"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Persona:</label>
                  <select
                    value={tipoPersona}
                    onChange={(e) => setTipoPersona(e.target.value as TipoPersona)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Fisica">Física</option>
                    <option value="Juridica">Jurídica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+54 381 400-0000"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@ejemplo.com"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domicilio Constituido Legal:</label>
                <input
                  type="text"
                  value={domicilio}
                  onChange={(e) => setDomicilio(e.target.value)}
                  placeholder="Calle, número, piso y localidad..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

