"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "./Spinner";

export function BotonEnviar({
  children,
  textoPendiente,
  className,
}: {
  children: React.ReactNode;
  textoPendiente: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {pending && <Spinner />}
      {pending ? textoPendiente : children}
    </button>
  );
}
