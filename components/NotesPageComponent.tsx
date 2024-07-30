"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { ListOrderedIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Note, NoteAction, NoteActionHandlers } from "@/types/note";

const supabase = createClient();

const DynamicNoteCardGrid = dynamic(() => import("./NoteCardGrid"), {
  ssr: false,
});

const NotesPageComponent = (props: {
  initialNotes: Note[] | null;
  noteType: "all" | "archived" | "deleted";
}) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setNotes(props.initialNotes);
    setIsLoading(false);
  }, [props.initialNotes]);

  const sortByCreatedDate = () => {
    if (notes) {
      const sorted = [...notes].sort((a, b) => {
        return (
          new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime()
        );
      });
      setNotes(sorted);
    }
  };

  const sortByUpdatedDate = () => {
    if (notes) {
      const sorted = [...notes].sort((a, b) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
      setNotes(sorted);
    }
  };

  const handleNoteAction = async (id: string, action: NoteAction) => {
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

    setNotes((prevNotes) =>
      prevNotes ? prevNotes.filter((note) => note.id !== id) : null,
    );

    // Update the note in the database
    const { error } = await supabase
      .from("notes")
      .update(updatedNote)
      .match({ id });

    if (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again.");
      router.refresh();
    } else {
      toast.success(`Note ${action}d successfully.`);
    }
  };

  const actionHandlers: NoteActionHandlers = {
    onDelete: (id) => handleNoteAction(id, "delete"),
    onArchive: (id) => handleNoteAction(id, "archive"),
    onRestore: (id) => handleNoteAction(id, "restore"),
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

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="relative z-10 mb-6 flex items-center justify-between">
        {renderNoteTypeHeader()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <ListOrderedIcon className="h-5 w-5" />
              <span className="sr-only">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="z-50 min-w-[200px] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1"
            align="end"
          >
            <DropdownMenuItem
              onClick={sortByCreatedDate}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Created Date</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={sortByUpdatedDate}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <ClockIcon className="mr-2 h-4 w-4" />
              <span>Updated Date</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative z-0">
        {/* Pass props correctly to DynamicNoteCardGrid */}
        <DynamicNoteCardGrid
          notes={notes}
          noteType={props.noteType}
          actionHandlers={actionHandlers}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NotesPageComponent;
