export interface Funcionario {
  id: number;
  email: string;
  estado: string;
  perfil: "Funcionario";
  centroFormacion: number;
}

export interface Administrador {
  id: number;
  email: string;
  estado: string;
  perfil: "Administrador";
  centroFormacion: number;
}

export interface Aprendiz {
  id: number;
  nombre: string;
  apellidos: string;
  estado: string;
  perfil: "Aprendiz";
  jornada: string;
  centroFormacionIdcentroFormacion: number;
}

export type User = Funcionario | Aprendiz | Administrador;

export interface ResponseType<T> {
  success: boolean;
  message: string;
  data?: T;
}
