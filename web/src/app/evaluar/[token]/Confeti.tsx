// Festejo breve al completar una sección o la autoevaluación. Solo CSS (ver
// `.confeti` en globals.css), sin dependencias: se oculta con
// prefers-reduced-motion y no intercepta clics.

const COLORES = ["#dc2626", "#f97316", "#facc15", "#16a34a", "#0284c7", "#1d4ed8"];
const PIEZAS = 36;

export function Confeti() {
  return (
    <div className="confeti" aria-hidden="true">
      {Array.from({ length: PIEZAS }, (_, i) => (
        // Posiciones derivadas del índice, no de Math.random: el render debe ser puro.
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            backgroundColor: COLORES[i % COLORES.length],
            animationDelay: `${(i * 53) % 450}ms`,
            animationDuration: `${1300 + ((i * 71) % 700)}ms`,
          }}
        />
      ))}
    </div>
  );
}
