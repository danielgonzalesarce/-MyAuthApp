import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "@/components/SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
