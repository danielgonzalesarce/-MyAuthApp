import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getLockMessage,
  isLocked,
  MAX_ATTEMPTS,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/loginAttempts";
import { validateUser } from "@/lib/users";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son obligatorios");
        }

        const email = credentials.email.trim().toLowerCase();

        if (isLocked(email)) {
          throw new Error(getLockMessage(email));
        }

        const user = await validateUser(email, credentials.password);

        if (!user) {
          const attempt = recordFailedAttempt(email);

          if (attempt.locked) {
            throw new Error(getLockMessage(email));
          }

          throw new Error(
            `Credenciales incorrectas. Intentos restantes: ${attempt.attemptsLeft} de ${MAX_ATTEMPTS}`
          );
        }

        resetAttempts(email);
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
