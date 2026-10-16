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

    // Pequeño timeout para feedback táctil y visual inmediato
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
        <div className="md:col-span-3 p-6 sm:p-8 bg-slate-50 flex flex-col justify-center">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Haga clic en cualquiera de los 3 usuarios de prueba o ingrese manualmente:
            </p>
          </div>

          {/* Accesos Rápidos de Demostración (1 Clic) */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Ingreso Directo de Demostración:</span>
              </label>
              <span className="text-[11px] text-blue-600 font-semibold">(1 Clic)</span>
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
                    className={`w-full text-left p-3 rounded-xl border transition group flex items-center justify-between cursor-pointer ${
                      estaSeleccionado
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-400'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center space-x-1.5">
                        <span>{usr.nombreCompleto}</span>
                        {estaSeleccionado && (
                          <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {usr.email} • <span className="font-medium text-slate-700">{usr.sectorOArea}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
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
              <span className="bg-slate-50 px-2 text-slate-400 font-semibold text-[11px]">
                O ingrese con sus datos
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="ejemplo@estudio.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={contrasenia}
                  onChange={(e) => {
                    setContrasenia(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {ingresando ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Ingresando al Sistema...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
