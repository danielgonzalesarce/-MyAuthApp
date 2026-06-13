# MyAuthApp

Aplicación de autenticación con **Next.js**, **NextAuth.js** y **Tailwind CSS**.

## Características

- Login con Google, GitHub y credenciales (email/contraseña)
- Registro de usuarios con bcrypt
- Bloqueo temporal tras 5 intentos fallidos
- Rutas protegidas con middleware (`/dashboard`, `/profile`)

## Estructura del proyecto

```
next-auth-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth (guía)
│   │   │   ├── login-attempts/route.ts
│   │   │   └── register/route.ts
│   │   ├── dashboard/page.tsx                # Dashboard (guía)
│   │   ├── profile/page.tsx                  # Perfil (guía)
│   │   ├── signin/page.tsx                   # Login (guía: signIn)
│   │   ├── signin/register/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── LogoutButton.tsx                  # Guía
│   │   ├── SessionProvider.tsx               # Guía
│   │   ├── SignInForm.tsx
│   │   ├── AuthLayout.tsx
│   │   └── AppShell.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── loginAttempts.ts
│   │   └── dataDir.ts
│   └── middleware.ts                         # Guía
├── .env.example
├── next.config.ts
└── package.json
```

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno

Ver `.env.example`. Genera `NEXTAUTH_SECRET` en https://generate-secret.vercel.app/32

## Despliegue en Vercel

1. Importar repositorio desde GitHub
2. Configurar variables de entorno
3. Registrar URLs de callback en Google y GitHub:
   - `https://tu-dominio.vercel.app/api/auth/callback/google`
   - `https://tu-dominio.vercel.app/api/auth/callback/github`

## Links

- Repositorio: https://github.com/danielgonzalesarce/-MyAuthApp.git
- Producción: https://my-auth-app-flax.vercel.app
