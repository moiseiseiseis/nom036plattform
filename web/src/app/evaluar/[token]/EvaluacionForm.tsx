"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { CriterioConItems, Empresa, Item } from "@/lib/nom036/types";
import { enviarEvaluacion, type DatosGeneralesForm } from "./actions";
import { claveBorrador } from "./borrador";

// Mismo semáforo 0-4 que el instrumento original y el informe (rojo → azul).
const NIVELES = [
  {
    valor: 0,
    etiqueta: "Nada",
    chip: "bg-red-600 text-white",
    seleccion: "border-red-600 bg-red-50",
    punto: "bg-red-600 text-white border-red-600",
  },
  {
    valor: 1,
    etiqueta: "Mínimo",
    chip: "bg-orange-500 text-white",
    seleccion: "border-orange-500 bg-orange-50",
    punto: "bg-orange-500 text-white border-orange-500",
  },
  {
    valor: 2,
    etiqueta: "Regular",
    chip: "bg-yellow-400 text-yellow-950",
    seleccion: "border-yellow-500 bg-yellow-50",
    punto: "bg-yellow-400 text-yellow-950 border-yellow-400",
  },
  {
    valor: 3,
    etiqueta: "Aceptable",
    chip: "bg-green-600 text-white",
    seleccion: "border-green-600 bg-green-50",
    punto: "bg-green-600 text-white border-green-600",
  },
  {
    valor: 4,
    etiqueta: "Óptimo",
    chip: "bg-sky-600 text-white",
    seleccion: "border-sky-600 bg-sky-50",
    punto: "bg-sky-600 text-white border-sky-600",
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
const RETARDO_AVANCE_MS = 320;

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
  if (!/^\d{5}$/.test(d.codigo_postal.trim())) errores.codigo_postal = "Escribe los 5 dígitos.";
  if (!d.municipio.trim()) errores.municipio = requerido;
  if (!d.estado) errores.estado = "Elige un estado.";
  if (!d.giro.trim()) errores.giro = requerido;
  const n = Number(d.num_trabajadores);
  if (!Number.isInteger(n) || n <= 0) errores.num_trabajadores = "Escribe un número entero mayor que 0.";
  if (!d.turnos.trim()) errores.turnos = "Elige una opción.";
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

  const irA = useCallback((indice: number) => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setActual(Math.max(0, Math.min(indice, pasos.length - 1)));
  }, [pasos.length]);

  const siguiente = useCallback(() => {
    if (paso.tipo === "datos") {
      const errores = validarDatos(datos);
      setErroresDatos(errores);
      if (Object.keys(errores).length > 0) return;
    }
    if (desdeRevision) {
      setDesdeRevision(false);
      irA(indiceRevision);
      return;
    }
    irA(actual + 1);
  }, [paso, datos, desdeRevision, actual, indiceRevision, irA]);

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
      setRespuestas((prev) => ({ ...prev, [item.id]: nivel }));
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(siguiente, RETARDO_AVANCE_MS);
    },
    [siguiente]
  );

  const editarDesdeRevision = (indice: number) => {
    setDesdeRevision(true);
    irA(indice);
  };

  const indicePregunta = (c: number, i: number) =>
    pasos.findIndex((p) => p.tipo === "pregunta" && p.c === c && p.i === i);

  // Atajos de teclado: 0-4 eligen la opción, Enter avanza.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const destino = e.target as HTMLElement | null;
      if (destino && ["INPUT", "TEXTAREA", "SELECT"].includes(destino.tagName)) return;
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

  return (
    // Alto mínimo de la ventana: la navegación se queda pegada abajo aunque la
    // pantalla actual (p. ej. el inicio de una sección) tenga poco contenido.
    <div className="flex min-h-dvh flex-col gap-4">
      {paso.tipo !== "bienvenida" && (
        <BarraProgreso
          empresa={empresa.nombre}
          criterios={criterios}
          respuestas={respuestas}
          respondidas={respondidas}
          total={total}
          seccionActual={paso.tipo === "seccion" || paso.tipo === "pregunta" ? paso.c : null}
        />
      )}

      <div key={actual} className="animar-paso">
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
            restantesTotal={total - respondidas}
          />
        )}

        {paso.tipo === "pregunta" && (
          <PasoPregunta
            tituloRef={tituloRef}
            criterio={criterios[paso.c]}
            item={criterios[paso.c].items[paso.i]}
            indice={paso.i}
            seleccionado={respuestas[criterios[paso.c].items[paso.i].id]}
            onResponder={responder}
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
          onSiguiente={siguiente}
          mostrarAtajos={paso.tipo === "pregunta"}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Piezas de la interfaz

const TARJETA = "rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8";
const TITULO = "text-2xl font-semibold leading-tight outline-none sm:text-3xl";
const CAMPO =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-base outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30";

function BarraProgreso({
  empresa,
  criterios,
  respuestas,
  respondidas,
  total,
  seccionActual,
}: {
  empresa: string;
  criterios: CriterioConItems[];
  respuestas: Record<string, number>;
  respondidas: number;
  total: number;
  seccionActual: number | null;
}) {
  const minutos = Math.ceil(((total - respondidas) * SEGUNDOS_POR_PREGUNTA) / 60);
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-black/5 bg-[var(--background)]/95 px-4 pt-3 pb-3 backdrop-blur">
      <div className="flex items-baseline justify-between gap-3 text-xs text-gray-600">
        <span className="truncate font-medium">{empresa}</span>
        <span className="shrink-0 tabular-nums">
          {respondidas} de {total}
          {respondidas < total && <span className="hidden sm:inline"> · ≈ {minutos} min restantes</span>}
        </span>
      </div>
      <div
        className="mt-2 flex gap-1"
        role="progressbar"
        aria-label="Avance de la autoevaluación"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={respondidas}
      >
        {criterios.map((criterio, c) => {
          const hechas = criterio.items.filter((item) => respuestas[item.id] !== undefined).length;
          const pct = criterio.items.length ? (hechas / criterio.items.length) * 100 : 0;
          return (
            <div
              key={criterio.numero}
              className={`h-1.5 flex-1 overflow-hidden rounded-full bg-black/10 ${
                seccionActual === c ? "ring-2 ring-blue-600/30 ring-offset-1" : ""
              }`}
              title={`Sección ${criterio.numero}: ${hechas} de ${criterio.items.length}`}
            >
              <div
                className="h-full rounded-full bg-blue-700 transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
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
    <section className={`${TARJETA} mt-6 flex flex-col gap-6 sm:mt-12`}>
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
          Autoevaluación · NOM-036-1-STPS-2018
        </p>
        <h1 ref={tituloRef} tabIndex={-1} className={TITULO}>
          {hayAvance ? `Qué bueno verte de nuevo, ${empresa}` : `Prediagnóstico ergonómico de ${empresa}`}
        </h1>
        <p className="text-gray-600">
          Este cuestionario ayuda a identificar qué tan preparada está tu empresa frente a los
          factores de riesgo ergonómico por manejo manual de cargas. Con tus respuestas se
          elabora un informe de prediagnóstico con recomendaciones concretas.
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        <Dato titulo={`${total} preguntas`} detalle={`en ${numCriterios} secciones cortas`} />
        <Dato titulo="10 a 15 minutos" detalle="una pregunta a la vez" />
        <Dato titulo="Se guarda solo" detalle="puedes pausar y volver" />
      </ul>

      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-950">
        <p className="font-medium">Cómo responder</p>
        <p className="mt-1">
          Cada pregunta tiene 5 opciones, de <strong>0 (Nada)</strong> a <strong>4 (Óptimo)</strong>.
          Lee las descripciones y elige la que mejor refleje la situación <em>actual</em> de tu
          empresa, no la ideal. No hay respuestas correctas o incorrectas: entre más fiel sea la
          respuesta, más útil será el informe.
        </p>
      </div>

      {hayAvance ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onContinuar} className={BOTON_PRIMARIO}>
            Continuar donde me quedé ({respondidas} de {total})
          </button>
          <button type="button" onClick={onComenzar} className={BOTON_SECUNDARIO}>
            Ir al inicio
          </button>
        </div>
      ) : (
        <button type="button" onClick={onComenzar} className={BOTON_PRIMARIO}>
          Comenzar
        </button>
      )}
    </section>
  );
}

function Dato({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <li className="rounded-xl border border-black/10 p-3 sm:p-4">
      <p className="text-sm font-semibold sm:text-base">{titulo}</p>
      <p className="text-xs text-gray-600 sm:text-sm">{detalle}</p>
    </li>
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

  const campo = (nombre: keyof DatosGeneralesForm) => ({
    id: `campo-${nombre}`,
    value: datos[nombre],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(nombre, e.target.value),
    "aria-invalid": errores[nombre] ? true : undefined,
    "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
    className: `${CAMPO} ${errores[nombre] ? "border-red-500" : "border-black/15"}`,
  });

  return (
    <section className={`${TARJETA} flex flex-col gap-6`}>
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
          <input {...campo("calle")} autoComplete="address-line1" placeholder="Av. Industrial 123, Int. 4" />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
          <Campo etiqueta="Colonia" error={errores.colonia} nombre="colonia">
            <input {...campo("colonia")} autoComplete="address-level3" />
          </Campo>
          <Campo etiqueta="Código postal" error={errores.codigo_postal} nombre="codigo_postal">
            <input
              {...campo("codigo_postal")}
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
              placeholder="00000"
            />
          </Campo>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Municipio o alcaldía" error={errores.municipio} nombre="municipio">
            <input {...campo("municipio")} autoComplete="address-level2" />
          </Campo>
          <Campo etiqueta="Estado" error={errores.estado} nombre="estado">
            <select {...campo("estado")}>
              <option value="">Elige un estado</option>
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
              aria-label="Describe los turnos"
              placeholder="Describe los turnos"
            />
          )}
          {errores.turnos && <MensajeError id="error-turnos">{errores.turnos}</MensajeError>}
        </div>

        <Campo
          etiqueta="¿Qué cargas se manejan manualmente?"
          ayuda="Describe brevemente qué se levanta, transporta, empuja o jala, y en qué áreas."
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
  restantesTotal,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  criterio: CriterioConItems;
  indice: number;
  numCriterios: number;
  anteriorCompleta: boolean;
  respondidasSeccion: number;
  restantesTotal: number;
}) {
  const ultima = indice === numCriterios - 1;
  return (
    <section className={`${TARJETA} mt-4 flex flex-col items-start gap-5 sm:mt-10`}>
      {anteriorCompleta && (
        <p className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
          <IconoCheck className="h-4 w-4" />
          Sección {indice} completa
        </p>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-blue-700">
          Sección {indice + 1} de {numCriterios}
          {ultima && " · la última"}
        </p>
        <h1 ref={tituloRef} tabIndex={-1} className={TITULO}>
          {criterio.nombre}
        </h1>
      </div>
      <p className="text-gray-600">
        {criterio.items.length} preguntas
        {respondidasSeccion > 0 && respondidasSeccion < criterio.items.length
          ? ` · ya respondiste ${respondidasSeccion}`
          : ""}
        {respondidasSeccion === criterio.items.length ? " · ya las respondiste todas" : ""}
        {indice > 0 && restantesTotal > 0 && ` · te faltan ${restantesTotal} en total`}
      </p>
    </section>
  );
}

function PasoPregunta({
  tituloRef,
  criterio,
  item,
  indice,
  seleccionado,
  onResponder,
}: {
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
  criterio: CriterioConItems;
  item: Item;
  indice: number;
  seleccionado: number | undefined;
  onResponder: (item: Item, nivel: number) => void;
}) {
  const idTitulo = `pregunta-${item.id}`;
  return (
    <section className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-blue-700">Sección {criterio.numero}</span>
          {" · "}Pregunta {indice + 1} de {criterio.items.length}
        </p>
        <h1 ref={tituloRef} id={idTitulo} tabIndex={-1} className="text-xl leading-snug font-semibold outline-none sm:text-2xl">
          {item.texto_pregunta}
        </h1>
      </div>

      <div role="radiogroup" aria-labelledby={idTitulo} className="flex flex-col gap-2.5">
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
              className={`group flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left transition sm:gap-4 sm:p-4 ${
                activo
                  ? `${estilo.seleccion} shadow-sm`
                  : "border-black/10 bg-white hover:border-black/25 hover:bg-gray-50"
              } focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold ${estilo.chip}`}
                aria-hidden="true"
              >
                {nivel}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-semibold">{estilo.etiqueta}</span>
                {descripcion && <span className="text-sm leading-snug text-gray-700">{descripcion}</span>}
              </span>
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  activo ? "border-transparent bg-gray-900 text-white" : "border-black/20 text-transparent"
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
          {listo ? "Todo listo para enviar" : "Revisa antes de enviar"}
        </h1>
        <p className="text-gray-600">
          Toca cualquier pregunta para cambiar tu respuesta. Una vez enviada, la autoevaluación ya
          no se puede modificar.
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

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-[var(--background)]/95 px-4 py-3 backdrop-blur">
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
    <div className="sticky bottom-0 -mx-4 mt-auto border-t border-black/5 bg-[var(--background)]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onAnterior} className={BOTON_SECUNDARIO}>
          <span aria-hidden="true">←</span> Anterior
        </button>
        {mostrarAtajos && (
          <p className="hidden flex-1 text-center text-xs text-gray-500 md:block">
            Atajos: teclas <kbd className={KBD}>0</kbd>–<kbd className={KBD}>4</kbd> para elegir,{" "}
            <kbd className={KBD}>Enter</kbd> para seguir
          </p>
        )}
        <button
          type="button"
          onClick={onSiguiente}
          disabled={!puedeAvanzar}
          className={`${BOTON_PRIMARIO} ml-auto`}
        >
          {etiquetaSiguiente} <span aria-hidden="true">→</span>
        </button>
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
  "rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";
const BOTON_SECUNDARIO =
  "rounded-lg border border-black/15 bg-white px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none";
const CHIP = "rounded-full border px-4 py-2 text-sm font-medium transition";
const CHIP_ACTIVO = "border-blue-700 bg-blue-700 text-white";
const CHIP_INACTIVO = "border-black/15 bg-white text-gray-800 hover:bg-gray-50";
const KBD = "rounded border border-black/15 bg-white px-1.5 py-0.5 font-mono text-[11px]";
