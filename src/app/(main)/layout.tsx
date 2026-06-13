import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppShell from "@/components/AppShell";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getServerSession(authOptions);

  return <AppShell>{children}</AppShell>;
}
