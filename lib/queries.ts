import { createClient } from "@/utils/supabase/client";
import { Note, NoteAction } from "@/types/note";

const supabase = createClient();

export const getNotes = async (noteType: "all" | "archived" | "deleted") => {
  let query = supabase.from("notes").select("*");

  if (noteType === "deleted") {
    query = query.eq("is_deleted", true);
  } else if (noteType === "archived") {
    query = query.eq("is_archived", true).eq("is_deleted", false);
  } else {
    query = query.eq("is_archived", false).eq("is_deleted", false);
  }

  const { data, error } = await query.order("inserted_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const updateNote = async (id: string, action: NoteAction) => {
  let updatedNote;
  switch (action) {
    case "delete":
      updatedNote = { is_deleted: true, is_archived: false };
      break;
    case "archive":
      updatedNote = { is_archived: true };
      break;
    case "restore":
      updatedNote = { is_deleted: false, is_archived: false };
      break;
  }

  const { error } = await supabase
    .from("notes")
    .update(updatedNote)
    .match({ id });

  if (error) throw error;
  return true;
};

export const deleteNotePermanently = async (id: string) => {
  const { error } = await supabase.from("notes").delete().match({ id });
  if (error) throw error;
  return true;
};

export const addNote = async (noteData: { title: string; description: string; user_id: string }) => {
  const { data, error } = await supabase.from("notes").insert([noteData]);
  if (error) throw error;
  return data;
};
