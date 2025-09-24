import React, { useState, useEffect, useMemo } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { generarReporte } from "../../utils/generarReporte";

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

  // Datos de ejemplo
  const datosEjemplo: Eleccion = {
    id: "1",
    nombre: "Elección Prueba 2",
    fechaInicio: "2025-09-24",
    fechaFin: "2025-09-29",
    estado: "Finalizada",
    centro: "Centro de Gestión Administrativa",
    jornada: "Mañana",
    totalVotos: 150,
    candidatos: [
      { id: 1, nombre: "Ana", apellido: "Gómez", votos: 70, porcentaje: 46.7 },
      { id: 2, nombre: "Luis", apellido: "Martínez", votos: 50, porcentaje: 33.3 },
      { id: 3, nombre: "María", apellido: "Pérez", votos: 30, porcentaje: 20.0 },
    ],
    participantes: [
      { id: 1, nombre: "Pedro", apellido: "López", documento: "123456", fechaVoto: "2025-09-25" },
      { id: 2, nombre: "Carla", apellido: "Ruiz", documento: "654321", fechaVoto: "2025-09-25" },
    ],
  };

  useEffect(() => {
    setEleccion(eleccionProp || datosEjemplo);
  }, [eleccionProp]);

  const ganador = useMemo(() => {
    return eleccion?.candidatos && eleccion.candidatos.length > 0
      ? [...eleccion.candidatos].sort((a, b) => b.votos - a.votos)[0]
      : null;
  }, [eleccion]);

  const generarReportePDF = async () => {
    if (!eleccion) return;
    setCargando(true);

    try {
      await generarReporte(eleccion);

    } catch (error) {
      console.error("Error al generar el reporte PDF:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Generación de Reportes</h2>
      <p className="text-gray-600 mb-4">Genere reportes detallados de las elecciones con estadísticas completas</p>

      {/* Info básica */}
      {eleccion && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Información de la Elección</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Nombre:</span> {eleccion.nombre}</div>
            <div><span className="font-medium">Estado:</span> {eleccion.estado}</div>
            <div><span className="font-medium">Centro:</span> {eleccion.centro}</div>
            <div><span className="font-medium">Jornada:</span> {eleccion.jornada}</div>
            <div><span className="font-medium">Total Votos:</span> {eleccion.totalVotos}</div>
            <div><span className="font-medium">Candidatos:</span> {eleccion.candidatos?.length || 0}</div>
          </div>
        </div>
      )}

      {/* Botón */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generarReportePDF}
          disabled={cargando}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-black font-semibold shadow-md transition-all duration-300 disabled:bg-gray-400 
            ${cargando ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'}`}
        >
          <FaFilePdf size={20} />
          {cargando ? (
            <>
              <span>Generando Reporte...</span>
              <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </>
          ) : (
            "Generar Reporte PDF"
          )}
        </button>
      </div>

      {/* Preview de candidatos */}
      {eleccion?.candidatos && eleccion.candidatos.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Preview de Resultados</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Candidato</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Votos</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Porcentaje</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {eleccion.candidatos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{c.nombre} {c.apellido}</td>
                    <td className="px-4 py-2 text-gray-800">{c.votos}</td>
                    <td className="px-4 py-2 text-gray-800">{c.porcentaje.toFixed(2)}%</td>
                    <td className="px-4 py-2">
                      {ganador?.id === c.id ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Ganador</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Candidato</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ganador */}
      {ganador && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-2">🏆 Ganador de la Elección</h4>
          <p className="text-green-700">
            <span className="font-medium">{ganador.nombre} {ganador.apellido}</span> con {ganador.votos} votos ({ganador.porcentaje.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneracionReporte;
