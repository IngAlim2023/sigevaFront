import { Modal, Row, Col, Card, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import GeneracionReporte from "../pages/funcionario/GeneracionReporte_NEW";
import { api } from "../api";

interface Aprendiz {
  nombres: string;
  apellidos: string;
}

interface Candidato {
  idcandidatos: string;
  numeroTarjeton: string;
  foto: string;
  aprendiz: Aprendiz;
}

interface Eleccion {
  ideleccion: number;
  titulo: string;
  centro: string;
  jornada: string | null;
  fechaInicio: string;
  fechaFin: string;
}

interface EleccionDetalleModalProps {
  show: boolean;
  onClose: () => void;
  eleccion: Eleccion | null;
  candidatos: Candidato[];
}

export default function EleccionDetalleModal({
  show,
  onClose,
  eleccion,
  candidatos,
}: EleccionDetalleModalProps) {
  const [showReporte, setShowReporte] = useState(false);
  const [loadingVotos, setLoadingVotos] = useState(false);
  const [eleccionParaReporte, setEleccionParaReporte] = useState<any | null>(null);

  const handleGenerarReporte = async () => {
    if (!eleccion) return;
    setShowReporte(true);
    setLoadingVotos(true);
    try {
      // Traer datos reales del backend con fallback de ruta
      let dataResp: any | null = null;
      try {
        const { data } = await api.get(`/reporte/eleccion/${eleccion.ideleccion}`);
        dataResp = data;
      } catch (err: any) {
        if (err?.response?.status === 404) {
          console.warn("/reporte/eleccion/:id devolvió 404. Probando /api/reporte/eleccion/:id ...");
          const { data } = await api.get(`/api/reporte/eleccion/${eleccion.ideleccion}`);
          dataResp = data;
        } else {
          throw err;
        }
      }
      console.log("Reporte de elección (real):", dataResp);

      const rep = dataResp;
      const candidatosResp: any[] = Array.isArray(rep.candidatos) ? rep.candidatos : [];
      const totalVotos = candidatosResp.reduce((sum, c) => sum + Number(c.votos || 0), 0);

      const candidatosTransformados = candidatosResp.map((c) => {
        const votos = Number(c.votos || 0);
        const porcentaje = totalVotos > 0 ? (votos / totalVotos) * 100 : 0;
        // Separar nombres en nombre/apellido si viene junto
        const partes = String(c.nombres || "").split(" ");
        const nombre = partes[0] || String(c.nombres || "");
        const apellido = partes.slice(1).join(" ") || "";
        return {
          id: Number(c.idcandidatos),
          nombre,
          apellido,
          votos,
          porcentaje,
          numeroTarjeton: c.numero_tarjeton || undefined,
          propuesta: c.propuesta || undefined,
        };
      });

      const eleccionTransformada = {
        id: String(rep.eleccion?.id ?? eleccion.ideleccion),
        nombre: rep.eleccion?.nombre ?? eleccion.titulo,
        fechaInicio: rep.eleccion?.fecha_inicio ?? eleccion.fechaInicio,
        fechaFin: rep.eleccion?.fecha_fin ?? eleccion.fechaFin,
        estado: "Finalizada",
        centro: String(rep.eleccion?.idcentro_formacion ?? eleccion.centro),
        jornada: eleccion.jornada || "No especificada",
        totalVotos,
        totalParticipantes: typeof rep.totalParticipantes === 'number' ? rep.totalParticipantes : undefined,
        candidatos: candidatosTransformados,
        participantes: [],
      };

      setEleccionParaReporte(eleccionTransformada);
    } catch (error) {
      console.error("Error al obtener reporte real:", error);
      setEleccionParaReporte(null);
    } finally {
      setLoadingVotos(false);
    }
  };

  const handleVolverDeReporte = () => {
    setShowReporte(false);
  };

  if (!eleccion) return null;

  // Fallback en caso de no tener datos reales aún
  const totalVotosFallback = 0;
  const eleccionFallback = {
    id: eleccion.ideleccion.toString(),
    nombre: eleccion.titulo,
    fechaInicio: eleccion.fechaInicio,
    fechaFin: eleccion.fechaFin,
    estado: 'Finalizada',
    centro: eleccion.centro,
    jornada: eleccion.jornada || 'No especificada',
    totalVotos: totalVotosFallback,
    candidatos: [],
    participantes: []
  };

  return (
    <Modal show={show} onHide={onClose} size={showReporte ? "xl" : "lg"} centered>
      <Modal.Body className="p-4">
        {!showReporte ? (
          <>
            <h4 className="fw-bold mb-3">{eleccion.titulo}</h4>
            <p className="text-muted">
              <FaCalendarAlt className="me-2" />
              {eleccion.fechaInicio} - {eleccion.fechaFin}
            </p>
            <p>
              <strong>Jornada:</strong> {eleccion.jornada}
            </p>

            <Row className="g-3 mt-3">
              {candidatos.map((candidato) => (
                <Col key={candidato.idcandidatos} xs={6} md={4} lg={3}>
                  <Card className="shadow-sm text-center p-2" style={{ width: "140px" }}>
                    {(() => {
                      const base = import.meta.env.VITE_BASE_URL as string | undefined;
                      const raw = candidato.foto?.trim();
                      const src = raw
                        ? (raw.startsWith('http') ? raw : (base ? `${base}/${raw.replace(/^\/+/, '')}` : raw))
                        : undefined;
                      return src ? (
                        <Card.Img
                          src={src}
                          alt={`${candidato.aprendiz.nombres} ${candidato.aprendiz.apellidos}`}
                          className="rounded-circle mx-auto d-block"
                          style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-light text-secondary"
                          style={{ width: "80px", height: "80px", fontWeight: 600 }}
                          aria-label="Sin foto"
                        >
                          {`${candidato.aprendiz.nombres?.[0] || ''}${candidato.aprendiz.apellidos?.[0] || ''}`.toUpperCase()}
                        </div>
                      );
                    })()}
                    <Card.Body className="p-2">
                      <Card.Title className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        {candidato.aprendiz.nombres} {candidato.aprendiz.apellidos}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.8rem" }}>
                        Tarjetón: {candidato.numeroTarjeton}
                      </Card.Text>
                      
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="d-flex gap-3 mt-4">
              <Button variant="secondary" onClick={onClose}>
                Volver
              </Button>
              <Button className="btn-gradient" onClick={handleGenerarReporte} disabled={loadingVotos}>
                {loadingVotos ? 'Cargando votos...' : 'Generar PDF'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="outline-secondary" onClick={handleVolverDeReporte}>
                ← Volver al Detalle
              </Button>
            </div>
            {loadingVotos && <div className="text-center py-3">Cargando reporte...</div>}
            {!loadingVotos && (
              <GeneracionReporte eleccion={eleccionParaReporte || eleccionFallback} />
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
