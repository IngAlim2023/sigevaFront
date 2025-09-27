import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import { api } from "../../api";
import { useAuth } from "../../context/auth/auth.context";
import type { Gestor } from "../../context/auth/types/authTypes";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";

import axios from "axios";
type FilaExcel = {
  ["Tipo de Documento"]?: string;
  ["Número de Documento"]?: string | number;
  ["Nombre"]?: string;
  ["Apellidos"]?: string;
  ["Celular"]?: string | number;
  ["Correo Electrónico"]?: string;
  ["Estado"]?: string;
  motivo?: string; // <-- el backend ahora puede devolver motivo
  [k: string]: unknown;
};

type CentroFormacion = {
  id: string | number;
  nombre: string;
  regionalId?: string | number;
};
type Regional = {
  id: string | number;
  nombre: string;
};

type CentroRaw = {
  idcentro_formacion?: number | string | null;
  idcentroFormacion?: number | string | null;
  id?: number | string | null;
  centro_formacioncol?: string | null;
  centroFormacioncol?: string | null;
  nombre?: string | null;
  centro_formacion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  subdirector?: string | null;
  correosubdirector?: string | null;
  idregional?: number | string | null;
  idRegional?: number | string | null;
  id_regional?: number | string | null;
  idmunicipios?: number | string | null;
  [k: string]: unknown;
};
type RegionalRaw = {
  idregional?: number | string | null;
  id?: number | string | null;
  regional?: string | null;
  nombre?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  numero_centros?: number | null;
  departamentos_iddepartamentos?: number | string | null;
  departamentos_iddepartamento?: number | string | null;
  [k: string]: unknown;
};

const UPLOAD_URL = "/api/aprendices/importarExcel";
const CENTROS_URL = "/api/centrosFormacion/obtiene";
const REGIONAL_URL = "/api/regionales";

