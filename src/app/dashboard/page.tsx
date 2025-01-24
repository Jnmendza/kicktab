import { redirect } from "next/navigation";
import { createClientForServer } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Dashboard() {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <div>Dashboard</div>
      <p>Hello {data.user.email}</p>

      <LogoutButton />
    </>
  );
}
