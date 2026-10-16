export type RolUsuario = 'SOCIO_TITULAR' | 'ABOGADO' | 'PROCURADOR';

export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
  tituloProfesional: string;
  matricula: string;
  sectorOArea: string;
}

export type TipoPersona = 'Fisica' | 'Juridica';

export interface Cliente {
  id: string;
  nombreRazonSocial: string;
  identificadorFiscal: string; // CUIT / CUIL / DNI
  tipoPersona: TipoPersona;
  telefonoContacto: string;
  emailContacto: string;
  domicilioConstituido: string;
  cantidadCausasActivas: number;
}

export type FueroJudicial =
  | 'Civil y Comercial'
  | 'Laboral'
  | 'Familia y Sucesiones'
  | 'Contencioso Administrativo'
  | 'Penal';

export type EstadoProcesal =
  | 'En Trámite'
  | 'A Prueba'
  | 'Para Sentencia'
  | 'En Apelación'
  | 'Concluido';

export interface CargoJudicial {
  fechaPresentacion: string;
  horaPresentacion: string;
  funcionarioReceptor: string;
  fojasPresentadas: number;
}

export interface DocumentoJudicial {
  id: string;
  titulo: string;
  categoria: 'Escrito' | 'Decreto' | 'Sentencia' | 'Cédula' | 'Poder' | 'Prueba';
  numeroVersion: string;
  huellaSha256: string;
  fechaCarga: string;
  cantidadFojas: number;
  nombreArchivo: string;
}

export interface MovimientoProcesal {
  id: string;
  fechaActuacion: string;
  tipoActuacion: 'Decreto' | 'Escrito Presentado' | 'Audiencia' | 'Cédula Notificada' | 'Sentencia Interlocutoria';
  titulo: string;
  descripcionFojas: string;
  esComunicableAlCliente: boolean;
  cargoJudicial?: CargoJudicial;
  documentoAnexo?: DocumentoJudicial;
}

export interface ExpedienteJudicial {
  id: string;
  numeroCausa: string;
  caratula: string;
  fuero: FueroJudicial;
  juzgadoTribunal: string;
  secretariaJudicial: string;
  estadoProcesal: EstadoProcesal;
  fechaApertura: string;
  clienteId: string;
  clienteNombre: string;
  abogadoDirectorId: string;
  abogadoDirectorNombre: string;
  procuradorAsignadoNombre?: string;
  observacionesEstrategicas: string;
  movimientos: MovimientoProcesal[];
}

export type NivelCriticidad = 'Alta' | 'Media' | 'Baja';

export interface VencimientoProcesal {
  id: string;
  expedienteId: string;
  numeroCausa: string;
  caratula: string;
  fechaHoraLimite: string;
  descripcionActo: string;
  nivelCriticidad: NivelCriticidad;
  abogadoResponsableNombre: string;
  cumplido: boolean;
  fechaCumplimiento?: string;
}

export type EstadoTarea = 'Pendiente' | 'En Curso' | 'Finalizada';
export type PrioridadTarea = 'Urgente' | 'Normal' | 'Secundaria';

export interface TareaOperativa {
  id: string;
  expedienteId?: string;
  numeroCausa?: string;
  titulo: string;
  descripcionDetallada: string;
  nivelPrioridad: PrioridadTarea;
  estado: EstadoTarea;
  encomendadaPorNombre: string;
  asignadaANombre: string;
  fechaCompromiso: string;
}

export interface RegistroAuditoria {
  id: string;
  fechaHora: string;
  usuarioNombre: string;
  rolUsuario: RolUsuario;
  tipoOperacion: 'ACCESO' | 'CREACION' | 'MODIFICACION' | 'CONTROL_CUMPLIDO';
  detalle: string;
  ipOrigen: string;
}

