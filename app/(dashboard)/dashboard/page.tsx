import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">
        Welcome {session.user?.name || "User"} 🚀
      </h1>
    </div>
  );
}