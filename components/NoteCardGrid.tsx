import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import NoteCard from "./NoteCard";
import { Note, NoteActionHandlers } from "@/types/note";

interface NoteCardGridProps {
  notes: Note[] | null;
  noteType: "all" | "archived" | "deleted";
  actionHandlers: NoteActionHandlers;
  isLoading: boolean;
}

const NoteCardGrid: React.FC<NoteCardGridProps> = ({
  notes,
  noteType,
  actionHandlers,
  isLoading,
}) => {
  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (notes === null) {
    return <p>Error loading notes. Please try again.</p>;
  }

  if (notes.length === 0) {
    return (
      <p className="text-gray-500">
        {noteType === "deleted"
          ? "No notes found. Deleted notes will appear here."
          : noteType === "archived"
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
              <NoteCard key={note.id} {...note} {...actionHandlers} />
            </Link>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default NoteCardGrid;
