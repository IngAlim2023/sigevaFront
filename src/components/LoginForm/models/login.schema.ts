import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string("El correo es obligatorio")
    .email("Correo inválido")
    .min(1, "El correo es obligatorio"),
  password: z
    .string("La contraseña es obligatoria")
    .min(3, "La contraseña debe de tener al menos 3 caracteres"),
});

export type FormValues = z.infer<typeof loginSchema>;
