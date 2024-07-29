import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NotesPageComponent from "@/components/NotesPageComponent";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .neq("is_deleted", true)
    .eq("is_archived", true)
    .order("inserted_at", { ascending: false });

    return (
      <NotesPageComponent initialNotes={notes} noteType="archived" />
    );
}
