import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import AuthPageLayout from "@/components/AuthPageLayout";

export default async function RegisterPage() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return <AuthPageLayout form={<RegisterForm />} />;
}
