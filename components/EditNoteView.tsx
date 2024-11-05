"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
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
import {
  BtnBold,
  BtnItalic,
  ContentEditableEvent,
  Editor,
  EditorProvider,
  Toolbar,
  BtnUndo,
  BtnRedo,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList
} from "react-simple-wysiwyg";

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
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | ContentEditableEvent
    ) => {
      const { name, value } = e.target as
        | HTMLInputElement
        | HTMLTextAreaElement;
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
        <SheetContent>
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
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Edit Note</SheetTitle>
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
              Content
            </label>
            <EditorProvider>
              <Editor
                id="description"
                name="description"
                value={noteData.description}
                onChange={
                  handleInputChange as (event: ContentEditableEvent) => void
                }
                containerProps={{
                  style: {
                    height: "16rem",
                    width: "100%",
                    resize: "vertical",
                    borderRadius: "0.375rem",
                    border: "1px solid #6B7280",
                    padding: "0.75rem",
                    fontSize: "0.875rem"
                  }
                }}
              >
                <Toolbar>
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnBulletList />
                  <BtnNumberedList />
                  <BtnUndo />
                  <BtnRedo />
                </Toolbar>
              </Editor>
            </EditorProvider>
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

/*
<SheetContent
  side={"right"}
  className="w-full sm:w-[75vw] md:w-[60vw] lg:w-[50vw] max-w-3xl p-6"
>
  */