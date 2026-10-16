'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExpedienteJudicial,
  VencimientoProcesal,
  TareaOperativa,
  EstadoTarea,
  Cliente,
  RegistroAuditoria,
  MovimientoProcesal,
  Usuario,
} from '../types';
import {
  EXPEDIENTES_INICIALES,
  VENCIMIENTOS_INICIALES,
  TAREAS_INICIALES,
  CLIENTES_INICIALES,
  AUDITORIA_INICIAL,
} from '../data/mockDatosIniciales';

interface ExpedientesContextType {
  expedientes: ExpedienteJudicial[];
  vencimientos: VencimientoProcesal[];
  tareas: TareaOperativa[];
  clientes: Cliente[];
  auditoria: RegistroAuditoria[];
  agregarExpediente: (nuevoExpediente: Omit<ExpedienteJudicial, 'id' | 'movimientos'>, usuario: Usuario) => void;
  agregarMovimientoAExpediente: (
    expedienteId: string,
    movimiento: Omit<MovimientoProcesal, 'id' | 'fechaActuacion'>,
    usuario: Usuario
  ) => void;
  alternarCumplimientoVencimiento: (vencimientoId: string, usuario: Usuario) => void;
  alternarEstadoTarea: (tareaId: string, usuario: Usuario) => void;
  agregarTarea: (
    tarea: Omit<TareaOperativa, 'id' | 'encomendadaPorNombre'>,
    usuario: Usuario
  ) => void;
  agregarCliente: (nuevoCliente: Omit<Cliente, 'id' | 'cantidadCausasActivas'>, usuario: Usuario) => void;
  reiniciarDatosDemo: () => void;
}

const STORAGE_EXPEDIENTES = 'sistema_juridico_expedientes';
const STORAGE_VENCIMIENTOS = 'sistema_juridico_vencimientos';
const STORAGE_TAREAS = 'sistema_juridico_tareas';
const STORAGE_CLIENTES = 'sistema_juridico_clientes';
const STORAGE_AUDITORIA = 'sistema_juridico_auditoria';

const ExpedientesContext = createContext<ExpedientesContextType | undefined>(undefined);

