export interface User {
  id: number;
  email: string;
  estado: string;
  perfil: string;
}

export interface ResponseType {
  success: boolean;
  data?: User;
}
