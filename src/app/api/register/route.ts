import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    await createUser(name, email, password);

    return NextResponse.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
