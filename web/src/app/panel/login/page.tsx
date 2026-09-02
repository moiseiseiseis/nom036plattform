"use client";

import { useActionState } from "react";
import { iniciarSesion, type LoginState } from "./actions";

const ESTADO_INICIAL: LoginState = { error: null };

const CAMPO =
  "rounded-lg border border-black/15 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(iniciarSesion, ESTADO_INICIAL);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Panel privado</h1>
          <p className="text-sm text-gray-600">NOM-036-1-STPS-2018 — Diagnóstico ergonómico</p>
        </div>
        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Correo</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className={CAMPO}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Contraseña</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={CAMPO}
            />
          </label>
          {state.error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-black px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
