"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const MINUTOS_INACTIVIDAD = 15;
const EVENTOS_ACTIVIDAD = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export function AutoLogout() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    function reiniciarTemporizador() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/panel/login");
      }, MINUTOS_INACTIVIDAD * 60 * 1000);
    }

    for (const evento of EVENTOS_ACTIVIDAD) {
      window.addEventListener(evento, reiniciarTemporizador);
    }
    reiniciarTemporizador();

    return () => {
      for (const evento of EVENTOS_ACTIVIDAD) {
        window.removeEventListener(evento, reiniciarTemporizador);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return null;
}
