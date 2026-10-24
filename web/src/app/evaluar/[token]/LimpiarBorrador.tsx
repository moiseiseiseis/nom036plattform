"use client";

import { useEffect } from "react";
import { borrarBorrador } from "./borrador";

// La evaluación ya se envió: el borrador local ya no sirve y no debe
// reaparecer si alguien vuelve a abrir el enlace en este dispositivo.
export function LimpiarBorrador({ token }: { token: string }) {
  useEffect(() => {
    borrarBorrador(token);
  }, [token]);
  return null;
}
