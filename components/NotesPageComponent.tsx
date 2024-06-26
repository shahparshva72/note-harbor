"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ListOrderedIcon, CalendarIcon } from "lucide-react";
import React from "react";
import NoteCardGrid from "./NoteCardGrid";
import { Button } from "./ui/button";

const NotesPageComponent = (props: {
  notes: any;
  noteType: "all" | "archived" | "deleted";
}) => {
  const [sortedNotes, setSortedNotes] = React.useState(props.notes);

  const sortByCreatedDate = () => {
    const sorted = [...sortedNotes].sort((a: any, b: any) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
    setSortedNotes(sorted);
  };

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        {props.noteType === "all" ? (
          <h1 className="text-2xl font-bold">All Notes</h1>
        ) : null}
        {props.noteType === "archived" ? (
          <h1 className="text-2xl font-bold">Archived Notes</h1>
        ) : null}
        {props.noteType === "deleted" ? (
          <h1 className="text-2xl font-bold">Deleted Notes</h1>
        ) : null}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <ListOrderedIcon className="h-5 w-5" />
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={sortByCreatedDate}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Date created
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {sortedNotes && sortedNotes.length === 0 ? (
        <div className=" text-gray-500">
          {props.noteType === "deleted" ? (
            <span>No notes found. Deleted notes will appear here.</span>
          ) : props.noteType === "archived" ? (
            <span>No notes found. Archived notes will appear here.</span>
          ) : (
            <span>No notes found. Click on + to create a note.</span>
          )}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedNotes ? (
          <NoteCardGrid notes={sortedNotes} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default NotesPageComponent;
