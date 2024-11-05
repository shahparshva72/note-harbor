"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { ListOrderedIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, updateNote, deleteNotePermanently } from "@/lib/queries";
import EditNoteView from "./EditNoteView";
import { Note } from "@/types/note";

const DynamicNoteCardGrid = dynamic(() => import("./NoteCardGrid"), {
  ssr: false
});

const NotesPageComponent = ({ noteType }: { noteType: "all" | "archived" | "deleted" }) => {
  const queryClient = useQueryClient();
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const { data: notes, isLoading } = useQuery<Note[], Error>({
    queryKey: ['notes', noteType],
    queryFn: () => getNotes(noteType)
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, action }: { id: string, action: 'delete' | 'archive' | 'restore' }) => 
      updateNote(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully');
    },
    onError: () => {
      toast.error('Failed to update note');
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNotePermanently,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note permanently deleted');
    },
    onError: () => {
      toast.error('Failed to delete note');
    }
  });

  const actionHandlers = {
    onDelete: (id: string) => updateNoteMutation.mutate({ id, action: 'delete' }),
    onArchive: (id: string) => updateNoteMutation.mutate({ id, action: 'archive' }),
    onRestore: (id: string) => updateNoteMutation.mutate({ id, action: 'restore' }),
    onEdit: (id: string) => setEditingNoteId(Number(id)),
    permenantDelete: (id: string) => deleteNoteMutation.mutate(id)
  };

  const sortByCreatedDate = () => {
    if (notes) {
      const sorted = [...notes].sort((a, b) => {
        return (
          new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime()
        );
      });
      queryClient.setQueryData(['notes', noteType], sorted);
    }
  };

  const sortByUpdatedDate = () => {
    if (notes) {
      const sorted = [...notes].sort((a, b) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      });
      queryClient.setQueryData(['notes', noteType], sorted);
    }
  };

  const renderNoteTypeHeader = () => {
    switch (noteType) {
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
        <DynamicNoteCardGrid
          notes={notes || null}
          noteType={noteType}
          actionHandlers={actionHandlers}
          isLoading={isLoading}
        />
      </div>
      {editingNoteId !== null && (
        <EditNoteView
          id={editingNoteId}
          onClose={() => setEditingNoteId(null)}
        />
      )}
    </div>
  );
};
export default NotesPageComponent;
