'use client';

import React, { useState } from 'react';
import { LogOut, RotateCcw, UserCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpedientes } from '../context/ExpedientesContext';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

interface BarraSuperiorProps {
  tituloVista: string;
}

export function BarraSuperior({ tituloVista }: BarraSuperiorProps) {
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

  const badgeRol = obtenerEtiquetaRol(usuarioActual?.rol);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{tituloVista}</h2>
      </div>

      <div className="flex items-center space-x-3">
        {/* Selector Rápido de Usuario para Demostración */}
        <div className="relative">
          <button
            onClick={() => setMenuUsuariosAbierto(!menuUsuariosAbierto)}
            className="flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-700 transition"
            title="Cambiar rápidamente de usuario para probar roles"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Cambiar Rol Demo:</span>
            <span className="font-semibold text-slate-900">{usuarioActual?.nombreCompleto.split(' ')[1] || 'Usuario'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {menuUsuariosAbierto && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Simular Usuario del Estudio:
              </div>
              {USUARIOS_MOCK.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => {
                    iniciarSesionRapida(usr.email);
                    setMenuUsuariosAbierto(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col transition ${
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
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {usuarioActual?.nombreCompleto
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {usuarioActual?.nombreCompleto}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badgeRol.clase}`}>
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
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          title="Restablecer datos originales de prueba"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botón Cerrar Sesión */}
        <button
          onClick={cerrarSesion}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
