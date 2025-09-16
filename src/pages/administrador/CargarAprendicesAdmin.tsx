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

type FilaExcel = {
  ["Tipo de Documento"]?: string;
  ["Número de Documento"]?: string | number;
  ["Nombre"]?: string;
  ["Apellidos"]?: string;
  ["Celular"]?: string | number;
  ["Correo Electrónico"]?: string;
  ["Estado"]?: string;
  [k: string]: any;
};

type CentroFormacion = {
  id: string | number;
  nombre: string;
};

const UPLOAD_URL = "/api/aprendices/importarExcel";
const CENTROS_URL = "/api/centrosFormacion/obtiene";

export default function CargarAprendices() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin =
    isAuthenticated &&
    user?.perfil?.toString().trim().toLowerCase() === "administrador";

  const userId = isAdmin ? (user as Gestor).id : null;

  const [centros, setCentros] = useState<CentroFormacion[]>([]);
  const [centroId, setCentroId] = useState<string>("");
  const [cargandoCentros, setCargandoCentros] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [jornada, setJornada] = useState("Diurna");
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

  useEffect(() => {
    const fetchCentros = async () => {
      setCargandoCentros(true);
      try {
        const res = await api.get(CENTROS_URL, { params: { activos: true } });
        console.log("Respuesta centros:", res.data);

        const lista = res.data?.data ?? [];
        setCentros(
          lista.map((c: any) => ({
            id: c.idcentroFormacion,
            nombre: c.centroFormacioncol,
          }))
        );
      } catch (e: any) {
        setMsg({
          type: "danger",
          text:
            e?.response?.data?.message ||
            "No se pudieron cargar los centros de formación",
        });
      } finally {
        setCargandoCentros(false);
      }
    };

    fetchCentros();
  }, []);

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

    const fd = new FormData();
    fd.append("excel", file, file.name);
    fd.append("userId", String(userId));
    fd.append("jornada", jornada);
    fd.append("centroFormacionId", String(centroId));
    for (const pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }
    setSubiendo(true);
    setMsg(null);
    setUploadPct(0);

    try {
      const res = await api.post(UPLOAD_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (pe) => {
          if (!pe.total) return;
          const pct = Math.round((pe.loaded * 100) / pe.total);
          setUploadPct(pct);
        },
      });

      setToastMsg(res?.data?.message || "Aprendices importados con éxito");
      setShowToast(true);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al importar aprendices. Revisa el formato del archivo y los campos requeridos.";
      setMsg({ type: "danger", text: apiMsg });
    } finally {
      setSubiendo(false);
    }
  };

  const centroSeleccionado = centros.find(
    (c) => String(c.id) === String(centroId)
  );

  return (
    <div>
      <Container className="mb-5">
        <h1>Cargar Archivos de Aprendices Admin</h1>
        <p>
          Seleccione un archivo Excel (.xlsx / .xls) con los datos de los
          aprendices. Cabeceras esperadas:
          <strong>
            {" "}
            "Tipo de Documento", "Número de Documento", "Nombre", "Apellidos",
            "Celular", "Correo Electrónico", "Estado"
          </strong>
          . En la celda <strong>C2</strong> debe venir <em>FICHA - PROGRAMA</em>
          .
        </p>
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

          <Form.Group controlId="centroSelect">
            <Form.Label>Centro de Formación</Form.Label>
            <Form.Select
              value={centroId}
              onChange={(e) => setCentroId(e.target.value)}
              disabled={!isAdmin || subiendo || cargandoCentros}
            >
              <option value="">
                {cargandoCentros
                  ? "Cargando centros..."
                  : "Seleccione un centro"}
              </option>
              {centros.map((c, i) => (
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
              <option value="Diurna">Diurna</option>
              <option value="Nocturna">Nocturna</option>
            </Form.Select>
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
            <strong className="me-auto">Importación exitosa</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

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

      <Container className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={!isAdmin || !file || subiendo || !centroId}
        >
          {subiendo ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />{" "}
              Subiendo…
            </>
          ) : (
            "Subir Archivos y Procesar"
          )}
        </Button>
      </Container>
    </div>
  );
}
