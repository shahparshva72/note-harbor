"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Spinner from "./ui/spinner";

interface NoteData {
  title: string;
  description: string;
}

const initialState: NoteData = {
  title: "",
  description: "",
};

const EditNoteView: React.FC<{ id: number }> = ({ id }) => {
  const [noteData, setNoteData] = useState<NoteData>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchNote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      setNoteData({ title: data.title, description: data.description });
    } catch (error: any) {
      console.error("Error: ", error.message);
      setError(error.message);
      toast.error(`Failed to fetch note: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, supabase, router]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNoteData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const editNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("notes")
        .update(noteData)
        .eq("id", id);
      if (error) throw error;
      toast.success(`${noteData.title} has been updated!`);
      router.back();
    } catch (error: any) {
      console.error("Error editing the note:", error.message);
      toast.error(`Failed to update note: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error}
        <Button onClick={fetchNote} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-4 p-4"
      onSubmit={editNote}
    >
      <Input
        id="title"
        name="title"
        placeholder="Enter a title"
        value={noteData.title}
        onChange={handleInputChange}
        className="text-xl font-semibold"
        required
      />
      <Textarea
        id="description"
        name="description"
        className="min-h-[200px] font-mono text-base"
        placeholder="- Item 1&#10;- Item 2&#10;- Item 3"
        value={noteData.description}
        onChange={handleInputChange}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={handleClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default EditNoteView;
