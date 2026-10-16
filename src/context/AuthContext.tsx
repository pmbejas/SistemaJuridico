'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import { USUARIOS_MOCK } from '../data/mockDatosIniciales';

interface AuthContextType {
  usuarioActual: Usuario | null;
  estaAutenticado: boolean;
  iniciarSesion: (email: string, contrasenia: string) => { exito: boolean; mensajeError?: string };
  iniciarSesionRapida: (email: string) => void;
  cerrarSesion: () => void;
}

const CLAVE_STORAGE_SESION = 'sistema_juridico_sesion_usuario';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem(CLAVE_STORAGE_SESION);
      if (sesionGuardada) {
        setUsuarioActual(JSON.parse(sesionGuardada));
      }
    } catch {
      // Ignora error si localStorage no está disponible
    } finally {
      setCargando(false);
    }
  }, []);

  const iniciarSesion = (email: string, contrasenia: string) => {
    const emailNormalizado = email.trim().toLowerCase();
    const usuarioEncontrado = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === emailNormalizado
    );

    if (!usuarioEncontrado) {
      return { exito: false, mensajeError: 'No existe un usuario registrado con ese correo electrónico.' };
    }

    if (contrasenia !== 'pepito123') {
      return { exito: false, mensajeError: 'Contraseña incorrecta. Recuerde que para la demo es "pepito123".' };
    }

    setUsuarioActual(usuarioEncontrado);
    try {
      localStorage.setItem(CLAVE_STORAGE_SESION, JSON.stringify(usuarioEncontrado));
    } catch {
      // localStorage no disponible
    }

    return { exito: true };
  };

  const iniciarSesionRapida = (email: string) => {
    const usuarioEncontrado = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (usuarioEncontrado) {
      setUsuarioActual(usuarioEncontrado);
      try {
        localStorage.setItem(CLAVE_STORAGE_SESION, JSON.stringify(usuarioEncontrado));
      } catch {
        // localStorage no disponible
      }
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    try {
      localStorage.removeItem(CLAVE_STORAGE_SESION);
    } catch {
      // localStorage no disponible
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Iniciando entorno legal...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        estaAutenticado: usuarioActual !== null,
        iniciarSesion,
        iniciarSesionRapida,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
