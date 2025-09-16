export interface Gestor {
  id: number;
  email: string;
  estado: string;
  perfil: "Funcionario" | "Administrador";
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

export type User = Gestor | Aprendiz;

export interface ResponseType<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface UserNormalizado {
  id: number;
  email?: string;  
  apellidos?: string;  
  estado: string;
  perfil: "Funcionario" | "Administrador" | "Aprendiz";
  jornada?: string;    
  centroFormacion: number; 
}
