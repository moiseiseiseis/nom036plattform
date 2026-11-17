import { Inter } from "next/font/google";

// Identidad visual del formulario público (Inter, fondo gris claro). Solo
// aplica a /evaluar: el panel privado conserva su tipografía.
const inter = Inter({ subsets: ["latin"] });

export default function EvaluarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex flex-1 flex-col bg-lienzo text-gray-900`}>{children}</div>
  );
}
