import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import jsPDF from 'jspdf';
//HOLA
interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  votos: number;
  porcentaje: number;
}

interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  fechaVoto: string;
}

interface Eleccion {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  centro: string;
  jornada: string;
  totalVotos: number;
  candidatos?: Candidato[];
  participantes?: Participante[];
}

interface GeneracionReporteProps {
  eleccion?: Eleccion;
}

const GeneracionReporte: React.FC<GeneracionReporteProps> = ({ eleccion: eleccionProp }) => {
  const [eleccion, setEleccion] = useState<Eleccion | null>(null);
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para demostración
  const datosEjemplo: Eleccion = {
    id: '1',
    nombre: 'Eleccion prueba 2',
    fechaInicio: '2025-09-24',
    fechaFin: '2025-09-29',
    estado: 'Finalizada',
    centro: 'Centro de Gestión Administrativa',
    jornada: 'Mañana',
    totalVotos: 0,
    candidatos: [],
    participantes: []
  };

  React.useEffect(() => {
    if (eleccionProp) {
      setEleccion(eleccionProp);
    } else {
      setEleccion(datosEjemplo);
    }
  }, [eleccionProp]);

  // Función principal para generar el reporte PDF
  const generarReportePDF = async () => {
    if (!eleccion) return;

    setCargando(true);
    
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Configuración de página
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin + 10;

      // ENCABEZADO DEL REPORTE
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('REPORTE DE ELECCIÓN', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Línea separadora
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 20;

      // INFORMACIÓN GENERAL
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN GENERAL', margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const infoEleccion = [
        `Nombre: ${eleccion.nombre || 'No especificado'}`,
        `Fecha de Inicio: ${eleccion.fechaInicio || 'No especificada'}`,
        `Fecha de Fin: ${eleccion.fechaFin || 'No especificada'}`,
        `Estado: ${eleccion.estado || 'Finalizada'}`,
        `Centro: ${eleccion.centro || 'No especificado'}`,
        `Jornada: ${eleccion.jornada || 'No especificada'}`,
        `Total de Votos: ${eleccion.totalVotos || 0}`,
        `Total de Candidatos: ${eleccion.candidatos?.length || 0}`,
        `Total de Participantes: ${eleccion.participantes?.length || 0}`
      ];

      infoEleccion.forEach(info => {
        doc.text(info, margin + 5, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Encontrar el ganador
      const ganador = eleccion?.candidatos && eleccion.candidatos.length > 0 
        ? [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[0] 
        : null;

      // GANADOR DE LA ELECCIÓN
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0);
      doc.text('GANADOR DE LA ELECCIÓN', margin, yPosition);
      yPosition += 15;

      if (ganador) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${ganador.nombre} ${ganador.apellido}`, margin + 5, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Votos obtenidos: ${ganador.votos} (${ganador.porcentaje.toFixed(2)}%)`, margin + 5, yPosition);
        yPosition += 20;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('No hay candidatos registrados en esta elección', margin + 5, yPosition);
        yPosition += 20;
      }

      // RESULTADOS POR CANDIDATO
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('RESULTADOS POR CANDIDATO', margin, yPosition);
      yPosition += 15;

      if (eleccion?.candidatos && eleccion.candidatos.length > 0) {
        // Encabezados de tabla
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('CANDIDATO', margin + 5, yPosition);
        doc.text('VOTOS', margin + 85, yPosition);
        doc.text('PORCENTAJE', margin + 115, yPosition);
        doc.text('ESTADO', margin + 155, yPosition);
        yPosition += 5;

        // Línea bajo encabezados
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Datos de candidatos ordenados por votos
        const candidatosOrdenados = [...eleccion.candidatos].sort((a, b) => b.votos - a.votos);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        candidatosOrdenados.forEach((candidato) => {
          // Verificar si necesitamos nueva página
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin + 20;
            
            // Redibujar encabezados en nueva página
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('CANDIDATO', margin + 5, yPosition);
            doc.text('VOTOS', margin + 85, yPosition);
            doc.text('PORCENTAJE', margin + 115, yPosition);
            doc.text('ESTADO', margin + 155, yPosition);
            yPosition += 5;
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
          }

          const esGanador = ganador && candidato.id === ganador.id;
          
          if (esGanador) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 128, 0);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
          }

          // Truncar nombre si es muy largo
          const nombreCompleto = `${candidato.nombre} ${candidato.apellido}`;
          const nombreTruncado = nombreCompleto.length > 25 ? nombreCompleto.substring(0, 22) + '...' : nombreCompleto;
          
          doc.text(nombreTruncado, margin + 5, yPosition);
          doc.text(candidato.votos.toString(), margin + 85, yPosition);
          doc.text(`${candidato.porcentaje.toFixed(1)}%`, margin + 115, yPosition);
          doc.text(esGanador ? 'GANADOR' : 'CANDIDATO', margin + 155, yPosition);

          yPosition += 8;
        });

        yPosition += 15;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('No hay candidatos registrados en esta elección', margin + 5, yPosition);
        yPosition += 20;
      }

      // LISTA DE PARTICIPANTES
      if (eleccion?.participantes && eleccion.participantes.length > 0) {
        // Verificar si necesitamos nueva página
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin + 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('PARTICIPANTES EN LA ELECCIÓN', margin, yPosition);
        yPosition += 15;

        // Encabezados de tabla
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('NOMBRE COMPLETO', margin + 5, yPosition);
        doc.text('DOCUMENTO', margin + 80, yPosition);
        doc.text('FECHA DE VOTO', margin + 130, yPosition);
        yPosition += 5;

        // Línea bajo encabezados
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Lista de participantes
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        eleccion.participantes.forEach((participante) => {
          // Verificar si necesitamos nueva página
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin + 20;
            
            // Redibujar encabezados
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('NOMBRE COMPLETO', margin + 5, yPosition);
            doc.text('DOCUMENTO', margin + 80, yPosition);
            doc.text('FECHA DE VOTO', margin + 130, yPosition);
            yPosition += 5;
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
          }

          // Truncar nombre si es muy largo
          const nombreCompleto = `${participante.nombre} ${participante.apellido}`;
          const nombreTruncado = nombreCompleto.length > 22 ? nombreCompleto.substring(0, 19) + '...' : nombreCompleto;
          
          doc.text(nombreTruncado, margin + 5, yPosition);
          doc.text(participante.documento, margin + 80, yPosition);
          
          // Formatear fecha
          const fechaCorta = new Date(participante.fechaVoto).toLocaleDateString('es-ES');
          doc.text(fechaCorta, margin + 130, yPosition);
          yPosition += 8;
        });
      }

      // ESTADÍSTICAS DETALLADAS
      if (eleccion?.candidatos && eleccion.candidatos.length > 0) {
        // Verificar si necesitamos nueva página
        if (yPosition > pageHeight - 120) {
          doc.addPage();
          yPosition = margin + 20;
        }

        yPosition += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('ESTADÍSTICAS DETALLADAS', margin, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        // Calcular estadísticas
        const totalVotos = eleccion.candidatos.reduce((sum, c) => sum + c.votos, 0);
        const promedioVotos = totalVotos / eleccion.candidatos.length;
        const votosMaximos = Math.max(...eleccion.candidatos.map(c => c.votos));
        const votosMinimos = Math.min(...eleccion.candidatos.map(c => c.votos));
        const segundoLugar = [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[1]?.votos || 0;
        
        doc.text(`• Total de votos emitidos: ${totalVotos}`, margin + 5, yPosition);
        yPosition += 8;
        doc.text(`• Promedio de votos por candidato: ${promedioVotos.toFixed(1)}`, margin + 5, yPosition);
        yPosition += 8;
        doc.text(`• Votos máximos obtenidos: ${votosMaximos}`, margin + 5, yPosition);
        yPosition += 8;
        doc.text(`• Votos mínimos obtenidos: ${votosMinimos}`, margin + 5, yPosition);
        yPosition += 8;
        doc.text(`• Diferencia entre ganador y segundo lugar: ${votosMaximos - segundoLugar}`, margin + 5, yPosition);
        yPosition += 15;
      }

      // Pie de página con fecha y número de página
      const agregarPiePagina = (numeroPagina: number) => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        
        const fechaGeneracion = new Date().toLocaleDateString('es-ES');
        const textoFecha = `Reporte generado el ${fechaGeneracion}`;
        const textoPagina = `Página ${numeroPagina}`;
        
        doc.text(textoFecha, margin, pageHeight - 10);
        doc.text(textoPagina, pageWidth - margin - 20, pageHeight - 10);
      };

      // Agregar pie de página a todas las páginas
      const totalPaginas = doc.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        agregarPiePagina(i);
      }

      // Guardar el PDF
      const nombreArchivo = `Reporte_Eleccion_${eleccion.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nombreArchivo);

    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
    } finally {
      setCargando(false);
    }
  };

  // Encontrar el ganador para mostrar en la UI
  const ganador = eleccion?.candidatos && eleccion.candidatos.length > 0 
    ? [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[0] 
    : null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Generación de Reportes
        </h2>
        <p className="text-gray-600">
          Genere reportes detallados de las elecciones con estadísticas completas
        </p>
      </div>

      {eleccion && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Información de la Elección
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nombre:</span> {eleccion.nombre}
            </div>
            <div>
              <span className="font-medium">Estado:</span> {eleccion.estado}
            </div>
            <div>
              <span className="font-medium">Centro:</span> {eleccion.centro}
            </div>
            <div>
              <span className="font-medium">Jornada:</span> {eleccion.jornada}
            </div>
            <div>
              <span className="font-medium">Total Votos:</span> {eleccion.totalVotos}
            </div>
            <div>
              <span className="font-medium">Candidatos:</span> {eleccion.candidatos?.length || 0}
            </div>
          </div>
        </div>
      )}

      {/* Botón para generar PDF */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generarReportePDF}
          disabled={cargando}
          className="btn btn-primary btn-lg d-flex align-items-center gap-2"
          style={{
            background: cargando ? '#6c757d' : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease',
            transform: cargando ? 'none' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!cargando) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!cargando) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          <FaFilePdf size={20} />
          {cargando ? (
            <>
              <span>Generando Reporte...</span>
              <div 
                className="spinner-border spinner-border-sm ms-2" 
                role="status"
                style={{ width: '16px', height: '16px' }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </>
          ) : (
            'Generar Reporte PDF'
          )}
        </button>
      </div>

      {ganador && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-2">
            🏆 Ganador de la Elección
          </h4>
          <p className="text-green-700">
            <span className="font-medium">{ganador.nombre} {ganador.apellido}</span> 
            {' '}con {ganador.votos} votos ({ganador.porcentaje.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneracionReporte;
