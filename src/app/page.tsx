import { createClientForServer } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClientForServer();
  const session = await supabase.auth.getUser();

  return (
    <div>
      <h1>Welcome to KickTab</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
