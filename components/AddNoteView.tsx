"use client";

import React, { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const supabase = createClient();

interface NoteData {
  title: string;
  description: string;
}

const initialState: NoteData = {
  title: "",
  description: "",
};

const AddNoteView: React.FC = () => {
  const router = useRouter();
  const [noteData, setNoteData] = useState<NoteData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNoteData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const addANote = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { error } = await supabase.from("notes").insert([
          {
            ...noteData,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast.success("Note has been added!");
        router.refresh();
        router.back();
      } catch (error: any) {
        console.error("Error adding a note:", error.message);
        toast.error("Failed to add note. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [noteData, router],
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-4 p-4"
      onSubmit={addANote}
    >
      <h2 className="text-2xl font-bold">Add a Note</h2>
      <Input
        id="title"
        placeholder="Enter a title"
        name="title"
        value={noteData.title}
        onChange={handleInputChange}
        required
      />
      <Textarea
        placeholder="Write your note here..."
        name="description"
        value={noteData.description}
        onChange={handleInputChange}
        required
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" onClick={handleClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AddNoteView;
