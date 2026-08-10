"use client";

import { useActionState } from "react";
import { iniciarSesion, type LoginState } from "./actions";

const ESTADO_INICIAL: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(iniciarSesion, ESTADO_INICIAL);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
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
            className="rounded-md border border-black/15 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Contraseña</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-black/15 px-3 py-2"
          />
        </label>
        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
