// Borrador de la autoevaluación guardado en el navegador del respondiente,
// para que pueda cerrar la pestaña y retomar después sin perder lo avanzado.
// Es solo una comodidad local: lo que cuenta es lo que se envía al servidor.

export function claveBorrador(token: string): string {
  return `nom036:borrador:${token}`;
}

export function borrarBorrador(token: string): void {
  try {
    window.localStorage.removeItem(claveBorrador(token));
  } catch {
    // Almacenamiento bloqueado (modo privado, cookies deshabilitadas): no hay nada que borrar.
  }
}
