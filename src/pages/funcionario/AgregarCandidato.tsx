import { useState, ChangeEvent, FormEvent } from "react";
import type { DragEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";

type FormData = {
    nombre: string;
    programa: string;
    descripcion: string;
    foto: File | null;
};

const PROGRAMAS = [
    "Desarrollo de Software",
    "Redes y Telecomunicaciones",
    "Análisis y Desarrollo de Sistemas de Información",
];


const AgregarCandidato = () => {
    const [data, setData] = useState<FormData>({
        nombre: "",
        programa: "",
        descripcion: "",
        foto: null,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleFile = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Solo se permiten imágenes");
            return;
        }
        setData((prev) => ({ ...prev, foto: file }));
        setPreview(URL.createObjectURL(file));
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.foto || !data.nombre.trim() || !data.programa || !data.descripcion.trim()) {

            alert("Todos los campos son obligatorios");
            return;
        }
        try {
            setSaving(true);
            const body = new FormData();
            body.append("nombre", data.nombre.trim());
            body.append("programa", data.programa);
            body.append("descripcion", data.descripcion.trim());
            body.append("foto", data.foto);
            // await fetch("/api/candidatos", {...t

        } catch (err) {
            console.log(err);
            alert("Error al guardar");
            setSaving(false);
        }
        alert("Candidato guardado");
        setSaving(false);

    }

    return (
        <div className="container my-4">
            <h2 className="fw-bold">Agrega candidatos</h2>
            <p className="text-muted mb-4">Llene el formulario para agregar a un nuevo candidato</p>

            <form onSubmit={onSubmit}>
                <div className="card border-0 shadow-sm">
                    <div className="card-body">

                        {/* FOTO */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Foto <span className="text-danger">*</span>
                            </label>

                            <div
                                className={`rounded-3 p-4 d-flex align-items-center justify-content-center upload-area ${dragOver ? "upload-area--over" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={onDrop}
                                role="button"
                                onClick={() => document.getElementById("file-input")?.click()}
                                aria-label="Zona de arrastre o selección de archivo"
                            >
                                {!preview ? (
                                    <div className="text-center">
                                        <FiUploadCloud size={36} className="mb-2" />
                                        <div className="small text-muted">
                                            Arrastre y suelte el archivo aquí o <span className="fw-semibold">Seleccione un archivo</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="rounded-circle"
                                            style={{ width: 64, height: 64, objectFit: "cover" }}
                                        />
                                        <div className="small text-muted">Haz clic para cambiar la imagen</div>
                                    </div>
                                )}
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={onFileChange}
                                />
                            </div>
                        </div>

                        {/* NOMBRE */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Nombre Completo <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej. Sofía Ramírez"
                                value={data.nombre}
                                onChange={(e) => setData({ ...data, nombre: e.target.value })}
                            />
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Descripción <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                rows={3}
                                placeholder="Ej. Estudiante destacada con habilidades en programación y liderazgo."
                                value={data.descripcion}
                                onChange={(e) => setData({ ...data, descripcion: e.target.value })}
                            />
                        </div>

                        {/* PROGRAMA */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Programa de formación <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select"
                                value={data.programa}
                                onChange={(e) => setData({ ...data, programa: e.target.value })}
                            >
                                <option value="">Selecciona un programa</option>
                                {PROGRAMAS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* FOOTER CON BOTÓN */}
                    <div className="card-footer bg-white border-0 d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </form>

            {/* Estilos finos para replicar el look */}
            <style>{`
        .upload-area {
          border: 2px dashed #d6d6d6;
          min-height: 120px;
          background: #fafafa;
          transition: all .15s ease-in-out;
          cursor: pointer;
        }
        .upload-area--over {
          background: #f0f7ff;
          border-color: #b6d4fe;
        }
        .card { border-radius: 14px; }
        .card-body { padding: 2rem; }
        .card-footer { padding: 1rem 2rem 1.5rem; }
        @media (max-width: 576px) {
          .card-body { padding: 1.25rem; }
          .card-footer { padding: 1rem 1.25rem 1.25rem; }
        }
      `}</style>
        </div>
    );
};

export default AgregarCandidato;
