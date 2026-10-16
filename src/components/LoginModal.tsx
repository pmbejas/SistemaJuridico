'use client';

import React, { useState } from 'react';
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

export function LoginModal() {
  const { iniciarSesion, iniciarSesionRapida } = useAuth();
  const [email, setEmail] = useState('pmbejas@gmail.com');
  const [contrasenia, setContrasenia] = useState('pepito123');
  const [error, setError] = useState<string | null>(null);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const resultado = iniciarSesion(email, contrasenia);
    if (!resultado.exito) {
      setError(resultado.mensajeError || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Panel Izquierdo Informativo (Fondo Azul Marino) */}
        <div className="md:col-span-2 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
              <Scale className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight leading-tight">
              SISTEMA DE GESTIÓN DE EXPEDIENTES
            </h1>
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mt-1">
              Plataforma Forense Corporativa
            </p>

            <p className="text-slate-300 text-xs mt-4 leading-relaxed">
              Entorno integral para la administración de causas judiciales, control fatal de términos procesales y custodia documental criptográfica.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Control estricto de plazos perentorios</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Línea de tiempo con fehaciencia de cargo</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Hashes criptográficos SHA-256 en escritos</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-blue-900/60 flex items-center space-x-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Acceso defensivo con mínimo privilegio</span>
          </div>
        </div>

        {/* Panel Derecho: Formulario y Accesos Rápidos Demo */}
        <div className="md:col-span-3 p-8 bg-slate-50 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingrese con sus credenciales habilitadas o elija un usuario de demostración:
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Accesos Rápidos de Demostración (1 Clic) */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-600 block mb-2 uppercase tracking-wider">
              Acceso Rápido de Prueba:
            </label>
            <div className="space-y-2">
              {USUARIOS_MOCK.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => iniciarSesionRapida(usr.email)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition group flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      {usr.nombreCompleto}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {usr.email} • <span className="font-medium text-slate-600">{usr.sectorOArea}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Entrar →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-400 font-semibold">O ingrese manualmente</span>
            </div>
          </div>

          {/* Formulario Tradicional */}
          <form onSubmit={manejarEnvio} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@estudio.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Contraseña</label>
                <span className="text-[10px] text-slate-400">(demo: pepito123)</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm shadow-blue-500/20 flex items-center justify-center space-x-2"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
