# WordCollab

Un editor de documentos colaborativo moderno y en tiempo real construido con React, TypeScript y Supabase. Escribe, edita y colabora con otros simultáneamente en documentos compartidos con actualizaciones en vivo y sincronización instantánea.

## Características

- **Colaboración en Tiempo Real** - Múltiples usuarios pueden editar documentos simultáneamente con actualizaciones en vivo
- **Edición de Texto Enriquecido** - Potente editor de texto con opciones de formato impulsado por TipTap
- **Chat en Vivo** - Mensajería integrada para comunicación del equipo mientras colaboras
- **Autenticación de Usuarios** - Registro e inicio de sesión seguro con Supabase Auth
- **Compartir Documentos** - Comparte documentos con colaboradores a través de enlaces de invitación
- **Perfiles de Usuario** - Gestiona perfiles de usuario y visualiza información de colaboradores
- **Diseño Responsivo** - Interfaz hermosa y amigable para dispositivos móviles construida con Tailwind CSS
- **Panel de Control de Documentos** - Examina y gestiona todos tus documentos en un solo lugar

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Herramienta de Construcción**: Vite
- **Estilos**: Tailwind CSS + PostCSS
- **Base de Datos en Tiempo Real**: Supabase (PostgreSQL)
- **Editor de Texto**: TipTap
- **Linting**: ESLint
- **Utilidades**: date-fns

## Requisitos Previos

- Node.js (v16 o superior)
- Gestor de paquetes npm o yarn
- Cuenta de Supabase para base de datos y autenticación

## Comenzar

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/kale63/wordcolab.git
cd wordcolab
```

2. Instala las dependencias:
```bash
npm install --legacy-peer-deps
```

3. Configura Supabase:
   - Crea un archivo `.env.local` en el directorio raíz
   - Añade la URL de tu proyecto de Supabase y la clave API:
```
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_supabase
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con recarga de módulos en caliente
- `npm run build` - Construye un paquete optimizado para producción
- `npm run lint` - Ejecuta ESLint para verificar la calidad del código
- `npm run preview` - Vista previa del build de producción localmente

## Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── Auth.tsx      # Componente de autenticación
│   ├── TiptapEditor.tsx # Editor de texto enriquecido
│   ├── LiveChat.tsx   # Funcionalidad de chat
│   └── ...
├── pages/            # Componentes de página
│   ├── Dashboard.tsx  # Panel principal
│   ├── DocumentPage.tsx # Editor de documentos
│   └── Profile.tsx    # Perfil de usuario
├── lib/              # Utilidades
│   ├── supabaseClient.ts # Configuración de Supabase
│   └── colors.ts     # Utilidades de color
├── App.tsx           # Componente raíz
└── main.tsx          # Punto de entrada
```

## Componentes Clave

- **TiptapEditor** - Editor de texto enriquecido con características colaborativas
- **LiveChat** - Mensajería en tiempo real entre colaboradores
- **ShareModal** - Comparte documentos con otros usuarios
- **CollaboratorList** - Visualiza colaboradores activos en un documento
- **Navbar** - Navegación y menú de usuario
- **Sidebar** - Acceso rápido a documentos y navegación

## Autenticación

WordCollab utiliza Autenticación de Supabase para gestión segura de usuarios. Los usuarios pueden:
- Registrarse con correo electrónico y contraseña
- Iniciar sesión en cuentas existentes
- Editar sus contraseñas

## Base de Datos

La aplicación utiliza Supabase PostgreSQL con suscripciones en tiempo real para sincronización instantánea de datos en todos los clientes conectados.

## Despliegue

El proyecto incluye un archivo `_redirects` configurado para despliegue en Netlify. Para desplegar:

1. Construye el paquete de producción:
```bash
npm run build
```

2. Despliega la carpeta `dist` en tu plataforma de hosting (Netlify, Vercel, etc.)

 O

 También puedes acceder a aquielenlaceperomasalrato para verlo desplegado!

**Hecho con ❤️ para la escritura colaborativa**