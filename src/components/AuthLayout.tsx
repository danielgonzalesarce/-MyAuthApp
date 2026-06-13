interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo — oscuro, alto contraste */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.35)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.25)_0%,_transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold shadow-lg shadow-indigo-900/50">
            A
          </span>
          <span className="text-xl font-semibold tracking-tight">MyAuthApp</span>
        </div>

        <div className="relative z-10 max-w-md space-y-5">
          <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-white">
            Autenticación
            <span className="mt-1 block text-indigo-300">moderna y segura</span>
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Inicia sesión con Google, GitHub o credenciales. Contraseñas
            cifradas con bcrypt y bloqueo tras intentos fallidos.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Google", "GitHub", "Email"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          NextAuth.js · Tecsup
        </p>
      </div>

      {/* Panel derecho — formulario limpio */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            A
          </span>
          <span className="text-lg font-semibold text-slate-900">MyAuthApp</span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <header className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
            </header>

            {children}

            {footer ? (
              <div className="mt-7 border-t border-slate-100 pt-6">{footer}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
