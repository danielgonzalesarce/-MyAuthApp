import path from "path";

export function getDataDir(): string {
  // En Vercel el filesystem es de solo lectura; /tmp es la única ruta escribible
  if (process.env.VERCEL === "1") {
    return path.join("/tmp", "myauthapp-data");
  }

  return path.join(process.cwd(), "data");
}
