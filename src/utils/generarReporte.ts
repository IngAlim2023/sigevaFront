import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  votos: number;
  porcentaje: number;
  numeroTarjeton?: string;
  propuesta?: string;
}

export interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  fechaVoto: string;
}

export interface Eleccion {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  centro: string;
  jornada: string;
  totalVotos: number;
  totalParticipantes?: number;
  candidatos?: Candidato[];
  participantes?: Participante[];
}

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.toLowerCase().startsWith('image/')) {
      // Evitar tratar HTML/Texto como imagen (causa de "wrong PNG signature")
      return null;
    }
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function loadFirstAvailableLogo(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    const dataUrl = await loadImageAsDataUrl(p);
    if (!dataUrl) continue;
    const mimeAnyMatch = dataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,/i);
    const mime = mimeAnyMatch?.[1] || "image/png";
    if (mime.includes("svg")) {
      // Omitir SVG por no ser soportado en addImage
      continue;
    }
    // Verificar que el dataURL realmente carga como imagen en el navegador
    const ok = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = dataUrl;
    });
    if (!ok) continue;
    return dataUrl;
  }
  return null;
}

function drawBarChart(doc: jsPDF, x: number, y: number, width: number, height: number, data: { label: string; value: number }[]) {
  const padding = 10;
  const chartX = x + padding;
  const chartY = y + padding;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Axis
  doc.setDrawColor(180);
  doc.line(chartX, chartY, chartX, chartY + chartHeight);
  doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);

  const maxValue = Math.max(1, ...data.map(d => d.value));
  const barHeight = Math.min(18, chartHeight / (data.length || 1) - 6);

  data.forEach((d, idx) => {
    const yPos = chartY + idx * (barHeight + 6) + 6;
    const barW = (d.value / maxValue) * (chartWidth - 60);

    // Bar
    doc.setFillColor(59, 130, 246);
    doc.rect(chartX + 60, yPos - barHeight + 2, barW, barHeight, "F");

    // Labels
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(d.label, chartX, yPos);
    doc.text(String(d.value), chartX + 60 + barW + 4, yPos);
  });
}

