"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ListOrderedIcon, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import NoteCard from "./NoteCard";
import { Note, NoteAction, NoteActionHandlers } from '@/types/note';

const supabase = createClient();

const NotesPageComponent = (props: {
  initialNotes: Note[] | null;
  noteType: "all" | "archived" | "deleted";
}) => {
  const [notes, setNotes] = useState<Note[] | null>(props.initialNotes);
  const [isLoading, setIsLoading] = useState<boolean>(props.initialNotes === null);
  const router = useRouter();

  useEffect(() => {
    setNotes(props.initialNotes);
    setIsLoading(props.initialNotes === null);
  }, [props.initialNotes]);

  const sortByCreatedDate = () => {
    if (notes) {
      const sorted = [...notes].sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      setNotes(sorted);
    }
  };

  const handleNoteAction = async (id: string, action: NoteAction) => {
    let updatedNote;
    switch (action) {
      case 'delete':
        updatedNote = { is_deleted: true, is_archived: false };
        break;
      case 'archive':
        updatedNote = { is_archived: true };
        break;
      case 'restore':
        updatedNote = { is_deleted: false, is_archived: false };
        break;
    }

    setNotes(prevNotes => prevNotes ? prevNotes.filter(note => note.id !== id) : null);

    // Update the note in the database
    const { error } = await supabase.from("notes").update(updatedNote).match({ id });

    if (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again.");
      router.refresh();
    } else {
      toast.success(`Note ${action}d successfully.`);
    }
  };

  const actionHandlers: NoteActionHandlers = {
    onDelete: (id) => handleNoteAction(id, 'delete'),
    onArchive: (id) => handleNoteAction(id, 'archive'),
    onRestore: (id) => handleNoteAction(id, 'restore'),
  };

  const renderNoteTypeHeader = () => {
    switch (props.noteType) {
      case "all":
        return <h1 className="text-2xl font-bold">All Notes</h1>;
      case "archived":
        return <h1 className="text-2xl font-bold">Archived Notes</h1>;
      case "deleted":
        return <h1 className="text-2xl font-bold">Deleted Notes</h1>;
      default:
        return null;
    }
  };

  const noteCardGrid = () => {
    if (isLoading) {
      return <p>Loading notes...</p>;
    }

    if (!notes || notes.length === 0) {
      return (
        <p className="text-gray-500">
          {props.noteType === "deleted"
            ? "No notes found. Deleted notes will appear here."
            : props.noteType === "archived"
            ? "No notes found. Archived notes will appear here."
            : "No notes found. Click on + to create a note."}
        </p>
      );
    }

    return (
      <AnimatePresence>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/note/${note.id}`}>
                <NoteCard
                  key={note.id}
                  {...note}
                  {...actionHandlers}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        {renderNoteTypeHeader()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <ListOrderedIcon className="h-5 w-5" />
              <span className="sr-only">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={sortByCreatedDate}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {noteCardGrid()}
    </div>
  );
};

export default NotesPageComponent;