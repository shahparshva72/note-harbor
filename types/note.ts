// types/note.ts

export interface Note {
  id: string;
  title: string;
  description: string;
  inserted_at: string;
  updated_at: string;
  is_deleted: boolean;
  is_archived: boolean;
  user_id: string;
}

export type NoteAction = "delete" | "archive" | "restore";

export interface NoteActionHandlers {
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export type noteType = "all" | "archived" | "deleted";
