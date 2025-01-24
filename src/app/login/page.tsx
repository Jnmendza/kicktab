import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import AuthPageLayout from "@/components/AuthPageLayout";

export default async function LoginPage() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return <AuthPageLayout form={<LoginForm />} />;
}
