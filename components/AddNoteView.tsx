"use client";

import React, { useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
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
      <SheetContent side={'right'}>
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
