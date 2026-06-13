"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import AuthLayout from "@/components/AuthLayout";

const MAX_ATTEMPTS = 5;

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function checkAttempts() {
      if (!email.includes("@")) {
        setAttemptsLeft(MAX_ATTEMPTS);
        setIsLocked(false);
        return;
      }

      const response = await fetch(
        `/api/login-attempts?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );

      if (!response.ok) return;

      const data = await response.json();
      setAttemptsLeft(data.attemptsLeft);
      setIsLocked(data.locked);

      if (data.locked) {
        setError(data.lockMessage);
      } else {
        setError((prev) =>
          prev.includes("bloqueada") || prev.includes("Intentos restantes")
            ? ""
            : prev
        );
      }
    }

    const timeout = setTimeout(checkAttempts, 400);
    return () => clearTimeout(timeout);
  }, [email]);

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleGitHubSignIn() {
    await signIn("github", { callbackUrl: "/dashboard" });
  }

  async function handleCredentialsSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const signInResult = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      setError(signInResult.error);

      const response = await fetch(
        `/api/login-attempts?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );

      if (response.ok) {
        const data = await response.json();
        setAttemptsLeft(data.attemptsLeft);
        setIsLocked(data.locked);
      }
      return;
    }

    if (signInResult?.ok) {
      router.push("/dashboard");
    }
  }

  const credentialsDisabled = loading || isLocked;

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Elige cómo quieres acceder"
      footer={
        <p className="text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/signin/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Crear cuenta
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <button type="button" onClick={handleGoogleSignIn} className="btn-oauth">
            <FaGoogle className="text-[1.1rem] text-[#EA4335]" />
            Continuar con Google
          </button>
          <button type="button" onClick={handleGitHubSignIn} className="btn-oauth">
            <FaGithub className="text-[1.1rem] text-slate-800" />
            Continuar con GitHub
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-medium uppercase tracking-wide text-slate-400">
              o con email
            </span>
          </div>
        </div>

        {error ? <div className="alert-error">{error}</div> : null}

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="nombre@correo.com"
              disabled={credentialsDisabled}
              required
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              {email.includes("@") && !isLocked ? (
                <span className="text-xs font-medium text-slate-400">
                  {attemptsLeft}/{MAX_ATTEMPTS} intentos
                </span>
              ) : null}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              disabled={credentialsDisabled}
              required
            />
          </div>

          <button type="submit" disabled={credentialsDisabled} className="btn-primary">
            {isLocked ? "Cuenta bloqueada" : loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-xs leading-relaxed text-slate-400">
          Tras {MAX_ATTEMPTS} intentos fallidos, la cuenta se bloquea 15 minutos.
        </p>
      </div>
    </AuthLayout>
  );
}
