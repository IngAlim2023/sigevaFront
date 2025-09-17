import React from 'react';
import jsPDF from 'jspdf';
import { Button } from 'react-bootstrap';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

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
  id?: number;
  ideleccion?: number;
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  jornada?: string;
  centro?: string;
  regional?: string;
  candidatos?: Candidato[];
  participantes?: Participante[];
  totalVotos?: number;
}

interface GeneracionReporteProps {
  eleccion: Eleccion;
}

const GeneracionReporte: React.FC<GeneracionReporteProps> = ({ eleccion }) => {
  
  const determinarGanador = (): Candidato | null => {
    if (!eleccion.candidatos || !Array.isArray(eleccion.candidatos) || eleccion.candidatos.length === 0) return null;
    return eleccion.candidatos.reduce((ganador, candidato) => 
      candidato.votos > ganador.votos ? candidato : ganador
    );
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generarReportePDF = () => {
    try {
      console.log('Iniciando generación de PDF...', eleccion);
      
      const doc = new jsPDF();
      const ganador = determinarGanador();
    
    // Configuración inicial
    doc.setFont('helvetica');
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Título del reporte
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE ELECCIÓN', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Información general de la elección - TABLA CON BORDES
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN GENERAL', margin, yPosition);
    yPosition += 15;

    // Configuración de tabla
    const tableStartY = yPosition;
    const rowHeight = 12;
    const col1Width = 60;
    const col2Width = contentWidth - col1Width;
    
    // Datos para la tabla
    const infoData = [
      ['Nombre de la Elección:', eleccion.titulo || eleccion.nombre || 'Sin nombre'],
      ['Fecha de Inicio:', eleccion.fechaInicio || 'No especificada'],
      ['Fecha de Fin:', eleccion.fechaFin || 'No especificada'],
      ['Estado:', eleccion.estado || 'Finalizada']
    ];
    
    // Agregar datos opcionales
    if (eleccion.jornada) {
      infoData.push(['Jornada:', eleccion.jornada]);
    }
    if (eleccion.centro) {
      infoData.push(['Centro:', eleccion.centro]);
    }
    if (eleccion.descripcion) {
      infoData.push(['Descripción:', eleccion.descripcion]);
    }

    // Dibujar tabla con bordes
    doc.setFontSize(10);
    infoData.forEach((row, index) => {
      const currentY = tableStartY + (index * rowHeight);
      
      // Bordes de la fila
      doc.setLineWidth(0.3);
      doc.rect(margin, currentY, col1Width, rowHeight);
      doc.rect(margin + col1Width, currentY, col2Width, rowHeight);
      
      // Contenido de la fila
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], margin + 3, currentY + 8);
      doc.setFont('helvetica', 'normal');
      
      // Manejar texto largo en la segunda columna
      const textLines = doc.splitTextToSize(row[1], col2Width - 6);
      doc.text(textLines, margin + col1Width + 3, currentY + 8);
    });
    
    yPosition = tableStartY + (infoData.length * rowHeight) + 15;

    // Resultados de la elección - TABLA CON BORDES
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADOS DE LA ELECCIÓN', margin, yPosition);
    yPosition += 15;

    // Tabla de resultados
    const resultsTableY = yPosition;
    const resultsData = [
      ['Total de Votos Emitidos:', (eleccion.totalVotos || 0).toString()],
      ['Total de Participantes:', (eleccion.participantes?.length || 0).toString()],
      ['Total de Candidatos:', (eleccion.candidatos?.length || 0).toString()]
    ];

    doc.setFontSize(10);
    resultsData.forEach((row, index) => {
      const currentY = resultsTableY + (index * rowHeight);
      
      // Bordes de la fila
      doc.setLineWidth(0.3);
      doc.rect(margin, currentY, col1Width, rowHeight);
      doc.rect(margin + col1Width, currentY, col2Width, rowHeight);
      
      // Contenido
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], margin + 3, currentY + 8);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], margin + col1Width + 3, currentY + 8);
    });
    
    yPosition = resultsTableY + (resultsData.length * rowHeight) + 15;

    // Ganador
    if (ganador) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 128, 0); // Verde
      doc.text('🏆 GANADOR DE LA ELECCIÓN', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Negro
      doc.text(`${ganador.nombre} ${ganador.apellido}`, margin + 10, yPosition);
      yPosition += 6;
      doc.text(`Votos obtenidos: ${ganador.votos} (${ganador.porcentaje.toFixed(2)}%)`, margin + 10, yPosition);
      yPosition += 15;
    }

    // Resultados por candidato - TABLA CON BORDES (solo si existen)
    if (eleccion.candidatos && Array.isArray(eleccion.candidatos) && eleccion.candidatos.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('RESULTADOS POR CANDIDATO', margin, yPosition);
      yPosition += 15;

      // Configuración de tabla de candidatos
      const candidateTableY = yPosition;
      const candidateRowHeight = 14;
      const candidateColWidths = [80, 30, 40, 40]; // Nombre, Votos, Porcentaje, Estado
      
      // Encabezados con bordes
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240); // Fondo gris claro para encabezados
      
      // Dibujar encabezados
      const headers = ['CANDIDATO', 'VOTOS', 'PORCENTAJE', 'ESTADO'];
      let currentX = margin;
      
      headers.forEach((header, index) => {
        doc.rect(currentX, candidateTableY, candidateColWidths[index], candidateRowHeight, 'FD');
        doc.setTextColor(0, 0, 0);
        doc.text(header, currentX + 3, candidateTableY + 9);
        currentX += candidateColWidths[index];
      });
      
      yPosition = candidateTableY + candidateRowHeight;

      // Datos de candidatos ordenados por votos
      const candidatosOrdenados = [...eleccion.candidatos].sort((a, b) => b.votos - a.votos);
      
      candidatosOrdenados.forEach((candidato, index) => {
        if (yPosition > 250) { // Nueva página si es necesario
          doc.addPage();
          yPosition = 20;
        }
        
        // Determinar si es ganador
        const esGanador = ganador && candidato.id === ganador.id;
        
        // Color de fondo alternado
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        
        // Si es ganador, fondo verde claro
        if (esGanador) {
          doc.setFillColor(220, 255, 220);
        }
        
        currentX = margin;
        
        // Dibujar celdas con bordes
        candidateColWidths.forEach((width) => {
          doc.rect(currentX, yPosition, width, candidateRowHeight, 'FD');
          currentX += width;
        });
        
        // Contenido de las celdas
        doc.setFont('helvetica', esGanador ? 'bold' : 'normal');
        doc.setTextColor(esGanador ? 0 : 0, esGanador ? 100 : 0, 0);
        
        doc.text(`${candidato.nombre} ${candidato.apellido}`, margin + 3, yPosition + 9);
        doc.text(candidato.votos.toString(), margin + candidateColWidths[0] + 3, yPosition + 9);
        doc.text(`${candidato.porcentaje.toFixed(2)}%`, margin + candidateColWidths[0] + candidateColWidths[1] + 3, yPosition + 9);
        doc.text(esGanador ? 'GANADOR' : '-', margin + candidateColWidths[0] + candidateColWidths[1] + candidateColWidths[2] + 3, yPosition + 9);
        
        yPosition += candidateRowHeight;
      });

      yPosition += 15;
    } else {
      // Si no hay candidatos, mostrar mensaje
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('CANDIDATOS', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('No hay información de candidatos disponible.', margin, yPosition);
      yPosition += 15;
    }

    // Lista de participantes - TABLA CON BORDES (solo si existen)
    if (eleccion.participantes && Array.isArray(eleccion.participantes) && eleccion.participantes.length > 0) {
      if (yPosition > 180) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('PARTICIPANTES EN LA ELECCIÓN', margin, yPosition);
      yPosition += 15;

      // Configuración de tabla de participantes
      const participantTableY = yPosition;
      const participantRowHeight = 12;
      const participantColWidths = [70, 40, 60]; // Nombre, Documento, Fecha
      
      // Encabezados con bordes
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      
      const participantHeaders = ['NOMBRE COMPLETO', 'DOCUMENTO', 'FECHA DE VOTO'];
      let currentX = margin;
      
      participantHeaders.forEach((header, index) => {
        doc.rect(currentX, participantTableY, participantColWidths[index], participantRowHeight, 'FD');
        doc.setTextColor(0, 0, 0);
        doc.text(header, currentX + 3, participantTableY + 8);
        currentX += participantColWidths[index];
      });
      
      yPosition = participantTableY + participantRowHeight;

      // Lista de participantes
      eleccion.participantes.forEach((participante, index) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Color de fondo alternado
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        
        currentX = margin;
        
        // Dibujar celdas con bordes
        participantColWidths.forEach((width) => {
          doc.rect(currentX, yPosition, width, participantRowHeight, 'FD');
          currentX += width;
        });
        
        // Contenido de las celdas
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        doc.text(`${participante.nombre} ${participante.apellido}`, margin + 3, yPosition + 8);
        doc.text(participante.documento, margin + participantColWidths[0] + 3, yPosition + 8);
        doc.text(formatearFecha(participante.fechaVoto), margin + participantColWidths[0] + participantColWidths[1] + 3, yPosition + 8);
        
        yPosition += participantRowHeight;
      });
    } else {
      // Si no hay participantes, mostrar mensaje
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('PARTICIPANTES', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('No hay información de participantes disponible.', margin, yPosition);
      yPosition += 15;
    }

    // Pie de página
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Reporte generado el ${new Date().toLocaleDateString('es-ES')} - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Descargar el PDF
    const nombreEleccion = eleccion.nombre || 'Eleccion';
    const nombreArchivo = `Reporte_${nombreEleccion.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    console.log('Descargando PDF:', nombreArchivo);
    doc.save(nombreArchivo);
    console.log('PDF generado exitosamente');
    
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el reporte PDF. Por favor, revisa la consola para más detalles.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center p-4">
      <div className="text-center mb-4">
        <h3 className="mb-3">Generar Reporte de Elección</h3>
        <p className="text-muted">
          Genera un reporte completo en PDF con todos los resultados de la elección
        </p>
      </div>

      <div className="card shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body text-center">
          <FaFilePdf size={48} className="text-danger mb-3" />
          
          <h5 className="card-title">{eleccion.titulo || eleccion.nombre || 'Sin título'}</h5>
          <p className="card-text text-muted mb-3">
            {eleccion.descripcion}
          </p>
          
          <div className="row text-start mb-4">
            <div className="col-12 mb-2">
              <strong>Fecha de Inicio:</strong> {eleccion.fechaInicio || 'No especificada'}
            </div>
            <div className="col-12 mb-2">
              <strong>Fecha de Fin:</strong> {eleccion.fechaFin || 'No especificada'}
            </div>
            <div className="col-12 mb-2">
              <strong>Total de Votos:</strong> {eleccion.totalVotos}
            </div>
            <div className="col-12 mb-2">
              <strong>Candidatos:</strong> {eleccion.candidatos?.length || 0}
            </div>
            <div className="col-12 mb-2">
              <strong>Participantes:</strong> {eleccion.participantes?.length || 0}
            </div>
          </div>

          <Button
            variant="danger"
            size="lg"
            onClick={generarReportePDF}
            className="d-flex align-items-center justify-content-center gap-2"
            style={{ width: '100%' }}
          >
            <FaDownload />
            Generar y Descargar Reporte PDF
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <small className="text-muted">
          El reporte incluirá: información general, resultados por candidato, 
          ganador de la elección, lista de participantes y estadísticas completas.
        </small>
      </div>
    </div>
  );
};

export default GeneracionReporte;