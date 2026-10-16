'use client';

import React, { useState } from 'react';
import { LogOut, RotateCcw, UserCheck, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpedientes } from '../context/ExpedientesContext';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

interface BarraSuperiorProps {
  tituloVista: string;
  onAbrirMenuMovil?: () => void;
}

export function BarraSuperior({ tituloVista, onAbrirMenuMovil }: BarraSuperiorProps) {
  const { usuarioActual, cerrarSesion, iniciarSesionRapida } = useAuth();
  const { reiniciarDatosDemo } = useExpedientes();
  const [menuUsuariosAbierto, setMenuUsuariosAbierto] = useState(false);

  const obtenerEtiquetaRol = (rol?: string) => {
    switch (rol) {
      case 'SOCIO_TITULAR':
        return { texto: 'Socio Titular', clase: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case 'ABOGADO':
        return { texto: 'Abogado Litigante', clase: 'bg-sky-100 text-sky-700 border-sky-200' };
      case 'PROCURADOR':
        return { texto: 'Procurador / Mesa Entradas', clase: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default:
        return { texto: 'Personal', clase: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const obtenerNombrePila = (nombre?: string) => {
    if (!nombre) return 'Usuario';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return 'Usuario';
    if (partes[0].toLowerCase().startsWith('dr') && partes.length > 1) {
      return partes[1];
    }
    return partes[0];
  };

  const obtenerIniciales = (nombre?: string) => {
    if (!nombre) return 'US';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return 'US';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    if (partes[0].toLowerCase().startsWith('dr') && partes.length >= 3) {
      return `${partes[1][0]}${partes[2][0]}`.toUpperCase();
    }
    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
  };

  const badgeRol = obtenerEtiquetaRol(usuarioActual?.rol);

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-30">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 pr-2">
        {onAbrirMenuMovil && (
          <button
            onClick={onAbrirMenuMovil}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight truncate">
          {tituloVista}
        </h2>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {/* Selector Rápido de Usuario para Demostración */}
        <div className="relative">
          <button
            onClick={() => setMenuUsuariosAbierto(!menuUsuariosAbierto)}
            className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Cambiar rápidamente de usuario para probar roles"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden md:inline">Cambiar Rol Demo:</span>
            <span className="font-semibold text-slate-900">{obtenerNombrePila(usuarioActual?.nombreCompleto)}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {menuUsuariosAbierto && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Simular Usuario del Estudio:
              </div>
              {USUARIOS_MOCK.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => {
                    iniciarSesionRapida(usr.email);
                    setMenuUsuariosAbierto(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col transition cursor-pointer ${
                    usuarioActual?.email === usr.email
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold">{usr.nombreCompleto}</span>
                  <span className="text-[11px] text-slate-500">{usr.tituloProfesional}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Perfil del Usuario Activo */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 pl-1.5 sm:pl-2 border-l border-slate-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            {obtenerIniciales(usuarioActual?.nombreCompleto)}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {usuarioActual?.nombreCompleto}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeRol.clase}`}>
                {badgeRol.texto}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Reiniciar Datos Demo */}
        <button
          onClick={() => {
            if (confirm('¿Desea restablecer todos los expedientes, tareas y plazos a los datos originales de prueba?')) {
              reiniciarDatosDemo();
            }
          }}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Restablecer datos originales de prueba"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botón Cerrar Sesión */}
        <button
          onClick={cerrarSesion}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
