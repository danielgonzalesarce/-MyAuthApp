# MyAuthApp

Aplicación de autenticación construida con **Next.js 16**, **NextAuth.js** y **Tailwind CSS**. Permite iniciar sesión con Google, GitHub o credenciales (email y contraseña), con rutas protegidas y bloqueo temporal tras intentos fallidos.

## Características

- Inicio de sesión con **Google OAuth**
- Inicio de sesión con **GitHub OAuth**
- Registro e inicio con **email y contraseña** (bcrypt)
- Protección de rutas con middleware (`/dashboard`, `/profile`)
- Bloqueo temporal tras 5 intentos fallidos (15 minutos)
- Dashboard y perfil de usuario autenticado

## Stack tecnológico

- [Next.js 16](https://nextjs.org/) (App Router)
- [NextAuth.js 4](https://next-auth.js.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Requisitos previos

- Node.js 18.17 o superior
- npm, yarn, pnpm o bun
- Cuentas de desarrollador en [Google Cloud Console](https://console.cloud.google.com/) y/o [GitHub Developer Settings](https://github.com/settings/developers) para OAuth

## Instalación local

```bash
git clone https://github.com/danielgonzalesarce/-MyAuthApp.git
cd -MyAuthApp
npm install
```

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# GitHub OAuth
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_secreto_largo_y_aleatorio
```

Genera `NEXTAUTH_SECRET` con:

```bash
openssl rand -base64 32
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm run dev`  | Servidor de desarrollo         |
| `npm run build`| Compilación de producción      |
| `npm run start`| Servidor de producción         |
| `npm run lint` | Análisis estático con ESLint   |

## Estructura del proyecto

```
next-auth-app/
├── src/
│   ├── app/
│   │   ├── (auth)/signin/       # Login y registro
│   │   ├── (main)/              # Dashboard, perfil y home
│   │   └── api/                 # NextAuth, registro, intentos de login
│   ├── components/              # UI y formularios
│   ├── lib/                     # Usuarios y control de intentos
│   └── middleware.ts            # Protección de rutas
├── public/
├── .env.local                   # Variables de entorno (no subir a Git)
└── package.json
```

## Despliegue en Vercel

Este repositorio está preparado para desplegarse directamente en [Vercel](https://vercel.com). La raíz del proyecto es la carpeta del repositorio (no hay subcarpeta adicional).

### 1. Importar el repositorio

1. Entra en [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `danielgonzalesarce/-MyAuthApp`
4. Vercel detectará automáticamente **Next.js** como framework

### 2. Variables de entorno

En **Settings → Environment Variables** de tu proyecto en Vercel, agrega:

| Variable               | Descripción                                      |
|------------------------|--------------------------------------------------|
| `GOOGLE_CLIENT_ID`     | Client ID de Google OAuth                        |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth                    |
| `GITHUB_ID`            | Client ID de GitHub OAuth                        |
| `GITHUB_SECRET`        | Client Secret de GitHub OAuth                    |
| `NEXTAUTH_SECRET`      | Secreto aleatorio para firmar tokens JWT         |
| `NEXTAUTH_URL`         | URL de producción (ej. `https://tu-app.vercel.app`) |

> **Importante:** `NEXTAUTH_URL` debe coincidir con la URL final de tu despliegue en Vercel.

### 3. Configurar OAuth en producción

**Google Cloud Console**

- Authorized JavaScript origins: `https://tu-app.vercel.app`
- Authorized redirect URIs: `https://tu-app.vercel.app/api/auth/callback/google`

**GitHub OAuth App**

- Homepage URL: `https://tu-app.vercel.app`
- Authorization callback URL: `https://tu-app.vercel.app/api/auth/callback/github`

### 4. Desplegar

Vercel compilará el proyecto con `npm run build` y lo publicará automáticamente en cada push a la rama principal.

### Nota sobre almacenamiento en Vercel

El registro con email/contraseña y el control de intentos fallidos usan archivos JSON locales (`data/`). En el entorno serverless de Vercel ese almacenamiento **no persiste** entre invocaciones. Para producción se recomienda migrar a una base de datos (PostgreSQL, MongoDB, Supabase, etc.). Los proveedores OAuth (Google y GitHub) funcionan correctamente en Vercel.

## Rutas principales

| Ruta         | Acceso   | Descripción              |
|--------------|----------|--------------------------|
| `/`          | Público  | Redirige a `/dashboard`  |
| `/signin`    | Público  | Inicio de sesión         |
| `/signin/register` | Público | Registro de usuario |
| `/dashboard` | Protegido| Panel principal          |
| `/profile`   | Protegido| Perfil del usuario       |

## Licencia

Proyecto educativo — uso libre con fines de aprendizaje.
