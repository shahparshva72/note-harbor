"use client";
import { Button } from "./ui/button";
import { useSidePeek } from "@/components/side-peek-context";
import { PlusIcon } from "lucide-react";

function AddNoteButton() {
  const { setIsAddNoteOpen } = useSidePeek();

  return (
    <Button
      className="mt-4 w-full py-1.5 font-semibold text-white"
      onClick={() => setIsAddNoteOpen(true)}
    >
      <span className="flex items-center gap-2">
        <PlusIcon className="h-4 w-4" />
        New Note
      </span>
    </Button>
  );
}

export default AddNoteButton;
