"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import type { CriterioConItems, Empresa, Item } from "@/lib/nom036/types";
import { enviarEvaluacion, type DatosGeneralesForm } from "./actions";
import { claveBorrador } from "./borrador";
import { Confeti } from "./Confeti";

// Mismo semáforo 0-4 que el instrumento original y el informe (rojo → azul).
// Colores en los tokens `nivel-*` de globals.css (degradado de azules).
const NIVELES = [
  {
    valor: 0,
    etiqueta: "Nada",
    chip: "bg-nivel-0 text-nivel-texto-oscuro",
    punto: "bg-nivel-0 text-nivel-texto-oscuro border-nivel-0",
  },
  {
    valor: 1,
    etiqueta: "Mínimo",
    chip: "bg-nivel-1 text-nivel-texto-oscuro",
    punto: "bg-nivel-1 text-nivel-texto-oscuro border-nivel-1",
  },
  {
    valor: 2,
    etiqueta: "Regular",
    chip: "bg-nivel-2 text-white",
    punto: "bg-nivel-2 text-white border-nivel-2",
  },
  {
    valor: 3,
    etiqueta: "Aceptable",
    chip: "bg-nivel-3 text-white",
    punto: "bg-nivel-3 text-white border-nivel-3",
  },
  {
    valor: 4,
    etiqueta: "Óptimo",
    chip: "bg-nivel-4 text-white",
    punto: "bg-nivel-4 text-white border-nivel-4",
  },
] as const;

const OPCIONES_TURNOS = ["Un turno", "Dos turnos", "Tres turnos", "Turnos rotativos"];

const ESTADOS_MX = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán",
  "Zacatecas",
];

// Tiempo aproximado por pregunta, solo para el "≈ N min restantes".
const SEGUNDOS_POR_PREGUNTA = 15;
// Pausa breve tras elegir una opción, para que se vea la selección antes de avanzar.
const RETARDO_AVANCE_MS = 260;
// Duración de la salida de la pantalla actual: igual que `.paso-salir` en globals.css.
const DURACION_SALIDA_MS = 140;

// Se muestra al iniciar la sección siguiente a la que se acaba de completar.
const MENSAJES_SECCION_COMPLETA = [
  "¡Buen comienzo! La primera parte ya quedó.",
  "¡Muy bien! Dos secciones completas.",
  "¡Más de la mitad del camino!",
  "¡Ya casi! Solo queda una sección.",
];

const DATOS_VACIOS: DatosGeneralesForm = {
  calle: "",
  colonia: "",
  codigo_postal: "",
  municipio: "",
  estado: "",
  giro: "",
  num_trabajadores: "",
  turnos: "",
  descripcion_mmh: "",
};

type Paso =
  | { tipo: "bienvenida" }
  | { tipo: "datos" }
  | { tipo: "seccion"; c: number }
  | { tipo: "pregunta"; c: number; i: number }
  | { tipo: "revision" };

interface Borrador {
  datos: DatosGeneralesForm;
  respuestas: Record<string, number>;
  paso: number;
}

type ErroresDatos = Partial<Record<keyof DatosGeneralesForm, string>>;

function validarDatos(d: DatosGeneralesForm): ErroresDatos {
  const errores: ErroresDatos = {};
  const requerido = "Este dato es necesario para el informe.";
  if (!d.calle.trim()) errores.calle = requerido;
  if (!d.colonia.trim()) errores.colonia = requerido;
  if (!/^\d{5}$/.test(d.codigo_postal.trim())) errores.codigo_postal = "El código postal debe tener 5 dígitos.";
  if (!d.municipio.trim()) errores.municipio = requerido;
  if (!d.estado) errores.estado = "Falta seleccionar el estado.";
  if (!d.giro.trim()) errores.giro = requerido;
  const n = Number(d.num_trabajadores);
  if (!Number.isInteger(n) || n <= 0) errores.num_trabajadores = "Debe ser un número entero mayor que 0.";
  if (!d.turnos.trim()) errores.turnos = "Falta seleccionar una opción.";
  if (!d.descripcion_mmh.trim()) errores.descripcion_mmh = requerido;
  return errores;
}

function leerBorrador(token: string): Borrador | null {
  try {
    const crudo = window.localStorage.getItem(claveBorrador(token));
    if (!crudo) return null;
    const b = JSON.parse(crudo) as Partial<Borrador>;
    return {
      datos: { ...DATOS_VACIOS, ...(b.datos ?? {}) },
      respuestas: b.respuestas && typeof b.respuestas === "object" ? b.respuestas : {},
      paso: typeof b.paso === "number" ? b.paso : 0,
    };
  } catch {
    return null;
  }
}

