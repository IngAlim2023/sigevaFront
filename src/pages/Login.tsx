import Container from "react-bootstrap/Container";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Logo from "../assets/Sigeva white.svg";
import { useAuth } from "../context/auth/auth.context";
import type { ResponseType, User } from "../context/auth/types/authTypes";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type FormValues,
} from "../components/LoginForm/models/login.schema";

interface Props {
  perfil: "gestor" | "aprendiz";
}

export default function Login({ perfil }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const endpoint =
        perfil === "aprendiz" ? "/api/aprendiz/login" : "/api/usuarios/login";
      const res = await api.post<ResponseType<User>>(endpoint, data);

      login(res.data);

      if (res.data.success && res.data.data) {
        switch (res.data.data.perfil) {
          case "Aprendiz":
            navigate("/votaciones");
            break;
          case "Funcionario":
            navigate("/dashboard");
            break;
          case "Administrador":
            navigate("/dashboard-admin");
            break;
        }
      }
    } catch (error) {
      toast.error("Credenciales inválidas. Verifica tu correo y contraseña.")
    }
  };
  
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-primary "
      style={{
        background:
          "linear-gradient(95deg, #6136BF 2.31%, #542EA6 20.84%, #4B68BF 48.18%, #049DBF 72.74%, #04BFBF 98.69%)",
      }}
    >
      <Container style={{ maxWidth: "600px", maxHeight: "480px" }}>
        <div className="text-center mb-4">
          <img src={`${Logo}`} alt="Logo" height="50px" />
        </div>

        <p className="text-center text-white">
          Sistema de Gestión de Votos para Aprendices
        </p>
        <Container
          style={{
            maxWidth: "450px",
            minHeight: "40px",
            borderRadius: "1.5rem",
          }}
          className="bg-white p-5 shadow"
        >
          {/* Cambio de login */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="rounded-pill d-flex"
              style={{
                backgroundColor: "#fff",
                border: "2px solid #5031C9",
                padding: "3px",
                gap: "2px",
              }}
            >
              <Link
                to="/login-aprendiz"
                className={`text-decoration-none text-center px-4 py-2 rounded-pill ${
                  perfil === "aprendiz"
                    ? "text-white fw-bold"
                    : "text-dark fw-semibold"
                }`}
                style={{
                  backgroundColor: perfil === "aprendiz" ? "#5031C9" : "#fff",
                  transition: "background 0.3s",
                  fontSize: "0.9rem",
                  minWidth: "130px",
                }}
              >
                Aprendiz
              </Link>
              <Link
                to="/login"
                className={`text-decoration-none text-center px-4 py-2 rounded-pill ${
                  perfil === "gestor"
                    ? "text-white fw-bold"
                    : "text-dark fw-semibold"
                }`}
                style={{
                  backgroundColor: perfil === "gestor" ? "#5031C9" : "#fff",
                  transition: "background 0.3s",
                  fontSize: "0.9rem",
                  minWidth: "130px",
                }}
              >
                Funcionario
              </Link>
            </div>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Correo electrónico</strong>{" "}
              </Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    id="email"
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    {...field}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                )}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <strong>Contraseña</strong>{" "}
              </Form.Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    {...field}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                )}
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </Form.Group>

            <Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 rounded"
                style={{ backgroundColor: "#5031C9", border: "none" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </Container>
    </div>
  );
}
