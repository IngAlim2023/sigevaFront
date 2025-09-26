/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import type { User, Gestor } from "../../context/auth/types/authTypes";
import Modal from "react-bootstrap/Modal";
import { Toast } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";

// listo para explicar el codigoooooo
type FilaExcel = {
  [k: string]: any;
};

const UPLOAD_URL = "/api/aprendices/importarExcel";

export default function CargarAprendices() {
  const { user, isAuthenticated } = useAuth();
  const isFuncionario =
    isAuthenticated && (user as User)?.perfil === "Funcionario";
  const userId = isFuncionario ? (user as Gestor).id : null;

  const [file, setFile] = useState<File | null>(null);
  const [jornada, setJornada] = useState("Mañana");
  const [preview, setPreview] = useState<FilaExcel[]>([]);
  const [allData, setAllData] = useState<FilaExcel[] | null>(null);
  const [programaDetectado, setProgramaDetectado] = useState("");
  const [fichaDetectada, setFichaDetectada] = useState("");
  const [msg, setMsg] = useState<{
    type: "success" | "danger" | "warning";
    text: string;
  } | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [skippedAprendices, setSkippedAprendices] = useState<FilaExcel[]>([]);
  const [showSkippedModal, setShowSkippedModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // helper: quita tildes, pone en minúscula y limpia espacios
  const normalize = (s: any) =>
    String(s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // quita acentos
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // normaliza keys de un objeto (ej: "Correo Electrónico" -> "correo electronico")
  const normalizeKeys = (row: Record<string, any>) => {
    const out: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      const nk = normalize(k);
      out[nk] = row[k];
    });
    return out;
  };

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

    const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
      range: 4,
      defval: "",
    });

    // Guarda toda la data para validaciones posteriores
    setAllData(data);

    if (data.length > 0) {
      console.log("Encabezados detectados (primer row):", Object.keys(data[0]));
      setPreview(data.slice(0, 20));
    } else {
      setPreview([]);
    }

    return data;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUploadPct(0);
    setAllData(null);
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
    } catch (err) {
      console.error(err);
      setMsg({
        type: "danger",
        text: "No se pudo leer el Excel para la vista previa.",
      });
    }
  };

  // onSubmit ahora acepta `force` para obligar la subida incluso si hay omitidos
  const onSubmit = async (force = false) => {
    if (!isFuncionario) {
      setMsg({
        type: "warning",
        text: "Solo los usuarios con perfil Funcionario pueden importar aprendices.",
      });
      setShowToast(true);
      return;
    }
    if (!userId) {
      setMsg({ type: "danger", text: "No se encontró el userId en sesión." });
      setShowToast(true);
      return;
    }
    if (!file) {
      setMsg({ type: "danger", text: "Selecciona un archivo Excel primero." });
      setShowToast(true);
      return;
    }

    // usa allData si está disponible (guardada en la lectura para preview), sino lee el archivo ahora
    let dataToValidate: Record<string, any>[] = [];
    if (allData && allData.length > 0) {
      dataToValidate = allData;
    } else {
      // leer todo desde el archivo (fallback)
      try {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        dataToValidate = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
          range: 4,
          defval: "",
        });
      } catch (err) {
        console.error(err);
        setMsg({
          type: "danger",
          text: "No se pudo leer el archivo para validar.",
        });
        setShowToast(true);
        return;
      }
    }

    // normalizamos keys y valores para validar correctamente sin depender de acentos o mayúsculas
    const normalizedRows = dataToValidate.map((r) => normalizeKeys(r));

    const invalidos = normalizedRows.filter((fila) => {
      const email = normalize(
        fila["correo electronico"] || fila["correo"] || fila["email"] || ""
      );
      const estado = normalize(fila["estado"] || "");
      const estadoValido =
        estado === "activo" ||
        estado === "en formacion" ||
        estado === "condicionado";
      return !email || !estadoValido;
    });

    // Mapea a un formato legible para mostrar en el modal (si quieres mantener claves originales, ajusta aquí)
    setSkippedAprendices(
      invalidos.map((r) => ({
        documento: r["numero de documento"] || r["documento"] || "—",
        correo: r["correo electronico"] || r["correo"] || r["email"] || "—",
        nombre: r["nombre"] || "—",
        apellidos: r["apellidos"] || "—",
      }))
    );

    if (invalidos.length > 0 && !force) {
      setShowSkippedModal(true);
      return; // Detiene subida hasta que el usuario confirme
    }

    const fd = new FormData();
    fd.append("excel", file);
    fd.append("userId", String(userId));
    fd.append("jornada", jornada);

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

      setMsg({
        type: "success",
        text: res?.data?.message || "Aprendices importados con éxito",
      });
      setShowToast(true);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al importar aprendices. Revisa el formato del archivo y los campos requeridos.";
      setMsg({ type: "danger", text: apiMsg });
      setShowToast(true);
    } finally {
      setSubiendo(false);
      setShowSkippedModal(false);
    }
  };

  // Confirmación desde el modal principal (antes de subir) -> no fuerza
  const handleConfirmUpload = async () => {
    setShowConfirmModal(false);
    await onSubmit(false);
  };

  // Confirmación desde el modal de omitidos -> fuerza la subida
  const handleConfirmSkipped = async () => {
    setShowSkippedModal(false);
    setShowConfirmModal(false);
    await onSubmit(true);
  };

  return (
    <div>
      <Container className="mb-5">
        <h1>Cargar Archivos De Votantes</h1>

        {!isFuncionario && (
          <Alert variant="warning" className="mt-3">
            Debes iniciar sesión como <strong>Funcionario</strong> para importar
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
              disabled={!isFuncionario || subiendo}
            />
          </Form.Group>

          <Form.Group controlId="jornadaSelect">
            <Form.Label>Jornada</Form.Label>
            <Form.Select
              value={jornada}
              onChange={(e) => setJornada(e.target.value)}
              disabled={!isFuncionario || subiendo}
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Nocturna">Nocturna</option>
            </Form.Select>
          </Form.Group>
        </div>

        {(fichaDetectada || programaDetectado) && (
          <div className="mt-2">
            <small className="text-muted">
              <strong>Ficha detectada:</strong> {fichaDetectada || "—"} |{" "}
              <strong>Programa:</strong> {programaDetectado || "—"}
            </small>
          </div>
        )}

        {subiendo && (
          <div className="mt-3">
            <ProgressBar now={uploadPct} label={`${uploadPct}%`} animated />
          </div>
        )}
      </Container>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="m-0">Vista Previa De los Datos</h2>
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
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {preview.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                preview.map((fila, i) => {
                  const nombre =
                    `${fila["Nombre"] || fila["nombre"] || ""} ${
                      fila["Apellidos"] || fila["apellidos"] || ""
                    }`.trim() || "—";
                  const doc = (
                    fila["Número de Documento"] ||
                    fila["numero de documento"] ||
                    fila["documento"] ||
                    "—"
                  ).toString();
                  const correo =
                    fila["Correo Electrónico"] ||
                    fila["correo electronico"] ||
                    fila["correo"] ||
                    fila["email"] ||
                    "—";
                  const estado = (fila["Estado"] || fila["estado"] || "")
                    .toString()
                    .trim();
                  const activo = estado.toLowerCase() === "activo";
                  return (
                    <tr key={i}>
                      <td>{nombre}</td>
                      <td>{doc}</td>
                      <td>{correo}</td>
                      <td>{programaDetectado || "—"}</td>
                      <td>{jornada}</td>
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
          onClick={() => setShowConfirmModal(true)}
          disabled={!isFuncionario || !file || subiendo}
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
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={
            msg?.type === "success"
              ? "success"
              : msg?.type === "danger"
              ? "danger"
              : "warning"
          }
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {msg?.type === "success"
                ? "Éxito"
                : msg?.type === "danger"
                ? "Error"
                : "Aviso"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{msg?.text}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> ⚠️Atención</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            Recuerda que los aprendices que no estén en estado activo y en
            formación ,no podrán votar a menos de que se modifique su estado
            manualmente.
          </p>
          <p>
            El archivo debe ser el reporte oficial de aprendices generado desde
            <p className="text-success ">Sofia plus</p>
            Asegúrate de no modificar los nombres de columnas ni el formato
            original del reporte.
          </p>
          <ul>
            <li>
              Archivo seleccionado: <strong>{file?.name || "—"}</strong>
            </li>

            <li className="text-danger">
              Ten en cuenta que los aprendices seran enlazados segun tu centro
              de Formación
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
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Subiendo…
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
          <Modal.Title>Aprendices Omitidos</Modal.Title>
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
                </tr>
              </thead>
              <tbody>
                {skippedAprendices.map((a, i) => (
                  <tr key={i}>
                    <td>{a.documento || "—"}</td>
                    <td>{a.correo || "—"}</td>
                    <td>{a.nombre || "—"}</td>
                    <td>{a.apellidos || "—"}</td>
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
            disabled={subiendo}
          >
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmSkipped}
            disabled={subiendo}
          >
            Confirmar y subir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