export function EvaluacionForm({
  token,
  empresa,
  criterios,
}: {
  token: string;
  empresa: Empresa;
  criterios: CriterioConItems[];
}) {
  const pasos = useMemo<Paso[]>(() => {
    const lista: Paso[] = [{ tipo: "bienvenida" }, { tipo: "datos" }];
    criterios.forEach((criterio, c) => {
      lista.push({ tipo: "seccion", c });
      criterio.items.forEach((_, i) => lista.push({ tipo: "pregunta", c, i }));
    });
    lista.push({ tipo: "revision" });
    return lista;
  }, [criterios]);

  const todosLosItems = useMemo(() => criterios.flatMap((c) => c.items), [criterios]);
  const itemIds = useMemo(() => todosLosItems.map((item) => item.id), [todosLosItems]);

  const [actual, setActual] = useState(0);
  const [datos, setDatos] = useState<DatosGeneralesForm>(DATOS_VACIOS);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [desdeRevision, setDesdeRevision] = useState(false);
  const [pasoGuardado, setPasoGuardado] = useState<number | null>(null);
  const [cargado, setCargado] = useState(false);
  const [erroresDatos, setErroresDatos] = useState<ErroresDatos>({});
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [saliendo, setSaliendo] = useState(false);
  const [celebrar, setCelebrar] = useState(false);
  const [hojaSecciones, setHojaSecciones] = useState(false);
  const [hojaAyuda, setHojaAyuda] = useState(false);
  // Columna de ayuda (≥ 1024 px): cerrada de entrada para no saturar; si la
  // empresa la despliega, se queda abierta en las preguntas siguientes.
  const [ayudaDesplegada, setAyudaDesplegada] = useState(false);
  const idAyudaLateral = useId();
  const [enviando, startTransition] = useTransition();

  const tituloRef = useRef<HTMLHeadingElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const primerRender = useRef(true);

  // Retomar el borrador local, si existe. Se lee después del montaje (no en
  // el estado inicial) para que el HTML del servidor y el del cliente coincidan.
  useEffect(() => {
    const borrador = leerBorrador(token);
    if (borrador) {
      const idsValidos = new Set(itemIds);
      const respuestasValidas = Object.fromEntries(
        Object.entries(borrador.respuestas).filter(
          ([id, nivel]) => idsValidos.has(id) && Number.isInteger(nivel) && nivel >= 0 && nivel <= 4
        )
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronización única con localStorage al montar
      setDatos(borrador.datos);
      setRespuestas(respuestasValidas);
      if (borrador.paso > 1 && borrador.paso < pasos.length) setPasoGuardado(borrador.paso);
    }
    setCargado(true);
  }, [token, itemIds, pasos.length]);

  useEffect(() => {
    if (!cargado) return;
    try {
      const borrador: Borrador = { datos, respuestas, paso: actual };
      window.localStorage.setItem(claveBorrador(token), JSON.stringify(borrador));
    } catch {
      // Sin almacenamiento disponible el formulario sigue funcionando, solo sin borrador.
    }
  }, [cargado, token, datos, respuestas, actual]);

  // Al cambiar de pantalla: arriba del todo y el foco en el título, para que
  // un lector de pantalla anuncie la nueva pregunta.
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    tituloRef.current?.focus({ preventScroll: true });
  }, [actual]);

  useEffect(() => () => {
    if (temporizador.current) clearTimeout(temporizador.current);
  }, []);

  const indiceRevision = pasos.length - 1;
  const paso = pasos[actual];
  const respondidas = itemIds.filter((id) => respuestas[id] !== undefined).length;
  const total = itemIds.length;

  const irA = useCallback(
    (indice: number, festejar = false) => {
      if (temporizador.current) clearTimeout(temporizador.current);
      const destino = Math.max(0, Math.min(indice, pasos.length - 1));
      const cambiar = () => {
        setSaliendo(false);
        setCelebrar(festejar);
        setActual(destino);
      };
      setDireccion(destino >= actual ? 1 : -1);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cambiar();
        return;
      }
      setSaliendo(true);
      temporizador.current = setTimeout(cambiar, DURACION_SALIDA_MS);
    },
    [actual, pasos.length]
  );

  // `respuestasNuevas` son las que incluyen la opción recién elegida: el
  // avance automático corre antes de que el estado `respuestas` se actualice
  // en este closure. El festejo es solo al completar algo en ese momento, no
  // cada vez que se vuelve a pasar por la misma pantalla.
  const siguiente = useCallback(
    (respuestasNuevas: Record<string, number> = respuestas) => {
      if (paso.tipo === "datos") {
        const errores = validarDatos(datos);
        setErroresDatos(errores);
        const primero = (Object.keys(DATOS_VACIOS) as (keyof DatosGeneralesForm)[]).find((c) => errores[c]);
        if (primero) {
          // Llevar a la empresa al primer dato con error (en móvil puede estar
          // fuera de la pantalla). Turnos es un grupo de opciones, no un campo.
          const campo =
            document.getElementById(`campo-${primero}`) ??
            document.querySelector<HTMLElement>('[aria-labelledby="etiqueta-turnos"] [role="radio"]');
          campo?.scrollIntoView({ block: "center" });
          campo?.focus({ preventScroll: true });
          return;
        }
      }
      const completo = (ids: string[], r: Record<string, number>) =>
        ids.every((id) => r[id] !== undefined);
      const seCompleta = (ids: string[]) =>
        completo(ids, respuestasNuevas) && !completo(ids, respuestas);

      if (desdeRevision) {
        setDesdeRevision(false);
        irA(indiceRevision, seCompleta(itemIds));
        return;
      }
      const destino = pasos[actual + 1];
      const festejar =
        destino?.tipo === "seccion"
          ? destino.c > 0 && seCompleta(criterios[destino.c - 1].items.map((item) => item.id))
          : destino?.tipo === "revision" && seCompleta(itemIds);
      irA(actual + 1, festejar);
    },
    [paso, datos, respuestas, desdeRevision, actual, pasos, criterios, itemIds, indiceRevision, irA]
  );

  const anterior = useCallback(() => {
    if (desdeRevision) {
      setDesdeRevision(false);
      irA(indiceRevision);
      return;
    }
    irA(actual - 1);
  }, [desdeRevision, actual, indiceRevision, irA]);

  const responder = useCallback(
    (item: Item, nivel: number) => {
      const nuevas = { ...respuestas, [item.id]: nivel };
      setRespuestas(nuevas);
      setSaliendo(false);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => siguiente(nuevas), RETARDO_AVANCE_MS);
    },
    [respuestas, siguiente]
  );

  const editarDesdeRevision = (indice: number) => {
    setDesdeRevision(true);
    irA(indice);
  };

  const indicePregunta = (c: number, i: number) =>
    pasos.findIndex((p) => p.tipo === "pregunta" && p.c === c && p.i === i);

  // Navegación por secciones: se puede ir a las completas y a la primera
  // incompleta (donde va la empresa), nunca saltar adelante. Requiere los
  // datos generales válidos, igual que el botón "Siguiente" de ese paso.
  const datosValidos = Object.keys(validarDatos(datos)).length === 0;
  const seccionCompleta = (c: number) =>
    criterios[c].items.every((item) => respuestas[item.id] !== undefined);
  const frontera = criterios.findIndex((_, c) => !seccionCompleta(c));
  const puedeIrASeccion = (c: number) => datosValidos && (seccionCompleta(c) || c === frontera);

  const irASeccion = (c: number) => {
    setHojaSecciones(false);
    if (!puedeIrASeccion(c)) return;
    setDesdeRevision(false);
    const items = criterios[c].items;
    const pendiente = items.findIndex((item) => respuestas[item.id] === undefined);
    // Sección sin empezar: su portada. Empezada: la primera pregunta sin
    // responder. Completa: su primera pregunta, para revisarla.
    const destino =
      pendiente === 0
        ? pasos.findIndex((p) => p.tipo === "seccion" && p.c === c)
        : indicePregunta(c, pendiente === -1 ? 0 : pendiente);
    if (destino !== actual) irA(destino);
  };

  // Atajos de teclado: 0-4 eligen la opción, Enter avanza.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const destino = e.target as HTMLElement | null;
      if (destino && ["INPUT", "TEXTAREA", "SELECT"].includes(destino.tagName)) return;
      // Con una hoja abierta, la pregunta de atrás no debe responderse.
      if (document.querySelector("dialog[open]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (paso.tipo === "pregunta" && /^[0-4]$/.test(e.key)) {
        e.preventDefault();
        responder(criterios[paso.c].items[paso.i], Number(e.key));
      } else if (e.key === "Enter" && destino?.tagName !== "BUTTON") {
        if (paso.tipo === "seccion" || paso.tipo === "bienvenida") {
          e.preventDefault();
          siguiente();
        } else if (paso.tipo === "pregunta") {
          const item = criterios[paso.c].items[paso.i];
          if (respuestas[item.id] !== undefined) {
            e.preventDefault();
            siguiente();
          }
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paso, criterios, respuestas, responder, siguiente]);

  function enviar() {
    setErrorEnvio(null);
    const errores = validarDatos(datos);
    if (Object.keys(errores).length > 0) {
      setErroresDatos(errores);
      setErrorEnvio("Faltan datos generales de la empresa.");
      return;
    }
    startTransition(async () => {
      const resultado = await enviarEvaluacion(token, itemIds, { datos, respuestas });
      if (resultado?.error) setErrorEnvio(resultado.error);
    });
  }

  if (!cargado) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
      </div>
    );
  }

  const enCuestionario = paso.tipo !== "bienvenida";
  // En los datos generales todavía no hay secciones a las que ir: sin columna
  // lateral ni hoja, y el encabezado queda solo informativo.
  const conSecciones = enCuestionario && paso.tipo !== "datos";
  const itemActual = paso.tipo === "pregunta" ? criterios[paso.c].items[paso.i] : null;
  const ayudaActual = itemActual && tieneAyuda(itemActual) ? itemActual : null;
  const seccionActual = paso.tipo === "seccion" || paso.tipo === "pregunta" ? paso.c : null;
  const minutosRestantes = Math.ceil(((total - respondidas) * SEGUNDOS_POR_PREGUNTA) / 60);
  const listaSecciones = (variante: "lateral" | "hoja") => (
    <ListaSecciones
      variante={variante}
      criterios={criterios}
      respuestas={respuestas}
      seccionActual={seccionActual}
      puedeIr={puedeIrASeccion}
      onIr={irASeccion}
    />
  );

  return (
    // Alto mínimo de la ventana: la navegación se queda pegada abajo aunque la
    // pantalla actual (p. ej. el inicio de una sección) tenga poco contenido.
    <div className="flex min-h-dvh flex-col">
      {enCuestionario && (
        <Encabezado
          empresa={empresa.nombre}
          criterios={criterios}
          respuestas={respuestas}
          seccionActual={seccionActual}
          paso={paso.tipo}
          minutosRestantes={respondidas < total ? minutosRestantes : null}
          onAbrirSecciones={() => setHojaSecciones(true)}
        />
      )}

      {/* Fuera del contenedor animado: un ancestro con transform cambiaría la
          referencia de su position: fixed. */}
      {celebrar && !saliendo && <Confeti key={`confeti-${actual}`} />}

      <div className="flex flex-1">
        {conSecciones && (
          // Escritorio (≥ 1280 px): secciones en una columna blanca a toda la
          // altura, debajo del encabezado (3 rem + 1 px de borde).
          <nav
            aria-label="Secciones"
            className="sticky top-[calc(3rem+1px)] hidden h-[calc(100dvh-3rem-1px)] w-60 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-gray-200 bg-white px-3 py-4 xl:flex"
          >
            <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Secciones
            </p>
            {listaSecciones("lateral")}
          </nav>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
      <div
        key={actual}
        className={`mx-auto w-full max-w-[720px] flex-1 px-4 pt-3 pb-4 sm:px-6 sm:pt-6 sm:pb-6 ${
          saliendo ? "paso-salir pointer-events-none" : "paso-entrar"
        }`}
        style={{ "--direccion": direccion } as React.CSSProperties}
      >
        {paso.tipo === "bienvenida" && (
          <Bienvenida
            tituloRef={tituloRef}
            empresa={empresa.nombre}
            numCriterios={criterios.length}
            total={total}
            respondidas={respondidas}
            pasoGuardado={pasoGuardado}
            onComenzar={() => irA(1)}
            onContinuar={() => pasoGuardado !== null && irA(pasoGuardado)}
          />
        )}

        {paso.tipo === "datos" && (
          <PasoDatos
            tituloRef={tituloRef}
            empresa={empresa.nombre}
            datos={datos}
            errores={erroresDatos}
            onChange={(campo, valor) => {
              setDatos((prev) => ({ ...prev, [campo]: valor }));
              setErroresDatos((prev) => ({ ...prev, [campo]: undefined }));
            }}
          />
        )}

        {paso.tipo === "seccion" && (
          <PasoSeccion
            tituloRef={tituloRef}
            criterio={criterios[paso.c]}
            indice={paso.c}
            numCriterios={criterios.length}
            anteriorCompleta={
              paso.c > 0 &&
              criterios[paso.c - 1].items.every((item) => respuestas[item.id] !== undefined)
            }
            respondidasSeccion={
              criterios[paso.c].items.filter((item) => respuestas[item.id] !== undefined).length
            }
            celebrar={celebrar}
          />
        )}

        {paso.tipo === "pregunta" && (
          <PasoPregunta
            tituloRef={tituloRef}
            criterio={criterios[paso.c]}
            item={criterios[paso.c].items[paso.i]}
            indice={paso.i}
            esUltimaSeccion={paso.c === criterios.length - 1}
            seleccionado={respuestas[criterios[paso.c].items[paso.i].id]}
            onResponder={responder}
            onAbrirAyuda={ayudaActual ? () => setHojaAyuda(true) : null}
          />
        )}

        {paso.tipo === "revision" && (
          <PasoRevision
            tituloRef={tituloRef}
            criterios={criterios}
            datos={datos}
            datosCompletos={Object.keys(validarDatos(datos)).length === 0}
            respuestas={respuestas}
            respondidas={respondidas}
            total={total}
            enviando={enviando}
            error={errorEnvio}
            onEditarDatos={() => editarDesdeRevision(1)}
            onEditarPregunta={(c, i) => editarDesdeRevision(indicePregunta(c, i))}
            onEnviar={enviar}
          />
        )}
      </div>

      {paso.tipo !== "bienvenida" && paso.tipo !== "revision" && (
        <Navegacion
          puedeAvanzar={
            paso.tipo !== "pregunta" ||
            respuestas[criterios[paso.c].items[paso.i].id] !== undefined
          }
          etiquetaSiguiente={
            desdeRevision
              ? "Volver al resumen"
              : paso.tipo === "seccion"
                ? "Comenzar sección"
                : actual === indiceRevision - 1
                  ? "Ver resumen"
                  : "Siguiente"
          }
          onAnterior={anterior}
          onSiguiente={() => siguiente()}
          mostrarAtajos={paso.tipo === "pregunta"}
        />
      )}
        </div>

        {ayudaActual && (
          // ≥ 1024 px: columna derecha con un botón que despliega la ayuda.
          // En pantallas menores, la misma ayuda va en una hoja (botón en la pregunta).
          <aside
            aria-label="Ayuda para esta pregunta"
            className="hidden w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-gray-200 bg-white px-5 py-5 lg:flex xl:w-[320px]"
          >
            <button
              type="button"
              aria-expanded={ayudaDesplegada}
              aria-controls={idAyudaLateral}
              onClick={() => setAyudaDesplegada((v) => !v)}
              className="flex w-full items-center gap-2 rounded-xl bg-seleccion px-3.5 py-2.5 text-left text-sm font-medium text-blue-700 transition-colors hover:bg-pista focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
            >
              <IconoInfo className="h-4 w-4 shrink-0" />
              <span className="flex-1">¿Qué significa? · Cómo responder</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 shrink-0 transition-transform ${ayudaDesplegada ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div id={idAyudaLateral} hidden={!ayudaDesplegada} className="flex flex-1 flex-col">
              <ContenidoAyuda item={ayudaActual} />
            </div>
          </aside>
        )}
      </div>

      {ayudaActual && (
        <Hoja
          abierta={hojaAyuda}
          onCerrar={() => setHojaAyuda(false)}
          titulo="Ayuda para esta pregunta"
          ocultarDesde="lg"
          pie={
            <button type="button" onClick={() => setHojaAyuda(false)} className={`${BOTON_PRIMARIO} w-full`}>
              Entendido
            </button>
          }
        >
          <ContenidoAyuda item={ayudaActual} />
        </Hoja>
      )}

      {conSecciones && (
        <Hoja
          abierta={hojaSecciones}
          onCerrar={() => setHojaSecciones(false)}
          titulo="Secciones"
          ocultarDesde="xl"
          detalle={
            <>
              {respondidas < total && `≈ ${minutosRestantes} min restantes · `}
              {GUARDADO}
            </>
          }
        >
          {listaSecciones("hoja")}
        </Hoja>
      )}
    </div>
  );
}

// El borrador vive solo en este navegador (`borrador.ts`): decirlo así evita
// que la empresa crea que puede retomar desde otro dispositivo.
const GUARDADO = "Guardado en este dispositivo";

// ---------------------------------------------------------------------------
// Piezas de la interfaz

const TARJETA = "rounded-2xl border border-gray-200 bg-white p-5 sm:p-8";
const TITULO = "text-2xl font-bold leading-tight outline-none sm:text-3xl";
const CAMPO =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-base outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-700/30";

const respondidasDe = (criterio: CriterioConItems, respuestas: Record<string, number>) =>
  criterio.items.filter((item) => respuestas[item.id] !== undefined).length;

function Encabezado({
  empresa,
  criterios,
  respuestas,
  seccionActual,
  paso,
  minutosRestantes,
  onAbrirSecciones,
}: {
  empresa: string;
  criterios: CriterioConItems[];
  respuestas: Record<string, number>;
  seccionActual: number | null;
  paso: Paso["tipo"];
  minutosRestantes: number | null;
  onAbrirSecciones: () => void;
}) {
  const ubicacion =
    seccionActual !== null
      ? `Sección ${seccionActual + 1} de ${criterios.length}`
      : paso === "datos"
        ? "Datos generales"
        : "Resumen";
  const total = criterios.reduce((n, c) => n + c.items.length, 0);
  const respondidas = criterios.reduce((n, c) => n + respondidasDe(c, respuestas), 0);

  if (paso === "datos") {
    return (
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex h-12 items-center justify-between gap-3 px-4 text-[13px] sm:px-6 xl:text-sm">
          <span className="truncate font-semibold xl:text-[15px]">{empresa}</span>
          <span className="shrink-0 text-gray-600">Datos generales</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      {/* Escritorio: barra simple; las secciones van en la columna lateral. */}
      <div className="hidden h-12 items-center justify-between gap-3 px-6 xl:flex">
        <span className="truncate text-[15px] font-semibold">{empresa}</span>
        <span className="shrink-0 text-sm text-gray-600 tabular-nums">
          {ubicacion}
          {minutosRestantes !== null && ` · ≈ ${minutosRestantes} min restantes`} · {GUARDADO}
        </span>
      </div>

      {/* Móvil, tableta y pantallas medianas: todo el encabezado abre la hoja de secciones. */}
      <button
        type="button"
        onClick={onAbrirSecciones}
        aria-haspopup="dialog"
        className="flex w-full flex-col gap-2 px-4 py-2.5 bajo:py-2 text-left focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none focus-visible:ring-inset sm:px-6 xl:hidden"
      >
        <span className="flex w-full items-center justify-between gap-3 text-[13px]">
          <span className="truncate font-semibold">{empresa}</span>
          <span className="flex shrink-0 items-center gap-1 text-gray-600">
            {ubicacion}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span className="sr-only">. Ver secciones</span>
          </span>
        </span>
        <span
          className="grid w-full gap-1.5"
          style={{ gridTemplateColumns: `repeat(${criterios.length}, minmax(0, 1fr))` }}
          role="progressbar"
          aria-label="Avance de la autoevaluación"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={respondidas}
        >
          {criterios.map((criterio, c) => {
            const pct = criterio.items.length ? (respondidasDe(criterio, respuestas) / criterio.items.length) * 100 : 0;
            return (
              <span
                key={criterio.numero}
                className={`h-1.5 overflow-hidden rounded-full ${seccionActual === c ? "bg-pista" : "bg-gray-200"}`}
              >
                <span
                  className="block h-full rounded-full bg-blue-700 transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </span>
            );
          })}
        </span>
      </button>
    </header>
  );
}

// Una sola lista para la columna lateral (escritorio) y la hoja de secciones
// (móvil): cambian solo el espaciado y el conteo a la derecha.
function ListaSecciones({
  variante,
  criterios,
  respuestas,
  seccionActual,
  puedeIr,
  onIr,
}: {
  variante: "lateral" | "hoja";
  criterios: CriterioConItems[];
  respuestas: Record<string, number>;
  seccionActual: number | null;
  puedeIr: (c: number) => boolean;
  onIr: (c: number) => void;
}) {
  const fila = variante === "hoja" ? "min-h-12 px-3 text-sm" : "px-2 py-2 text-[13px]";
  return (
    <ol className="flex flex-col gap-0.5">
      {criterios.map((criterio, c) => {
        const hechas = respondidasDe(criterio, respuestas);
        const n = criterio.items.length;
        const completa = hechas === n;
        const actual = seccionActual === c;
        const nombre = (
          <span className="min-w-0 flex-1">
            {criterio.numero} · {criterio.nombre}
          </span>
        );
        const conteo = variante === "hoja" && (
          <span className="shrink-0 text-xs text-gray-600 tabular-nums">
            {hechas}/{n}
          </span>
        );
        const contenido = actual ? (
          <span className="flex w-full flex-col gap-1.5">
            <span className="flex items-start gap-2 font-semibold text-blue-900">
              {nombre}
              {conteo}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-pista">
              <span
                className="block h-full rounded-full bg-blue-700 transition-[width] duration-300"
                style={{ width: `${(hechas / n) * 100}%` }}
              />
            </span>
            {variante === "lateral" && (
              <span className="text-xs text-gray-700">
                {hechas} de {n} respondidas
              </span>
            )}
          </span>
        ) : (
          <span className="flex w-full items-start gap-2">
            {completa ? (
              <IconoCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
            ) : (
              <span className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {nombre}
            {conteo}
          </span>
        );
        const clases = `flex w-full items-center rounded-lg text-left ${fila} ${
          actual ? "bg-seleccion py-2.5" : completa ? "text-gray-700" : "text-gray-600"
        }`;
        const estado = completa ? "completa" : actual ? `${hechas} de ${n} respondidas` : "pendiente";
        return (
          <li key={criterio.numero}>
            {puedeIr(c) ? (
              <button
                type="button"
                onClick={() => onIr(c)}
                aria-current={actual ? "step" : undefined}
                aria-label={`Sección ${criterio.numero}: ${criterio.nombre}, ${estado}`}
                className={`${clases} transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none ${
                  actual ? "hover:bg-seleccion" : ""
                }`}
              >
                {contenido}
              </button>
            ) : (
              <div className={clases} aria-current={actual ? "step" : undefined}>
                {contenido}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Hoja inferior sobre un `<dialog>` nativo: showModal() atrapa el foco, Esc la
// cierra y, al cerrarse, el navegador devuelve el foco a quien la abrió.
// Desde este ancho la hoja no se usa: su contenido ya está en pantalla
// (secciones en la columna lateral ≥ 1280 px, ayuda en la columna derecha ≥ 1024 px).
const CORTE_HOJA = {
  lg: { clase: "lg:hidden", consulta: "(min-width: 64rem)" },
  xl: { clase: "xl:hidden", consulta: "(min-width: 80rem)" },
} as const;

function Hoja({
  abierta,
  onCerrar,
  titulo,
  detalle,
  ocultarDesde,
  pie,
  children,
}: {
  abierta: boolean;
  onCerrar: () => void;
  titulo: string;
  detalle?: React.ReactNode;
  ocultarDesde: keyof typeof CORTE_HOJA;
  pie?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const corte = CORTE_HOJA[ocultarDesde];
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierta && !dialogo.open) dialogo.showModal();
    if (!abierta && dialogo.open) dialogo.close();
  }, [abierta]);

  // Desde el corte la hoja no se muestra: si la ventana crece con la hoja
  // abierta, se cierra para no dejar la página bloqueada detrás.
  useEffect(() => {
    if (!abierta) return;
    const ancho = window.matchMedia(corte.consulta);
    const alCambiar = () => ancho.matches && onCerrar();
    alCambiar();
    ancho.addEventListener("change", alCambiar);
    return () => ancho.removeEventListener("change", alCambiar);
  }, [abierta, onCerrar, corte.consulta]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      // Un clic fuera del contenido cae en el propio <dialog> (su fondo).
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
      className={`hoja ${corte.clase}`}
    >
      <div className="flex flex-col gap-3 px-4 pt-2.5 pb-6 sm:px-6">
        <span className="h-1 w-10 self-center rounded-full bg-gray-300" aria-hidden="true" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id={idTitulo} className="text-[17px] font-bold">
              {titulo}
            </h2>
            {detalle && <p className="text-[13px] text-gray-600">{detalle}</p>}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        {children}
        {pie && <div className="pt-2">{pie}</div>}
      </div>
    </dialog>
  );
}

const tieneAyuda = (item: Item) =>
  Boolean(item.ayuda_definicion || item.ayuda_preguntas_guia?.length || item.numeral_nom);

// Un solo contenido de ayuda para el panel derecho y la hoja de móvil.
function ContenidoAyuda({ item }: { item: Item }) {
  const numeral = item.numeral_nom;
  return (
    <div className="flex flex-1 flex-col gap-4">
      {item.ayuda_definicion && (
        <p className="rounded-xl bg-seleccion px-3.5 py-3 text-[13.5px] leading-relaxed text-nivel-texto-oscuro">
          <ConNegritas texto={item.ayuda_definicion} />
        </p>
      )}
      {item.ayuda_preguntas_guia?.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-900">Para responder, conviene considerar:</p>
          <ol className="flex flex-col gap-2">
            {item.ayuda_preguntas_guia.map((pregunta, i) => (
              <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-gray-700">
                <span className="font-semibold text-blue-700" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{pregunta}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {numeral && (
        <p className="mt-auto border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-600">
          Referencia: NOM-036-1-STPS-2018, {/\sy\s/.test(numeral) ? "numerales" : "numeral"} {numeral}
        </p>
      )}
    </div>
  );
}

function IconoInfo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function Bienvenida({
  tituloRef,
  empresa,
  numCriterios,
  total,
  respondidas,
  pasoGuardado,
  onComenzar,
  onContinuar,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  empresa: string;
  numCriterios: number;
  total: number;
  respondidas: number;
  pasoGuardado: number | null;
  onComenzar: () => void;
  onContinuar: () => void;
}) {
  const hayAvance = pasoGuardado !== null;
  return (
    <section className="flex flex-col gap-6 sm:pt-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
          Autoevaluación · NOM-036-1-STPS-2018
        </p>
        <h1 ref={tituloRef} tabIndex={-1} className={TITULO}>
          {hayAvance ? `Autoevaluación en curso de ${empresa}` : `Prediagnóstico ergonómico de ${empresa}`}
        </h1>
        <p className="text-base leading-relaxed text-gray-700">
          Este cuestionario ayuda a identificar qué tan preparada está la empresa frente a los
          factores de riesgo ergonómico por manejo manual de cargas. Con las respuestas se
          elabora un informe de prediagnóstico con recomendaciones concretas.
        </p>
      </div>

      <ul className="flex flex-col rounded-2xl border border-gray-200 bg-white">
        <Dato icono={<IconoLista />} titulo={`${numCriterios} secciones cortas`} />
        <Dato icono={<IconoReloj />} titulo="Tiempo aproximado: 10 a 15 minutos" detalle="una pregunta a la vez" />
        <Dato icono={<IconoGuardar />} titulo="Se guarda solo" detalle="se puede pausar y retomar" />
      </ul>

      <div className="flex flex-col gap-3 rounded-2xl bg-seleccion p-4 sm:p-5">
        <p className="font-semibold text-nivel-texto-oscuro">Cómo responder</p>
        <ul className="grid grid-cols-5 gap-1.5" aria-label="Escala de respuesta">
          {NIVELES.map((n) => (
            <li key={n.valor} className="flex flex-col items-center gap-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-[9px] text-xl font-bold ${n.chip}`}
                aria-hidden="true"
              >
                {n.valor}
              </span>
              <span className="text-center text-[11px] leading-tight text-gray-700 sm:text-xs">
                <span className="sr-only">{n.valor}: </span>
                {n.etiqueta}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-gray-700">
          Cada pregunta tiene 5 opciones, de <strong>0 (Nada)</strong> a <strong>4 (Óptimo)</strong>.
          Se elige la opción que mejor refleja la situación <em>actual</em> de la empresa, no
          la ideal. No hay respuestas correctas o incorrectas: entre más fiel sea la
          respuesta, más útil será el informe.
        </p>
      </div>

      {/* En móvil, fijo abajo: si no, "Comenzar" queda después de toda la
          explicación de la escala, fuera de la pantalla. */}
      <div className="sticky bottom-0 -mx-4 -mb-4 bg-lienzo/95 px-4 pt-3 pb-5 backdrop-blur sm:static sm:m-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        {hayAvance ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button type="button" onClick={onContinuar} className={BOTON_PRIMARIO}>
              Retomar la autoevaluación ({respondidas} de {total})
            </button>
            <button type="button" onClick={onComenzar} className={BOTON_SECUNDARIO}>
              Ir al inicio
            </button>
          </div>
        ) : (
          <button type="button" onClick={onComenzar} className={`${BOTON_PRIMARIO} w-full sm:w-auto sm:px-10`}>
            Comenzar
          </button>
        )}
      </div>
    </section>
  );
}

function Dato({ icono, titulo, detalle }: { icono: React.ReactNode; titulo: string; detalle?: string }) {
  return (
    <li className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 last:border-b-0">
      <span className="shrink-0 text-blue-700">{icono}</span>
      <p className="text-[15px]">
        <span className="font-semibold">{titulo}</span>
        {detalle && <span className="text-gray-600"> · {detalle}</span>}
      </p>
    </li>
  );
}

const ICONO = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-[22px] w-[22px]",
  "aria-hidden": true,
} as const;

function IconoLista() {
  return (
    <svg {...ICONO}>
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg {...ICONO}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconoGuardar() {
  return (
    <svg {...ICONO}>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </svg>
  );
}

function PasoDatos({
  tituloRef,
  empresa,
  datos,
  errores,
  onChange,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  empresa: string;
  datos: DatosGeneralesForm;
  errores: ErroresDatos;
  onChange: (campo: keyof DatosGeneralesForm, valor: string) => void;
}) {
  const [turnoOtro, setTurnoOtro] = useState(
    datos.turnos !== "" && !OPCIONES_TURNOS.includes(datos.turnos)
  );

  // Sin autocompletado del navegador: en una computadora compartida
  // sugeriría los datos de otras empresas que ya respondieron.
  const campo = (nombre: keyof DatosGeneralesForm) => ({
    id: `campo-${nombre}`,
    autoComplete: "off",
    value: datos[nombre],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(nombre, e.target.value),
    "aria-invalid": errores[nombre] ? true : undefined,
    "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
    className: `${CAMPO} ${errores[nombre] ? "border-red-500" : "border-black/15"}`,
  });

  return (
    // En móvil, sin tarjeta: el margen de la tarjeta dentro del de la página
    // dejaba los campos angostos en 320-390 px. Desde tableta, tarjeta.
    <section className="flex flex-col gap-7 sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-blue-700">Antes de empezar</p>
        <h1 ref={tituloRef} tabIndex={-1} className={TITULO}>
          Datos generales de {empresa}
        </h1>
        <p className="text-gray-600">
          Estos datos aparecen en el informe, tal como lo pide la norma.
        </p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Domicilio del centro de trabajo
        </legend>
        <Campo etiqueta="Calle y número" error={errores.calle} nombre="calle">
          <input {...campo("calle")} placeholder="Av. Industrial 123, Int. 4" />
        </Campo>
        {/* El código postal cabe angosto: junto a la colonia también en móvil. */}
        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-3 sm:grid-cols-[1fr_9rem] sm:gap-4">
          <Campo etiqueta="Colonia" error={errores.colonia} nombre="colonia">
            <input {...campo("colonia")} />
          </Campo>
          <Campo etiqueta="Código postal" error={errores.codigo_postal} nombre="codigo_postal">
            <input
              {...campo("codigo_postal")}
              inputMode="numeric"
              maxLength={5}
              placeholder="00000"
            />
          </Campo>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Municipio o alcaldía" error={errores.municipio} nombre="municipio">
            <input {...campo("municipio")} />
          </Campo>
          <Campo etiqueta="Estado" error={errores.estado} nombre="estado">
            <select {...campo("estado")}>
              <option value="">Seleccionar estado</option>
              {ESTADOS_MX.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Operación
        </legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
          <Campo etiqueta="Actividad principal (giro)" error={errores.giro} nombre="giro">
            <input {...campo("giro")} placeholder="Ej. Fabricación de envases de plástico" />
          </Campo>
          <Campo etiqueta="Número de trabajadores" error={errores.num_trabajadores} nombre="num_trabajadores">
            <input {...campo("num_trabajadores")} inputMode="numeric" placeholder="Ej. 120" />
          </Campo>
        </div>

        <div className="flex flex-col gap-2">
          <span id="etiqueta-turnos" className="text-sm font-medium">
            Turnos de trabajo
          </span>
          <div role="radiogroup" aria-labelledby="etiqueta-turnos" className="flex flex-wrap gap-2">
            {OPCIONES_TURNOS.map((opcion) => {
              const activo = !turnoOtro && datos.turnos === opcion;
              return (
                <button
                  key={opcion}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => {
                    setTurnoOtro(false);
                    onChange("turnos", opcion);
                  }}
                  className={`${CHIP} ${activo ? CHIP_ACTIVO : CHIP_INACTIVO}`}
                >
                  {opcion}
                </button>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={turnoOtro}
              onClick={() => {
                setTurnoOtro(true);
                onChange("turnos", "");
              }}
              className={`${CHIP} ${turnoOtro ? CHIP_ACTIVO : CHIP_INACTIVO}`}
            >
              Otro
            </button>
          </div>
          {turnoOtro && (
            <input
              {...campo("turnos")}
              autoFocus
              aria-label="Descripción de los turnos"
              placeholder="Descripción de los turnos"
            />
          )}
          {errores.turnos && <MensajeError id="error-turnos">{errores.turnos}</MensajeError>}
        </div>

        <Campo
          etiqueta="¿Qué cargas se manejan manualmente?"
          ayuda="Qué se levanta, transporta, empuja o jala, y en qué áreas."
          error={errores.descripcion_mmh}
          nombre="descripcion_mmh"
        >
          <textarea
            {...campo("descripcion_mmh")}
            rows={3}
            placeholder="Ej. Costales de 25 kg en el almacén; tarimas con patín en el área de embarque"
          />
        </Campo>
      </fieldset>
    </section>
  );
}

function Campo({
  etiqueta,
  ayuda,
  error,
  nombre,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  error?: string;
  nombre: keyof DatosGeneralesForm;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`campo-${nombre}`} className="text-sm font-medium">
        {etiqueta}
      </label>
      {ayuda && <p className="-mt-1 text-sm text-gray-500">{ayuda}</p>}
      {children}
      {error && <MensajeError id={`error-${nombre}`}>{error}</MensajeError>}
    </div>
  );
}

function MensajeError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-sm text-red-700">
      {children}
    </p>
  );
}

function PasoSeccion({
  tituloRef,
  criterio,
  indice,
  numCriterios,
  anteriorCompleta,
  respondidasSeccion,
  celebrar,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  criterio: CriterioConItems;
  indice: number;
  numCriterios: number;
  anteriorCompleta: boolean;
  respondidasSeccion: number;
  celebrar: boolean;
}) {
  const restantes = numCriterios - indice - 1;
  const minutos = Math.max(1, Math.round((criterio.items.length * SEGUNDOS_POR_PREGUNTA) / 60));
  return (
    <section className="flex flex-col gap-4 sm:pt-6">
      {anteriorCompleta && (
        <div
          className={`flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 ${
            celebrar ? "aparecer-rebote" : ""
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-exito-fondo text-green-700">
            <IconoCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-green-900">Sección {indice} completa</p>
            <p className="text-sm text-gray-700">
              {MENSAJES_SECCION_COMPLETA[indice - 1] ?? "¡Muy bien!"}
            </p>
          </div>
        </div>
      )}
      <div className={`${TARJETA} flex flex-col items-start gap-5`}>
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold text-blue-700 sm:text-xl">
            Sección {indice + 1} de {numCriterios}
          </p>
          <h1
            ref={tituloRef}
            tabIndex={-1}
            className="text-3xl leading-tight font-bold outline-none sm:text-4xl"
          >
            {criterio.nombre}
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-lg text-gray-700">
          <p className="flex items-center gap-2.5">
            <span className="text-gray-600">
              <IconoLista />
            </span>
            <span>
              {criterio.items.length} preguntas · Tiempo aproximado: {minutos} {minutos === 1 ? "minuto" : "minutos"}
              {respondidasSeccion > 0 && respondidasSeccion < criterio.items.length
                ? ` · ${respondidasSeccion} respondidas`
                : ""}
              {respondidasSeccion === criterio.items.length ? " · todas respondidas" : ""}
            </span>
          </p>
          <p>
            {restantes === 0
              ? "Es la última sección."
              : `Después de esta, ${restantes === 1 ? "falta 1 sección" : `faltan ${restantes} secciones`}.`}
          </p>
        </div>
      </div>
    </section>
  );
}

function PasoPregunta({
  tituloRef,
  criterio,
  item,
  indice,
  esUltimaSeccion,
  seleccionado,
  onResponder,
  onAbrirAyuda,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  criterio: CriterioConItems;
  item: Item;
  indice: number;
  esUltimaSeccion: boolean;
  seleccionado: number | undefined;
  onResponder: (item: Item, nivel: number) => void;
  onAbrirAyuda: (() => void) | null;
}) {
  const idTitulo = `pregunta-${item.id}`;
  const seccionRef = useRef<HTMLElement>(null);

  // Sin scroll: la pregunta y sus 5 opciones deben caber en la ventana. Si
  // con el tamaño normal no caben (textos largos, pantallas bajas), se reduce
  // la escala de toda la pregunta en pasos pequeños hasta que quepa. `zoom`
  // (no `transform`) para que el alto ocupado también se reduzca.
  useLayoutEffect(() => {
    const seccion = seccionRef.current;
    if (!seccion) return;
    const ajustar = () => {
      const raiz = document.documentElement;
      for (const escala of ESCALAS_PREGUNTA) {
        seccion.style.zoom = String(escala);
        if (raiz.scrollHeight <= window.innerHeight) return;
      }
    };
    ajustar();
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [item.id]);
  const animo =
    indice === criterio.items.length - 1
      ? esUltimaSeccion
        ? "¡Última pregunta!"
        : "¡Última de esta sección!"
      : indice === Math.floor(criterio.items.length / 2)
        ? "¡Mitad de la sección!"
        : null;
  // Flechas dentro de la escala: mueven el foco entre opciones sin elegir
  // (elegir avanza solo, así que no debe pasar por accidente).
  function moverFoco(e: React.KeyboardEvent<HTMLDivElement>) {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    const opciones = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const i = opciones.indexOf(document.activeElement as HTMLButtonElement);
    const siguiente = opciones[i === -1 ? 0 : (i + delta + opciones.length) % opciones.length];
    e.preventDefault();
    siguiente?.focus();
  }

  return (
    <section ref={seccionRef} className="flex flex-col gap-3 bajo:gap-2 sm:gap-4">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-[13px] text-gray-600">
            <span className="font-semibold text-blue-700">Sección {criterio.numero}</span>
            {" · "}Pregunta {indice + 1} de {criterio.items.length}
          </p>
          {animo && (
            <p className="aparecer-rebote rounded-full bg-green-50 px-3 py-0.5 text-sm font-medium text-green-800">
              {animo}
            </p>
          )}
        </div>
        <h1 ref={tituloRef} id={idTitulo} tabIndex={-1} className="text-[18px] leading-snug font-bold outline-none sm:text-2xl">
          {item.texto_pregunta}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="hidden text-[13px] font-semibold text-gray-600 sm:block">
            ¿Qué nivel describe hoy a la empresa?
          </p>
          {onAbrirAyuda && (
            // Solo bajo 1024 px: desde ahí el botón está en la columna derecha.
            <button
              type="button"
              onClick={onAbrirAyuda}
              aria-haspopup="dialog"
              className="flex min-h-9 bajo:min-h-8 items-center gap-1.5 rounded-full bg-seleccion px-3.5 text-sm font-medium text-blue-700 transition-colors hover:bg-pista focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none lg:hidden"
            >
              <IconoInfo className="h-4 w-4" />
              ¿Qué significa? · Cómo responder
            </button>
          )}
        </div>
      </div>

      <div role="radiogroup" aria-labelledby={idTitulo} onKeyDown={moverFoco} className="flex flex-col gap-1.5 bajo:gap-1 sm:gap-2">
        {item.niveles.map(({ nivel, descripcion }) => {
          const estilo = NIVELES[nivel];
          const activo = seleccionado === nivel;
          return (
            <button
              key={nivel}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onResponder(item, nivel)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-3 py-2 bajo:min-h-0 bajo:py-1.5 text-left transition sm:gap-4 sm:px-4 sm:py-2.5 ${
                activo ? "border-blue-700 bg-seleccion" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              } focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none`}
            >
              <span
                className={`flex h-[34px] w-[34px] bajo:h-[30px] bajo:w-[30px] shrink-0 items-center justify-center rounded-[9px] text-xl font-bold ${estilo.chip}`}
                aria-hidden="true"
              >
                {nivel}
              </span>
              {/* Etiqueta y descripción en el mismo párrafo (como en el mockup de
                  escritorio): ahorra una línea por opción. */}
              <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-gray-700 sm:text-[14.5px]">
                <span className="font-semibold text-gray-900">
                  {estilo.etiqueta}
                  {descripcion ? "." : ""}
                </span>
                {descripcion && (
                  <>
                    {" "}
                    <ConNegritas texto={descripcion} />
                  </>
                )}
              </span>
              <span
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition ${
                  activo ? "border-blue-700 bg-blue-700 text-white" : "border-gray-400 bg-white text-transparent"
                }`}
                aria-hidden="true"
              >
                <IconoCheck className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Escalas que se prueban, en orden, hasta que la pregunta quepa sin scroll.
// 0.77 es el mínimo (descripción de ~10.4 px en móvil) y solo lo necesitan
// las preguntas más largas en celulares de 360×640. Si ni así cabe, queda el
// scroll del cuerpo con el pie fijo como último recurso.
const ESCALAS_PREGUNTA = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.77];

// "Hay algunos, pero **no se usan**" → "no se usan" en negritas. Sin HTML en
// la base ni dangerouslySetInnerHTML: el texto se parte y se arma con <strong>.
function ConNegritas({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {partes.map((parte, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-gray-900">
            {parte}
          </strong>
        ) : (
          parte
        )
      )}
    </>
  );
}

function PasoRevision({
  tituloRef,
  criterios,
  datos,
  datosCompletos,
  respuestas,
  respondidas,
  total,
  enviando,
  error,
  onEditarDatos,
  onEditarPregunta,
  onEnviar,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  criterios: CriterioConItems[];
  datos: DatosGeneralesForm;
  datosCompletos: boolean;
  respuestas: Record<string, number>;
  respondidas: number;
  total: number;
  enviando: boolean;
  error: string | null;
  onEditarDatos: () => void;
  onEditarPregunta: (c: number, i: number) => void;
  onEnviar: () => void;
}) {
  const faltantes = total - respondidas;
  const primeraFaltante = (() => {
    for (let c = 0; c < criterios.length; c++) {
      const i = criterios[c].items.findIndex((item) => respuestas[item.id] === undefined);
      if (i !== -1) return { c, i };
    }
    return null;
  })();
  const listo = faltantes === 0 && datosCompletos;

  return (
    <section className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-2">
        <h1 ref={tituloRef} tabIndex={-1} className={TITULO}>
          {listo ? "¡Autoevaluación completa! Lista para enviar" : "Revisión antes de enviar"}
        </h1>
        <p className="text-gray-600">
          Cualquier respuesta se puede cambiar desde esta lista. Una vez enviada, la autoevaluación
          ya no se puede modificar.
        </p>
      </div>

      <div className={`${TARJETA} flex flex-col gap-2 !p-5`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Datos generales</h2>
          <button type="button" onClick={onEditarDatos} className="text-sm font-medium text-blue-700 hover:underline">
            Editar
          </button>
        </div>
        {datosCompletos ? (
          <p className="text-sm text-gray-600">
            {datos.calle}, Col. {datos.colonia}, C.P. {datos.codigo_postal}, {datos.municipio},{" "}
            {datos.estado} · {datos.giro} · {datos.num_trabajadores} trabajadores · {datos.turnos}
          </p>
        ) : (
          <p className="text-sm text-red-700">Faltan algunos datos.</p>
        )}
      </div>

      {criterios.map((criterio, c) => {
        const hechas = criterio.items.filter((item) => respuestas[item.id] !== undefined).length;
        return (
          <div key={criterio.numero} className={`${TARJETA} flex flex-col gap-3 !p-5`}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold">
                <span className="text-gray-500">{criterio.numero}.</span> {criterio.nombre}
              </h2>
              <span
                className={`shrink-0 text-sm tabular-nums ${
                  hechas === criterio.items.length ? "text-green-700" : "text-gray-500"
                }`}
              >
                {hechas}/{criterio.items.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {criterio.items.map((item, i) => {
                const nivel = respuestas[item.id];
                const estilo = nivel === undefined ? null : NIVELES[nivel];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onEditarPregunta(c, i)}
                    title={item.texto_pregunta}
                    aria-label={`Pregunta ${criterio.numero}.${item.numero}: ${
                      estilo ? `${nivel} ${estilo.etiqueta}` : "sin responder"
                    }. Cambiar respuesta.`}
                    className={`flex h-11 flex-col items-center justify-center rounded-lg border-2 text-xs leading-tight font-semibold transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none ${
                      estilo ? estilo.punto : "border-dashed border-black/25 bg-white text-gray-500"
                    }`}
                  >
                    <span className="opacity-80">
                      {criterio.numero}.{item.numero}
                    </span>
                    <span>{nivel ?? "–"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Del color del fondo: vive dentro de la columna de 720 px, y en blanco
          se vería como un recuadro flotante en escritorio. */}
      <div className="sticky bottom-0 -mx-4 -mb-4 bg-lienzo/95 px-4 pt-3 pb-5 backdrop-blur sm:-mx-6 sm:-mb-6 sm:px-6">
        {listo ? (
          <button type="button" onClick={onEnviar} disabled={enviando} className={`${BOTON_PRIMARIO} w-full`}>
            {enviando ? "Enviando…" : "Enviar autoevaluación"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !datosCompletos
                ? onEditarDatos()
                : primeraFaltante && onEditarPregunta(primeraFaltante.c, primeraFaltante.i)
            }
            className={`${BOTON_PRIMARIO} w-full`}
          >
            {!datosCompletos
              ? "Completar datos generales"
              : `Responder ${faltantes === 1 ? "la pregunta pendiente" : `las ${faltantes} preguntas pendientes`}`}
          </button>
        )}
      </div>
    </section>
  );
}

function Navegacion({
  puedeAvanzar,
  etiquetaSiguiente,
  onAnterior,
  onSiguiente,
  mostrarAtajos,
}: {
  puedeAvanzar: boolean;
  etiquetaSiguiente: string;
  onAnterior: () => void;
  onSiguiente: () => void;
  mostrarAtajos: boolean;
}) {
  return (
    // Pegado abajo en todos los tamaños: nunca tapa contenido porque ocupa su
    // propio lugar al final de la columna (sticky, no fixed).
    <div className="sticky bottom-0 border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-2 px-4 pt-2.5 bajo:pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bajo:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onAnterior} className={BOTON_SECUNDARIO}>
            <span aria-hidden="true">←</span> Anterior
          </button>
          {mostrarAtajos && (
            <p className="hidden flex-1 text-center text-xs whitespace-nowrap text-gray-600 md:block">
              <kbd className={KBD}>0</kbd>–<kbd className={KBD}>4</kbd> elegir ·{" "}
              <kbd className={KBD}>Enter</kbd> seguir
            </p>
          )}
          <div className="ml-auto flex flex-1 items-center justify-end gap-3 md:flex-none">
            {!puedeAvanzar && (
              <span className="hidden text-[13px] text-gray-600 md:inline">Elegir una opción</span>
            )}
            <button
              type="button"
              onClick={onSiguiente}
              disabled={!puedeAvanzar}
              className={`${BOTON_PRIMARIO} flex-1 md:flex-none`}
            >
              {/* En móvil el botón deshabilitado dice por qué, sin ocupar una
                  línea aparte (cada línea cuenta para que todo quepa). */}
              {puedeAvanzar ? (
                <>
                  {etiquetaSiguiente} <span aria-hidden="true">→</span>
                </>
              ) : (
                <>
                  <span className="md:hidden">Elegir una opción</span>
                  <span className="hidden md:inline">
                    {etiquetaSiguiente} <span aria-hidden="true">→</span>
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconoCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const BOTON_PRIMARIO =
  "min-h-12 bajo:min-h-11 rounded-xl bg-blue-700 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 md:min-h-11";
const BOTON_SECUNDARIO =
  "min-h-12 bajo:min-h-11 rounded-xl border border-gray-300 bg-white px-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:outline-none md:min-h-11";
const CHIP = "min-h-11 rounded-full border px-4 text-sm font-medium transition";
const CHIP_ACTIVO = "border-blue-700 bg-blue-700 text-white";
const CHIP_INACTIVO = "border-gray-300 bg-white text-gray-800 hover:bg-gray-50";
const KBD = "rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[11px]";
