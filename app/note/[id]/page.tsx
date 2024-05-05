import EditNoteView from "@/components/EditNoteView";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NoteModal({
  params: { id: noteId },
}: {
  params: { id: string };
}) {

  const idAsNumber = Number(noteId);

  if (isNaN(idAsNumber)) {
    return <div>Invalid note id</div>;
  }

  // check if the note exists in the database or display a 404 page
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", idAsNumber)
    .eq("user_id", user.id)
    .single();

  if (error || !note) {
    return <div>404 - Note not found</div>;
  }

  return <EditNoteView id={idAsNumber} />;
}