export default function CargarAprendices() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin =
    isAuthenticated &&
    user?.perfil?.toString().trim().toLowerCase() === "administrador";

  const userId = isAdmin ? (user as Gestor).id : null;

  // estados
  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [centroId, setCentroId] = useState<string>("");
  const [cargandoCentros, setCargandoCentros] = useState(false);

  const [regionales, setRegionales] = useState<Regional[]>([]);
  const [regionalId, setRegionalId] = useState<string>("");
  const [cargandoRegional, setCargandoRegional] = useState(false);

  const [uploaded, setUploaded] = useState(false); // para saber si ya terminó
  const [controller, setController] = useState<AbortController | null>(null); // para cancelar
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [jornada, setJornada] = useState("Mañana");
  const [preview, setPreview] = useState<FilaExcel[]>([]);
  const [programaDetectado, setProgramaDetectado] = useState("");
  const [fichaDetectada, setFichaDetectada] = useState("");
  const [msg, setMsg] = useState<{
    type: "success" | "danger" | "warning";
    text: string;
  } | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [skippedAprendices, setSkippedAprendices] = useState<FilaExcel[]>([]);
  const [showSkippedModal, setShowSkippedModal] = useState(false);

  // Nuevos estados para processed + opción de actualizar si existe
  const [updateIfExists, setUpdateIfExists] = useState(true);
  const [processed, setProcessed] = useState<any[]>([]);
  const [showProcessedModal, setShowProcessedModal] = useState(false);

  useEffect(() => {
    const fetchInicial = async () => {
      setCargandoCentros(true);
      setCargandoRegional(true);
      try {
        const [resCentros, resRegionales] = await Promise.all([
          api.get(CENTROS_URL, { params: { activos: true } }),
          api.get(REGIONAL_URL, { params: { activos: true } }),
        ]);

       

        const centrosRaw = resCentros.data?.data ?? resCentros.data ?? [];

        const centrosMapped: CentroFormacion[] = centrosRaw.map(
          (c: CentroRaw) => ({
            id: c.idcentro_formacion ?? c.idcentroFormacion ?? c.id ?? "",
            nombre:
              c.centro_formacioncol ??
              c.centroFormacioncol ??
              c.nombre ??
              c.centro_formacion ??
              "",
            regionalId:
              c.idregional ?? c.idRegional ?? c.idRegional ?? undefined,
          })
        );

        const regionalesRaw =
          resRegionales.data?.data ?? resRegionales.data ?? [];
        const regionalesMapped: Regional[] = regionalesRaw.map(
          (r: RegionalRaw) => ({
            id: r.idregional ?? r.id ?? "",
            nombre: r.regional ?? r.nombre ?? "",
          })
        );

        setCentros(centrosMapped);
        setRegionales(regionalesMapped);
      } catch (e: unknown) {
        console.error("Error al cargar centros/regionales:", e);
        if (axios.isAxiosError(e)) {
          setMsg({
            type: "danger",
            text:
              e.response?.data?.message ||
              "No se pudieron cargar los centros o las regionales.",
          });
        } else {
          setMsg({
            type: "danger",
            text: "No se pudieron cargar los centros o las regionales.",
          });
        }
      } finally {
        setCargandoCentros(false);
        setCargandoRegional(false);
      }
    };

    fetchInicial();
  }, []);

  // Cuando cambia regionalId limpiamos centroId para evitar inconsistencias
  useEffect(() => {
    setCentroId("");
  }, [regionalId]);

  // Filtramos centros por regional seleccionada
  const centrosFiltrados = regionalId
    ? centros.filter((c) => String(c.regionalId ?? "") === String(regionalId))
    : [];

  // Lectura del Excel para preview
  const leerExcelParaPreview = async (archivo: File) => {
    setMsg(null);
    setPreview([]);
    setProgramaDetectado("");
    setFichaDetectada("");

    const buffer = await archivo.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];

    const c2 = sheet?.["C2"]?.v?.toString().trim() || "";
    const fichaLimpia = c2.replace(/–/g, "-");
    const partes = fichaLimpia.split(" - ");
    const numeroGrupo = partes[0]?.trim() || "";
    const nombrePrograma = partes[1]?.trim() || "";
    setFichaDetectada(numeroGrupo);
    setProgramaDetectado(nombrePrograma);

    const data = XLSX.utils.sheet_to_json<FilaExcel>(sheet, {
      range: 4,
      defval: "",
    });
    setPreview(data.slice(0, 20));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUploaded(false); // resetea estado de subida cuando cambia archivo
    setController(null);
    setUploadPct(0);
    if (!f) {
      setPreview([]);
      return;
    }
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext || "")) {
      setMsg({ type: "danger", text: "El archivo debe ser .xlsx o .xls" });
      setPreview([]);
      return;
    }
    try {
      await leerExcelParaPreview(f);
    } catch {
      setMsg({
        type: "danger",
        text: "No se pudo leer el Excel para la vista previa.",
      });
    }
  };

  const onSubmit = async () => {
    if (!isAdmin) {
      setMsg({
        type: "warning",
        text: "Solo los usuarios con perfil Administrador pueden importar aprendices.",
      });
      return;
    }
    if (!userId) {
      setMsg({ type: "danger", text: "No se encontró el userId en sesión." });
      return;
    }
    if (!file) {
      setMsg({ type: "danger", text: "Selecciona un archivo Excel primero." });
      return;
    }
    if (!centroId) {
      setMsg({
        type: "danger",
        text: "Selecciona un Centro de formación primero.",
      });
      return;
    }
    if (!regionalId) {
      setMsg({
        type: "danger",
        text: "Selecciona una Regional primero.",
      });
      return;
    }

    // Construimos FormData
    const fd = new FormData();
    fd.append("excel", file, file.name);
    fd.append("userId", String(userId));
    fd.append("jornada", jornada);
    fd.append("centroFormacionId", String(centroId));
    fd.append("idregional", String(regionalId));
    // nuevo: enviar flag updateIfExists
    fd.append("updateIfExists", updateIfExists ? "1" : "0");

    setSubiendo(true);
    setMsg(null);
    setUploadPct(0);
    setSkippedAprendices([]); // limpiar previos
    setProcessed([]);
    setShowProcessedModal(false);

    try {
      const ctrl = new AbortController();
      setController(ctrl);

      const res = await api.post(UPLOAD_URL, fd, {
        signal: ctrl.signal,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (pe) => {
          if (!pe.total) return;
          const pct = Math.round((pe.loaded * 100) / pe.total);
          setUploadPct(pct);
        },
      });

      const resp = res?.data ?? {};
      const skipped: FilaExcel[] = resp?.skippedAprendices ?? [];
      const inserted: number = resp?.inserted ?? 0;
      const updated: number = resp?.updated ?? 0;
      const skippedCount: number = resp?.skipped ?? skipped.length ?? 0;
      const processedResp: any[] = resp?.processed ?? [];

      // Guardar en estado
      // Preferimos poblar skippedAprendices desde processed (más confiable)
      const skippedFromProcessed: FilaExcel[] = processedResp
        .filter((p) => p.status === "skipped")
        .map((p) => ({
          ["Número de Documento"]: p["Número de Documento"] || "",
          ["Correo Electrónico"]: p["Correo Electrónico"] || "",
          ["Nombre"]: p.Nombre || "",
          ["Apellidos"]: p.Apellidos || "",
          motivo: p.motivo || "Omitido",
        }));

      // fallback al campo skipped si backend no devuelve processed (compatibilidad)
      setSkippedAprendices(
        skippedFromProcessed.length > 0 ? skippedFromProcessed : skipped
      );

      setProcessed(processedResp);

      // Mensaje resumido en toast
      const resumen = `Insertados: ${inserted} • Actualizados: ${updated} • Omitidos: ${skippedCount}`;
      setToastMsg(resp?.message ? `${resp.message} — ${resumen}` : resumen);
      setShowToast(true);

      // Abrir modal si hay omitidos
      if (
        (Array.isArray(skippedFromProcessed) && skippedFromProcessed.length > 0) ||
        (Array.isArray(skipped) && skipped.length > 0)
      ) {
        setShowSkippedModal(true);
      } else {
        setShowSkippedModal(false);
      }

      // Mostrar modal con processed si hay datos
      if (Array.isArray(processedResp) && processedResp.length > 0) {
        setShowProcessedModal(true);
      }

      setUploaded(true);
      setController(null);
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        (err.code === "ERR_CANCELED" || err.message.includes("canceled"))
      ) {
        setMsg({ type: "warning", text: "Subida cancelada por el usuario." });
      } else if (err instanceof DOMException && err.name === "AbortError") {
        setMsg({ type: "warning", text: "Subida cancelada por el usuario." });
      } else if (axios.isAxiosError(err)) {
        const apiMsg =
          err.response?.data?.message ||
          err.message ||
          "Error al importar aprendices. Revisa el formato del archivo y los campos requeridos.";
        setMsg({ type: "danger", text: apiMsg });
      } else if (err instanceof Error) {
        setMsg({ type: "danger", text: err.message || "Error desconocido." });
      } else {
        setMsg({
          type: "danger",
          text: "Error al importar aprendices. Revisa el formato del archivo y los campos requeridos.",
        });
      }
    } finally {
      setSubiendo(false);
      setController(null); // limpieza por si quedó algo
    }
  };
  const handleConfirmUpload = async () => {
    setShowConfirmModal(false);
    await onSubmit();
  };

  const centroSeleccionado = centros.find(
    (c) => String(c.id) === String(centroId)
  );

  return (
    <div>
      <Container className="mb-5">
        <h1>Cargar Archivos de Aprendices Admin</h1>

        {!isAdmin && (
          <Alert variant="warning" className="mt-3">
            Debes iniciar sesión como <strong>Admin</strong> para importar
            aprendices
          </Alert>
        )}
        {msg && (
          <Alert variant={msg.type} className="mt-3">
            {msg.text}
          </Alert>
        )}
        {uploaded && (
          <Alert variant="success" className="mt-3">
            El archivo se subió correctamente.
          </Alert>
        )}
      </Container>

      <Container className="mb-4">
        <div className="d-flex gap-3 align-items-end">
          <Form.Group controlId="fileExcel" className="flex-grow-1">
            <Form.Label>Archivo Excel</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileChange}
              disabled={!isAdmin || subiendo}
            />
          </Form.Group>

          <Form.Group controlId="regionalSelect">
            <Form.Label>Regionales</Form.Label>
            <Form.Select
              value={regionalId}
              onChange={(e) => setRegionalId(e.target.value)}
              disabled={!isAdmin || subiendo || cargandoRegional}
            >
              <option value="">
                {cargandoRegional
                  ? "Cargando Regionales..."
                  : "Seleccione un regional"}
              </option>
              {regionales.map((r, i) => (
                <option key={`${String(r.id)}-${i}`} value={String(r.id)}>
                  {r.nombre}
                </option>
              ))}
            </Form.Select>
            {cargandoRegional && (
              <div className="mt-2">
                <Spinner animation="border" size="sm" /> Cargando…
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="centroSelect">
            <Form.Label>Centro de Formación</Form.Label>
            <Form.Select
              value={centroId}
              onChange={(e) => setCentroId(e.target.value)}
              disabled={!isAdmin || subiendo || cargandoCentros || !regionalId}
            >
              <option value="">
                {!regionalId
                  ? "Seleccione una regional primero"
                  : cargandoCentros
                  ? "Cargando centros..."
                  : centrosFiltrados.length === 0
                  ? "No hay centros para la regional seleccionada"
                  : "Seleccione un centro"}
              </option>
              {centrosFiltrados.map((c, i) => (
                <option key={`${String(c.id)}-${i}`} value={String(c.id)}>
                  {c.nombre}
                </option>
              ))}
            </Form.Select>
            {cargandoCentros && (
              <div className="mt-2">
                <Spinner animation="border" size="sm" /> Cargando…
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="jornadaSelect">
            <Form.Label>Jornada</Form.Label>
            <Form.Select
              value={jornada}
              onChange={(e) => setJornada(e.target.value)}
              disabled={!isAdmin || subiendo}
            >
           
              <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </Form.Select>
          </Form.Group>

          {/* Checkbox para updateIfExists */}
          <Form.Group controlId="updateIfExists" className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="updateIfExistsCheckbox"
              label="Actualizar si ya existe"
              checked={updateIfExists}
              onChange={(e) => setUpdateIfExists(e.target.checked)}
              disabled={!isAdmin || subiendo}
            />
            <small className="text-muted ms-2">Si está activado actualizará registros existentes.</small>
          </Form.Group>
        </div>

        {(fichaDetectada || programaDetectado || centroSeleccionado) && (
          <div className="mt-2">
            <small className="text-muted">
              <strong>Ficha detectada:</strong> {fichaDetectada || "—"} {" | "}
              <strong>Programa:</strong> {programaDetectado || "—"} {" | "}
              <strong>Centro:</strong> {centroSeleccionado?.nombre || "—"}
            </small>
          </div>
        )}

        {subiendo && (
          <div className="mt-3">
            <ProgressBar now={uploadPct} label={`${uploadPct}%`} animated />
          </div>
        )}
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Importación</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Atención</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            Recuerda que los aprendices que no estén en estado activo y en
            formación ,no podrán votar a menos de que se modifique su estado
            manualmente.
          </p>
          <p>
            El archivo debe ser el reporte oficial de aprendices generado desde{" "}
            <span className="text-success">Sofia plus</span>. Asegúrate de no
            modificar los nombres de columnas ni el formato original del
            reporte.
          </p>

          <ul>
            <li>
              Archivo seleccionado: <strong>{file?.name || "—"}</strong>
            </li>
            <li>
              Regional:{" "}
              <strong>
                {regionales.find((r) => String(r.id) === regionalId)?.nombre ||
                  "—"}
              </strong>
            </li>
            <li>
              Centro:{" "}
              <strong>
                {centros.find((c) => String(c.id) === centroId)?.nombre || "—"}
              </strong>
            </li>
            <li>
              Ficha detectada: <strong>{fichaDetectada || "—"}</strong>
            </li>
            <li>
              Programa detectado: <strong>{programaDetectado || "—"}</strong>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
            disabled={subiendo}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmUpload}
            disabled={subiendo}
          >
            {subiendo ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Subiendo…
              </>
            ) : (
              "Confirmar y subir"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSkippedModal}
        onHide={() => setShowSkippedModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Aprendices Omitidos {skippedAprendices.length > 0 ? `(${skippedAprendices.length})` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {skippedAprendices.length === 0 ? (
            <p>No hay aprendices omitidos.</p>
          ) : (
            <Table responsive className="align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Motivo</th> {/* nueva columna */}
                </tr>
              </thead>
              <tbody>
                {skippedAprendices.map((a, i) => (
                  <tr key={i}>
                    <td>{a["Número de Documento"] || "—"}</td>
                    <td>{a["Correo Electrónico"] || "—"}</td>
                    <td>{a["Nombre"] || "—"}</td>
                    <td>{a["Apellidos"] || "—"}</td>
                    <td>{(a.motivo as string) || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSkippedModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal con processed (resultado por fila) */}
      <Modal
        show={showProcessedModal}
        onHide={() => setShowProcessedModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resultados por fila ({processed.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {processed.length === 0 ? (
            <p>No hay resultados procesados.</p>
          ) : (
            <Table responsive className="align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {processed.map((p, i) => (
                  <tr key={i}>
                    <td>{p["Número de Documento"] || "—"}</td>
                    <td>{p["Correo Electrónico"] || "—"}</td>
                    <td>{p.Nombre || "—"}</td>
                    <td>{p.Apellidos || "—"}</td>
                    <td>
                      <Badge
                        bg={
                          p.status === "inserted"
                            ? "success"
                            : p.status === "updated"
                            ? "primary"
                            : "secondary"
                        }
                        pill
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td>{p.motivo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcessedModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="m-0">Vista Previa de los Datos</h2>
          <small className="text-muted">
            Mostrando {preview.length} filas (solo vista previa)
          </small>
        </div>

        <div className="border rounded">
          <Table responsive className="align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Programa (C2)</th>
                <th>Jornada</th>
                <th>Centro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {preview.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                preview.map((fila, i) => {
                  const nombre =
                    `${fila["Nombre"] || ""} ${
                      fila["Apellidos"] || ""
                    }`.trim() || "—";
                  const doc = fila["Número de Documento"]?.toString() || "—";
                  const correo = fila["Correo Electrónico"] || "—";
                  const estado = (fila["Estado"] || "").toString().trim();
                  const activo = estado.toLowerCase() === "activo";
                  return (
                    <tr key={i}>
                      <td>{nombre}</td>
                      <td>{doc}</td>
                      <td>{correo}</td>
                      <td>{programaDetectado || "—"}</td>
                      <td>{jornada}</td>
                      <td>{centroSeleccionado?.nombre || "-"}</td>
                      <td>
                        {estado ? (
                          <Badge bg={activo ? "success" : "secondary"} pill>
                            {estado}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </Container>
      <Container className="d-flex justify-content-end gap-2 mt-3">
        {subiendo && controller && (
          <Button variant="danger" onClick={() => controller.abort()}>
            Cancelar subida
          </Button>
        )}

        {/* Botón para abrir processed si quieres verlo manualmente */}
        {processed.length > 0 && (
          <Button variant="outline-secondary" onClick={() => setShowProcessedModal(true)}>
            Ver resultados por fila
          </Button>
        )}

        <Button
          variant="primary"
          onClick={() => setShowConfirmModal(true)}
          disabled={!isAdmin || !file || subiendo || !centroId || !regionalId}
        >
          {subiendo ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Subiendo…
            </>
          ) : (
            "Subir Archivos y Procesar"
          )}
        </Button>
      </Container>
    </div>
  );
}
