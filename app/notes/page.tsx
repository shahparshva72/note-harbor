import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NotesPageComponent from "@/components/NotesPageComponent";

export default async function NotesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <NotesPageComponent noteType="all" />;
}