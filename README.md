# Sistema de Gestión de Expedientes Jurídicos — MVP

Plataforma forense corporativa desarrollada en **Next.js 16 (App Router)**, **TypeScript** y **Tailwind CSS**, diseñada para la demostración interactiva y el despliegue directo en **Vercel**.

Basada en la ingeniería y especificación formal de la *Carpeta del Sistema de Gestión de Estudios Jurídicos*.

---

## 🚀 Usuarios de Demostración

El sistema cuenta con autenticación preconfigurada para tres perfiles profesionales del estudio con diferentes roles y atribuciones:

| Usuario | Nombre Profesional | Rol en el Despacho | Contraseña |
| :--- | :--- | :--- | :--- |
| **`pmbejas@gmail.com`** | Dr. Pablo Bejas | **Socio Titular / Abogado Director** | `pepito123` |
| **`agarlati@gmail.com`** | Dr. Alejo Garlati | **Abogado Litigante / Especialista** | `pepito123` |
| **`asalas@gmail.com`** | Dr. Alejo Salas | **Procurador / Mesa de Entradas** | `pepito123` |

> 💡 **Modo Demostración Rápida:** La pantalla de inicio de sesión y la barra superior incluyen botones de acceso con un solo clic para alternar instantáneamente entre los tres perfiles sin necesidad de escribir las credenciales.

---

## ⚖️ Módulos Incluidos en el MVP

1. **Panel Principal (Dashboard Forense):**
   - Métricas en tiempo real: Expedientes activos, plazos perentorios inminentes (< 48 hs), diligencias en curso y cartera de clientes.
   - Distribución gráfica de causas por fuero (Civil y Comercial, Laboral, Familia, Contencioso Administrativo).
   - Cronología de actuaciones procesales recientes registradas en el estudio.

2. **Expedientes y Causas Judiciales:**
   - Buscador en tiempo real por número de causa, carátula, juzgado o cliente.
   - Filtros combinados por Fuero Jurisdiccional y Estado Procesal.
   - **Legajo Digital Completo:**
     - Datos de radicación tribunalicia (Juzgado, Secretaría Actuaria, Fuero).
     - Línea de tiempo procesal con fehaciencia de **Cargo Judicial** (fecha, hora y fojas certificadas).
     - **Custodia Criptográfica:** Escritos con versionado (`v1.0`, `v2.0`) y cálculo de huellas digitales **SHA-256 inmutables**.
     - Alta interactiva de nuevas actuaciones con cargo y hash.
   - Apertura interactiva de nuevos expedientes.

3. **Control de Vencimientos y Términos Fatales:**
   - Agenda perentoria con cálculo dinámico de horas/días restantes y alertas visuales.
   - Clasificación por Criticidad Procesal (Alta, Media, Baja).
   - Asignación inexcusable a un letrado director.
   - Marcado interactivo de cumplimiento con impacto en la bitácora de auditoría.

4. **Tareas Operativas y Diligencias del Despacho:**
   - Tablero de encargos entre miembros del equipo (encomendada por Socio/Abogado y asignada a Procurador).
   - Estados: *Pendiente*, *En Curso*, *Finalizada* con avance interactivo de etapas.
   - Creación de nuevas diligencias.

5. **Directorio de Clientes Patrocinados:**
   - Ficha de clientes (personas físicas y jurídicas) con CUIT/DNI, teléfonos, correos y domicilios constituidos.
   - Conteo de causas activas en trámite.
   - Alta de nuevos clientes.

6. **Bitácora Inmutable de Auditoría y Control:**
   - Trazabilidad integral de cada acción realizada en la plataforma (accesos, aperturas de causas, cargos y cumplimiento de plazos).
   - Fecha, hora, usuario interviniente, tipo de operación y dirección IP registrada.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript estricto
- **Estilos:** Tailwind CSS (diseño limpio y minimalista en tonos azules institucionales)
- **Iconografía:** Lucide React
- **Persistencia:** Estado reactivo en memoria con respaldo automático en `localStorage` (los datos modificados durante la demostración persisten al recargar la página).

---

## 📦 Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## ☁️ Despliegue en Vercel vía Git

1. Inicializar y subir el repositorio a GitHub:
   ```bash
   git add .
   git commit -m "feat: MVP Sistema de Gestion de Expedientes Juridicos"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
2. Ir a [Vercel](https://vercel.com) e iniciar sesión.
3. Hacer clic en **"Add New..."** → **"Project"**.
4. Seleccionar el repositorio de GitHub importado.
5. Vercel detectará automáticamente Next.js. Dejar la configuración por defecto y presionar **"Deploy"**.
6. En menos de 1 minuto el sistema estará publicado en línea con certificado SSL gratuito (`https://tu-proyecto.vercel.app`).
