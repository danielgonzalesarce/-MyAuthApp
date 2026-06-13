import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function ensureDataDir() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser(name: string, email: string, password: string) {
  const users = getUsers();

  if (users.find((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("El correo ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  };

  users.push(user);
  saveUsers(users);

  return user;
}

export async function validateUser(email: string, password: string) {
  const user = getUsers().find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