export function ExpedientesProvider({ children }: { children: React.ReactNode }) {
  const [expedientes, setExpedientes] = useState<ExpedienteJudicial[]>(EXPEDIENTES_INICIALES);
  const [vencimientos, setVencimientos] = useState<VencimientoProcesal[]>(VENCIMIENTOS_INICIALES);
  const [tareas, setTareas] = useState<TareaOperativa[]>(TAREAS_INICIALES);
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIALES);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>(AUDITORIA_INICIAL);

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const expLocal = localStorage.getItem(STORAGE_EXPEDIENTES);
      const vencLocal = localStorage.getItem(STORAGE_VENCIMIENTOS);
      const tarLocal = localStorage.getItem(STORAGE_TAREAS);
      const cliLocal = localStorage.getItem(STORAGE_CLIENTES);
      const audLocal = localStorage.getItem(STORAGE_AUDITORIA);

      if (expLocal) setExpedientes(JSON.parse(expLocal));
      if (vencLocal) setVencimientos(JSON.parse(vencLocal));
      if (tarLocal) setTareas(JSON.parse(tarLocal));
      if (cliLocal) setClientes(JSON.parse(cliLocal));
      if (audLocal) setAuditoria(JSON.parse(audLocal));
    } catch {
      // Ignorar error de parsing
    }
  }, []);

  const registrarEventoAuditoria = (
    usuario: Usuario,
    tipoOperacion: 'ACCESO' | 'CREACION' | 'MODIFICACION' | 'CONTROL_CUMPLIDO',
    detalle: string
  ) => {
    const nuevoRegistro: RegistroAuditoria = {
      id: `aud-${Date.now()}`,
      fechaHora: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'medium' }),
      usuarioNombre: usuario.nombreCompleto,
      rolUsuario: usuario.rol,
      tipoOperacion,
      detalle,
      ipOrigen: '190.210.45.12',
    };

    setAuditoria((prev) => {
      const actualizada = [nuevoRegistro, ...prev];
      try {
        localStorage.setItem(STORAGE_AUDITORIA, JSON.stringify(actualizada));
      } catch {}
      return actualizada;
    });
  };

  const agregarExpediente = (
    nuevoExpediente: Omit<ExpedienteJudicial, 'id' | 'movimientos'>,
    usuario: Usuario
  ) => {
    const expedienteCompleto: ExpedienteJudicial = {
      ...nuevoExpediente,
      id: `exp-${Date.now()}`,
      movimientos: [
        {
          id: `mov-${Date.now()}`,
          fechaActuacion: new Date().toLocaleDateString('es-AR'),
          tipoActuacion: 'Decreto',
          titulo: 'Caratulación y Registro Inicial de la Causa',
          descripcionFojas: 'Fs. 1. Se registra el ingreso del expediente en el despacho.',
          esComunicableAlCliente: true,
        },
      ],
    };

    setExpedientes((prev) => {
      const actualizados = [expedienteCompleto, ...prev];
      try {
        localStorage.setItem(STORAGE_EXPEDIENTES, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });

    registrarEventoAuditoria(
      usuario,
      'CREACION',
      `Apertura de nuevo expediente judicial N° ${nuevoExpediente.numeroCausa} ("${nuevoExpediente.caratula}").`
    );
  };

  const agregarMovimientoAExpediente = (
    expedienteId: string,
    movimiento: Omit<MovimientoProcesal, 'id' | 'fechaActuacion'>,
    usuario: Usuario
  ) => {
    const nuevoMovimiento: MovimientoProcesal = {
      ...movimiento,
      id: `mov-${Date.now()}`,
      fechaActuacion: new Date().toLocaleDateString('es-AR'),
    };

    setExpedientes((prev) => {
      const actualizados = prev.map((exp) => {
        if (exp.id === expedienteId) {
          return {
            ...exp,
            movimientos: [...exp.movimientos, nuevoMovimiento],
          };
        }
        return exp;
      });
      try {
        localStorage.setItem(STORAGE_EXPEDIENTES, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });

    registrarEventoAuditoria(
      usuario,
      'CREACION',
      `Asiento de movimiento procesal "${nuevoMovimiento.titulo}" en Expte. ID ${expedienteId} ${
        nuevoMovimiento.cargoJudicial ? 'con cargo judicial fehaciente' : ''
      }.`
    );
  };

  const alternarCumplimientoVencimiento = (vencimientoId: string, usuario: Usuario) => {
    setVencimientos((prev) => {
      const actualizados = prev.map((venc) => {
        if (venc.id === vencimientoId) {
          const nuevoEstado = !venc.cumplido;
          return {
            ...venc,
            cumplido: nuevoEstado,
            fechaCumplimiento: nuevoEstado
              ? new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
              : undefined,
          };
        }
        return venc;
      });
      try {
        localStorage.setItem(STORAGE_VENCIMIENTOS, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });

    const vEncontrado = vencimientos.find((v) => v.id === vencimientoId);
    registrarEventoAuditoria(
      usuario,
      'CONTROL_CUMPLIDO',
      `Control de plazo perentorio: "${vEncontrado?.descripcionActo}" marcado como ${
        vEncontrado?.cumplido ? 'pendiente' : 'cumplido debidamente'
      }.`
    );
  };

  const alternarEstadoTarea = (tareaId: string, usuario: Usuario) => {
    setTareas((prev) => {
      const actualizadas = prev.map((tar) => {
        if (tar.id === tareaId) {
          const siguienteEstado: EstadoTarea =
            tar.estado === 'Pendiente'
              ? 'En Curso'
              : tar.estado === 'En Curso'
              ? 'Finalizada'
              : 'Pendiente';
          return { ...tar, estado: siguienteEstado };
        }
        return tar;
      });
      try {
        localStorage.setItem(STORAGE_TAREAS, JSON.stringify(actualizadas));
      } catch {}
      return actualizadas;
    });

    const tEncontrada = tareas.find((t) => t.id === tareaId);
    registrarEventoAuditoria(
      usuario,
      'MODIFICACION',
      `Actualización de estado en tarea operativa: "${tEncontrada?.titulo}".`
    );
  };

  const agregarTarea = (
    tarea: Omit<TareaOperativa, 'id' | 'encomendadaPorNombre'>,
    usuario: Usuario
  ) => {
    const nuevaTarea: TareaOperativa = {
      ...tarea,
      id: `tar-${Date.now()}`,
      encomendadaPorNombre: usuario.nombreCompleto,
    };

    setTareas((prev) => {
      const actualizadas = [nuevaTarea, ...prev];
      try {
        localStorage.setItem(STORAGE_TAREAS, JSON.stringify(actualizadas));
      } catch {}
      return actualizadas;
    });

    registrarEventoAuditoria(
      usuario,
      'CREACION',
      `Delegación de tarea operativa "${nuevaTarea.titulo}" asignada a ${nuevaTarea.asignadaANombre}.`
    );
  };

  const agregarCliente = (
    nuevoCliente: Omit<Cliente, 'id' | 'cantidadCausasActivas'>,
    usuario: Usuario
  ) => {
    const clienteCompleto: Cliente = {
      ...nuevoCliente,
      id: `cli-${Date.now()}`,
      cantidadCausasActivas: 0,
    };

    setClientes((prev) => {
      const actualizados = [clienteCompleto, ...prev];
      try {
        localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });

    registrarEventoAuditoria(
      usuario,
      'CREACION',
      `Alta de nuevo cliente titular: "${nuevoCliente.nombreRazonSocial}" (CUIT/DNI ${nuevoCliente.identificadorFiscal}).`
    );
  };

  const reiniciarDatosDemo = () => {
    localStorage.removeItem(STORAGE_EXPEDIENTES);
    localStorage.removeItem(STORAGE_VENCIMIENTOS);
    localStorage.removeItem(STORAGE_TAREAS);
    localStorage.removeItem(STORAGE_CLIENTES);
    localStorage.removeItem(STORAGE_AUDITORIA);

    setExpedientes(EXPEDIENTES_INICIALES);
    setVencimientos(VENCIMIENTOS_INICIALES);
    setTareas(TAREAS_INICIALES);
    setClientes(CLIENTES_INICIALES);
    setAuditoria(AUDITORIA_INICIAL);
  };

  return (
    <ExpedientesContext.Provider
      value={{
        expedientes,
        vencimientos,
        tareas,
        clientes,
        auditoria,
        agregarExpediente,
        agregarMovimientoAExpediente,
        alternarCumplimientoVencimiento,
        alternarEstadoTarea,
        agregarTarea,
        agregarCliente,
        reiniciarDatosDemo,
      }}
    >
      {children}
    </ExpedientesContext.Provider>
  );
}

export function useExpedientes() {
  const context = useContext(ExpedientesContext);
  if (!context) {
    throw new Error('useExpedientes debe ser utilizado dentro de un ExpedientesProvider');
  }
  return context;
}
