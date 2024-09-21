"use client";

import React, { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { useSidePeek } from "./side-peek-context";

const supabase = createClient();

interface NoteData {
  title: string;
  description: string;
}

const initialState: NoteData = {
  title: "",
  description: ""
};

const AddNoteView: React.FC = () => {
  const { isAddNoteOpen, setIsAddNoteOpen } = useSidePeek();
  const router = useRouter();
  const [noteData, setNoteData] = useState<NoteData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNoteData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const addANote = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        const { error } = await supabase.from("notes").insert([
          {
            ...noteData,
            user_id: user.id
          }
        ]);
        if (error) throw error;
        toast.success("Note has been added!");
        router.refresh();
        setIsAddNoteOpen(false);
      } catch (error: any) {
        console.error("Error adding a note:", error.message);
        toast.error("Failed to add note. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [noteData, router, setIsAddNoteOpen]
  );

  return (
    <Sheet open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
      <SheetContent
        side={"right"}
        className="w-[95vw] max-w-3xl p-6 sm:w-[600px] md:w-[50vw] lg:w-[800px]"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Add a Note</SheetTitle>
          <SheetDescription className="text-lg">
            Add a note with a title and content
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={addANote} className="flex flex-col space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter a title"
              name="title"
              value={noteData.title}
              onChange={handleInputChange}
              required
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Write your note here..."
              name="description"
              value={noteData.description}
              onChange={handleInputChange}
              required
              className="min-h-[200px] text-lg"
            />
          </div>
        </form>
        <SheetFooter className="mt-8">
          <Button
            type="button"
            onClick={() => setIsAddNoteOpen(false)}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => addANote(e as any)}
            className="px-6 py-2"
          >
            {isSubmitting ? "Adding..." : "Add Note"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddNoteView;
