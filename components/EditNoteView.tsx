"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Spinner from "./ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { useSidePeek } from "./side-peek-context";
import { X } from "lucide-react";

interface NoteData {
  title: string;
  description: string;
}

const initialState: NoteData = {
  title: "",
  description: ""
};

const EditNoteView: React.FC<{ id: number; onClose: () => void }> = ({
  id,
  onClose
}) => {
  const [noteData, setNoteData] = useState<NoteData>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { isEditNoteOpen, setIsEditNoteOpen } = useSidePeek();

  const fetchNote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { user }
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
    setIsEditNoteOpen(true);
  }, [fetchNote, setIsEditNoteOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNoteData((prev) => ({ ...prev, [name]: value }));
    },
    []
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
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("Error editing the note:", error.message);
      toast.error(`Failed to update note: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsEditNoteOpen(false);
    onClose();
  };

  if (isLoading) {
    return (
      <Sheet open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
        <SheetContent
          side={"right"}
          className="w-[95vw] max-w-3xl p-6 sm:w-[600px] md:w-[50vw] lg:w-[800px]"
        >
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (error) {
    return (
      <Sheet open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
        <SheetContent
          side={"right"}
          className="w-[95vw] max-w-3xl p-6 sm:w-[600px] md:w-[50vw] lg:w-[800px]"
        >
          <div className="text-center text-red-500">
            Error: {error}
            <Button onClick={fetchNote} className="mt-4">
              Retry
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
      <SheetContent
        side={"right"}
        className="w-[95vw] max-w-3xl p-6 sm:w-[600px] md:w-[50vw] lg:w-[800px]"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Edit Note</SheetTitle>
            <Button onClick={handleClose} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="text-lg">
            Modify your note's title and content
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={editNote} className="flex flex-col space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a title"
              value={noteData.title}
              onChange={handleInputChange}
              className="text-lg font-semibold"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              className="min-h-[200px] font-mono text-lg"
              placeholder="- Item 1&#10;- Item 2&#10;- Item 3"
              value={noteData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
        <SheetFooter className="mt-8">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => editNote(e as any)}
            className="px-6 py-2"
          >
            {isSubmitting ? <Spinner /> : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditNoteView;
