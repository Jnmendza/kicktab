import { redirect } from "next/navigation";

import { createClientForServer } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <p>Hello {data.user.email}</p>;
}
