'use client';

import React, { useState } from 'react';
import {
  Scale,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

export function LoginModal() {
  const { iniciarSesion, iniciarSesionRapida } = useAuth();
  const [email, setEmail] = useState('pmbejas@gmail.com');
  const [contrasenia, setContrasenia] = useState('pepito123');
  const [error, setError] = useState<string | null>(null);
  const [ingresando, setIngresando] = useState(false);

  const manejarEnvio = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError(null);
    setIngresando(true);

    setTimeout(() => {
      const resultado = iniciarSesion(email, contrasenia);
      if (!resultado.exito) {
        setError(resultado.mensajeError || 'Credenciales inválidas.');
        setIngresando(false);
      }
    }, 120);
  };

  const seleccionarUsuarioRapido = (emailUsuario: string) => {
    setEmail(emailUsuario);
    setContrasenia('pepito123');
    setError(null);
    setIngresando(true);
    setTimeout(() => {
      iniciarSesionRapida(emailUsuario);
    }, 120);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-auto">
        {/* Panel Izquierdo Informativo (Adaptativo en móviles) */}
        <div className="md:col-span-2 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-4 sm:p-6 md:p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 md:block">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white md:mb-5 shadow-lg shadow-blue-500/30 shrink-0">
                <Scale className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              <div>
                <h1 className="text-base sm:text-lg md:text-2xl font-bold tracking-tight leading-tight">
                  SISTEMA DE GESTIÓN DE EXPEDIENTES
                </h1>
                <p className="text-sky-300 text-[10px] md:text-xs font-semibold uppercase tracking-wider mt-0.5">
                  Plataforma Forense Corporativa
                </p>
              </div>
            </div>

            {/* Texto y viñetas visibles en pantallas medianas y grandes */}
            <div className="hidden md:block">
              <p className="text-slate-300 text-xs mt-4 leading-relaxed">
                Entorno integral para la administración de causas judiciales, control fatal de términos procesales y custodia documental criptográfica.
              </p>

              <div className="mt-6 space-y-2.5">
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
          </div>

          <div className="hidden md:flex pt-6 border-t border-blue-900/60 items-center space-x-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Acceso defensivo con mínimo privilegio</span>
          </div>
        </div>

        {/* Panel Derecho: Formulario y Accesos Rápidos Demo */}
        <div className="md:col-span-3 p-4 sm:p-6 md:p-8 bg-slate-50 flex flex-col justify-center">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toca un usuario de prueba para ingresar directo o completa los datos:
            </p>
          </div>

          {/* Accesos Rápidos de Demostración (1 Clic) */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Ingreso Rápido (1 Clic):</span>
              </label>
              <span className="text-[11px] text-blue-600 font-semibold hidden sm:inline">Sin escribir</span>
            </div>

            <div className="space-y-2">
              {USUARIOS_MOCK.map((usr) => {
                const estaSeleccionado = email.toLowerCase() === usr.email.toLowerCase();

                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => seleccionarUsuarioRapido(usr.email)}
                    disabled={ingresando}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition group flex items-center justify-between cursor-pointer ${
                      estaSeleccionado
                        ? 'border-blue-500 bg-blue-50/80 shadow-xs ring-1 ring-blue-400'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center space-x-1.5">
                        <span className="truncate">{usr.nombreCompleto}</span>
                        {estaSeleccionado && (
                          <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            Elegido
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {usr.email} • <span className="font-medium text-slate-700">{usr.sectorOArea}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform ml-1">
                      Entrar →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-400 font-semibold text-[10px] sm:text-[11px]">
                O ingresa manualmente
              </span>
            </div>
          </div>

          {/* Formulario Tradicional */}
          <form onSubmit={manejarEnvio} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="ejemplo@estudio.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Contraseña</label>
                <span className="text-[11px] text-blue-600 font-semibold">Demo: pepito123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={contrasenia}
                  onChange={(e) => {
                    setContrasenia(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            {/* Mensaje de Error Visible justo antes del botón */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                manejarEnvio(e);
              }}
              disabled={ingresando}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
            >
              {ingresando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Ingresando al Sistema...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
