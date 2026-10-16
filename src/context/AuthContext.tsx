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

  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem(CLAVE_STORAGE_SESION);
      if (sesionGuardada) {
        const datos = JSON.parse(sesionGuardada);
        const usuarioEncontrado = USUARIOS_MOCK.find(
          (u) => u.email.toLowerCase() === datos?.email?.toLowerCase() || u.id === datos?.id
        );
        if (usuarioEncontrado) {
          setUsuarioActual(usuarioEncontrado);
        } else {
          localStorage.removeItem(CLAVE_STORAGE_SESION);
          setUsuarioActual(null);
        }
      }
    } catch {
      localStorage.removeItem(CLAVE_STORAGE_SESION);
      setUsuarioActual(null);
    }
  }, []);

  const iniciarSesion = (email: string, contrasenia: string) => {
    const emailNormalizado = (email || '').trim().toLowerCase();
    const contraseniaNormalizada = (contrasenia || '').trim();

    const usuarioEncontrado = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === emailNormalizado
    );

    if (!usuarioEncontrado) {
      return {
        exito: false,
        mensajeError: 'No existe un usuario registrado con ese correo electrónico. Usuarios disponibles: pmbejas@gmail.com, agarlati@gmail.com o asalas@gmail.com',
      };
    }

    if (contraseniaNormalizada !== 'pepito123') {
      return {
        exito: false,
        mensajeError: 'Contraseña incorrecta. Recuerde que para la demo la contraseña es "pepito123".',
      };
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
    const emailNormalizado = (email || '').trim().toLowerCase();
    const usuarioEncontrado = USUARIOS_MOCK.find(
      (u) => u.email.toLowerCase() === emailNormalizado
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

