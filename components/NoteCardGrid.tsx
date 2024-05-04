import Link from "next/link";
import React from "react";
import NoteCard from "./NoteCard";

interface NoteCardGridProps {
  notes: {
    id: string;
    title: string;
    description: string;
    inserted_at: string;
    updated_at: string;
    is_deleted: boolean;
    is_archived: boolean;
  }[];
}

const NoteCardGrid = ({ notes }: NoteCardGridProps) => {
  return notes.map((note) => (
    <Link href={`/note/${note.id}`} key={note.id}>
      <NoteCard
        id={note.id}
        title={note.title}
        description={note.description}
        createdAt={note.inserted_at}
        updatedAt={note.updated_at}
        isDeleted={note.is_deleted}
        isArchived={note.is_archived}
      />
    </Link>
  ));
};

export default NoteCardGrid;