export async function generarReporte(eleccion: Eleccion) {
  const doc = new jsPDF();
  // Revertir margen a 20 (valor previo)
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = margin;

  const ensureSpace = (needed: number) => {
    if (currentY + needed > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  // Logo: intentar múltiples rutas (PNG/JPG). Coloca el archivo en public/
  const logoDataUrl = await loadFirstAvailableLogo([
    "/logo-sena.png",
    "/logo.png",
    "/sena.png",
    "/sena.jpg",
    "/sena.svg",
  ]);
  let logoDrawnHeight = 0;
  if (logoDataUrl) {
    try {
      // Detectar tipo desde el dataURL
      const mimeAnyMatch = logoDataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,/i);
      const mime = mimeAnyMatch?.[1] || "image/png";
      let fmt: "PNG" | "JPEG" | "WEBP" = "PNG";
      if (mime.includes("jpeg") || mime.includes("jpg")) fmt = "JPEG";
      if (mime.includes("webp")) fmt = "WEBP" as any;
      // Logo centrado en el encabezado (más pequeño 28x28) y en marco cuadrado
      const logoW = 28, logoH = 28;
      const logoX = (pageWidth - logoW) / 2;
      const logoY = margin;
      // Fondo cuadrado blanco para evitar apariencia circular por transparencia
      doc.setFillColor(255, 255, 255);
      doc.rect(logoX, logoY, logoW, logoH, 'F');
      // Borde fino alrededor del logo para definir el cuadrado
      doc.setDrawColor(200);
      doc.rect(logoX, logoY, logoW, logoH);
      doc.addImage(logoDataUrl, fmt, logoX, logoY, logoW, logoH);
      logoDrawnHeight = logoH;
    } catch (e) {
      // Si falla la decodificación (p.ej., firma PNG incorrecta), continuar sin logo
      if (import.meta.env.DEV) {
        console.debug("Logo omitido en PDF (no válido):", e);
      }
    }
  }

  // Header
  // Subtítulo debajo del logo
  const subtitle = "Sistema de votación SIGEVA";
  let subtitleY = margin + (logoDrawnHeight > 0 ? logoDrawnHeight + 6 : 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(subtitle, pageWidth / 2, subtitleY, { align: "center" });

  // Título: "REPORTE DE LA ELECCIÓN [nombre]" debajo del subtítulo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titulo = `REPORTE DE LA ELECCIÓN ${eleccion.nombre}`;
  let titleY = subtitleY + 16; // +6 de espacio extra entre subtítulo y título
  // Ajuste: dividir título si es muy largo y centrar cada línea
  const maxTitleWidth = pageWidth - margin * 2; // ancho disponible
  const titleLines = doc.splitTextToSize(titulo, maxTitleWidth);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, titleY, { align: "center" });
    titleY += 8; // separación entre líneas del título
  });
  // Iniciar texto de cabecera más abajo para no chocar con el título
  currentY = titleY + 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const lineGap = 8; // Más espacio entre líneas de cabecera
  ensureSpace(lineGap * 6 + 4);
  doc.text(`Nombre: ${eleccion.nombre}`, margin, currentY); currentY += lineGap;
  doc.text(`Centro: ${eleccion.centro}`, margin, currentY); currentY += lineGap;
  doc.text(`Jornada: ${eleccion.jornada}`, margin, currentY); currentY += lineGap;
  doc.text(`Estado: ${eleccion.estado}`, margin, currentY); currentY += lineGap;
  doc.text(`Fecha: ${eleccion.fechaInicio} a ${eleccion.fechaFin}`, margin, currentY); currentY += lineGap;
  doc.text(`Total Votos: ${eleccion.totalVotos}`, margin, currentY); currentY += lineGap;
  if (typeof eleccion.totalParticipantes === 'number') {
    doc.text(`Total Participantes: ${eleccion.totalParticipantes}`, margin, currentY);
    currentY += lineGap;
  }

  // Ganador
  const ganador = eleccion.candidatos && eleccion.candidatos.length > 0
    ? [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[0]
    : null;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 128, 0);
  ensureSpace(12);
  doc.text("GANADOR", margin, currentY);
  currentY += 8;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  if (ganador) {
    doc.text(`${ganador.nombre} ${ganador.apellido} - ${ganador.votos} votos (${ganador.porcentaje.toFixed(2)}%)`, margin, currentY);
  } else {
    doc.text("No hay candidatos registrados.", margin, currentY);
  }
  currentY += 10;

  // Resultados por candidato (tabla)
  if (eleccion.candidatos?.length) {
    ensureSpace(20);
    autoTable(doc, {
      startY: currentY,
      head: [["Candidato", "Tarjetón", "Votos", "Porcentaje", "Estado"]],
      body: eleccion.candidatos.map(c => [
        `${c.nombre} ${c.apellido}`,
        c.numeroTarjeton || "-",
        c.votos,
        `${c.porcentaje.toFixed(2)}%`,
        c.id === ganador?.id ? "Ganador" : "Candidato",
      ]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { overflow: 'linebreak' },
      margin: { left: margin, right: margin },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Propuestas por candidato (tabla)
  if (eleccion.candidatos?.some(c => c.propuesta && c.propuesta.trim().length > 0)) {
    ensureSpace(20);
    autoTable(doc, {
      startY: currentY,
      head: [["Candidato", "Propuesta"]],
      body: eleccion.candidatos.map(c => [
        `${c.nombre} ${c.apellido}`,
        c.propuesta ? c.propuesta : "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      styles: { cellWidth: 'wrap', overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      margin: { left: margin, right: margin },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Participantes (tabla)
  if (eleccion.participantes?.length) {
    ensureSpace(20);
    autoTable(doc, {
      startY: currentY,
      head: [["Nombre", "Documento", "Fecha de Voto"]],
      body: eleccion.participantes.map(p => [
        `${p.nombre} ${p.apellido}`,
        p.documento,
        new Date(p.fechaVoto).toLocaleDateString("es-ES"),
      ]),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { overflow: 'linebreak' },
      margin: { left: margin, right: margin },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Estadísticas + gráfica
  if (eleccion.candidatos?.length) {
    const totalVotos = eleccion.candidatos.reduce((sum, c) => sum + c.votos, 0);
    const promedio = totalVotos / eleccion.candidatos.length;
    const max = Math.max(...eleccion.candidatos.map(c => c.votos));
    const min = Math.min(...eleccion.candidatos.map(c => c.votos));
    const segundoLugar = [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[1]?.votos || 0;

    ensureSpace(20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("ESTADÍSTICAS", margin, currentY);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    currentY += 8;
    doc.text(`• Total votos: ${totalVotos}`, margin, currentY); currentY += 6;
    doc.text(`• Promedio por candidato: ${promedio.toFixed(1)}`, margin, currentY); currentY += 6;
    doc.text(`• Máximo de votos: ${max}`, margin, currentY); currentY += 6;
    doc.text(`• Mínimo de votos: ${min}`, margin, currentY); currentY += 6;
    doc.text(`• Diferencia 1° y 2° lugar: ${max - segundoLugar}`, margin, currentY); currentY += 8;

    // Título de la gráfica
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const chartTitle = "CANTIDAD DE VOTOS POR CANDIDATO";
    ensureSpace(8);
    doc.text(chartTitle, pageWidth / 2, currentY, { align: "center" });
    currentY += 6;

    // Gráfica de barras dibujada directamente en el PDF
    const chartHeight = 90;
    const chartWidth = pageWidth - margin * 2;
    ensureSpace(chartHeight + 10);
    drawBarChart(doc, margin, currentY, chartWidth, chartHeight,
      eleccion.candidatos.map(c => ({ label: `${c.nombre} ${c.apellido}`.slice(0, 18), value: c.votos }))
    );
    currentY += chartHeight + 6;
  }

  const nombreArchivo = `Reporte_Eleccion_${eleccion.nombre.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(nombreArchivo);
}
