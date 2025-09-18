import React from "react";
import Sigeva from "../assets/sena-sigeva.svg";
import { GrGithub } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

type Miembro = {
  nombre: string;
  rol: string;
  github?: string;
  avatar: string;
  grupo: "Manejo" | "Desarrolladores";
};

const equipo: Miembro[] = [
  {
    nombre: "Henry Bastidas",
    rol: "Product Owner",
    github: "",
    avatar: "/avatars/henry.png",
    grupo: "Manejo",
  },
  {
    nombre: "Alexandra Guevara Muñoz",
    rol: "Supervisora",
    github: "",
    avatar: "/avatars/alexandra.png",
    grupo: "Manejo",
  },
  {
    nombre: "Fernanda Gonzalez",
    rol: "Back End Developer",
    github: "feeer-28",
    avatar: "/avatars/na.png",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Alex Jhoan Chaguendo",
    rol: "Full Stack Developer",
    github: "ALexjh117",
    avatar: "/avatars/alex.jpg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Dovin Richard Hoyos",
    rol: "Full Stack Developer",
    github: "dovinhoyos",
    avatar: "/avatars/dovin.jpeg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Bryan Andrés Hurtado",
    rol: "Front End & Mobile Developer",
    github: "Bryanhurtado0006",
    avatar: "/avatars/bryan.jpg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Mariana Cifuentes Zuñiga",
    rol: "Diseñadora UI / UX",
    github: "macarorn",
    avatar: "/avatars/mariana.png",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Víctor Manuel Mosquera",
    rol: "Mobile Developer",
    github: "victormosqueraconejo",
    avatar: "/avatars/victor.jpg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Andrés Santiago Arias",
    rol: "Full Stack Developer",
    github: "AndresArias28",
    avatar: "/avatars/na.png",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Jeison Reyes Ruiz ",
    rol: "Back End Developer",
    github: "JEISON101",
    avatar: "/avatars/jeison.jpg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Camilo Hurtado",
    rol: "Full Stack Developer",
    github: "oKCam04",
    avatar: "/avatars/camilo.png",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Daniela Paredes",
    rol: "Back End Developer",
    github: "renteria08P",
    avatar: "/avatars/dani.jpeg",
    grupo: "Desarrolladores",
  },
  {
    nombre: "David Santiago Rengifo",
    rol: "Front End & Mobile Developer",
    github: "DavidRengifo12",
    avatar: "/avatars/na.png",
    grupo: "Desarrolladores",
  },
  {
    nombre: "Jorge Enrique Porras",
    rol: "Scrum Master",
    github: "IngAlim2023",
    avatar: "/avatars/jorge.png",
    grupo: "Desarrolladores",
  },
];

const Equipo: React.FC = () => {
  const grupos = ["Manejo", "Desarrolladores"] as const;
  const navigate = useNavigate();

  return (
    <main style={{ padding: "2rem" }}>
      <div className="mb-3">
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </Button>
      </div>
      <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2 mb-3">
        <img src={Sigeva} alt="Logo SIGEVA" height={40} />
      </div>
      
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Nuestro equipo
      </h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>
        Conoce a los desarrolladores del SENA que están detrás de SIGEVA
      </p>

      {grupos.map((grupo) => (
        <section key={grupo} style={{ marginBottom: "2.5rem" }}>
          <h3
            style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#444" }}
          >
            {grupo === "Manejo"
              ? "Manejo del proyecto"
              : "Desarrolladores"}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {equipo
              .filter((m) => m.grupo === grupo)
              .map((m) => (
                <div
                  key={m.nombre}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    minWidth: 250,
                    flex: "1 1 300px",
                  }}
                >
                  <img
                    src={m.avatar}
                    alt={m.nombre}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <strong>{m.nombre}</strong>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#555" }}>
                      {m.rol}
                    </p>
                    {m.github && (
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>
                        <a
                          href={`https://github.com/${m.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "#000" }}
                        >
                            
                          <i className="bi bi-github" /> <GrGithub/>{" "}{m.github}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          
        </section>
        
      ))}
    </main>
    
  );
};

export default Equipo;
