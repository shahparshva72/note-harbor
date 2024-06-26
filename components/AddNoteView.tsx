"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialState = {
  title: "",
  description: "",
};

const AddNoteView = () => {
  const router = useRouter();

  const [noteData, setNoteData] = useState(initialState);

  const addANote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return router.push("/login");
      }

      const { title, description } = noteData;

      await supabase.from("notes").insert([
        {
          title,
          description,
          user_id: user.id,
        },
      ]);

      toast.success(`Note has been added!`);
      router.refresh();
    } catch (error: any) {
      console.error("Error adding a note:", error.message);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <form
      className="flex flex-col gap-1 w-full p-1"
      onSubmit={addANote}
      method="dialog"
    >
      <h2 className="text-2xl font-bold">Add a Note</h2>
      <div className="space-y-1">
        <Input
          id="title"
          placeholder="Enter a title"
          name="title"
          onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Textarea
          placeholder="Write your note here..."
          name="note"
          onChange={(e) =>
            setNoteData({ ...noteData, description: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Button type="button" onClick={handleClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" autoFocus>
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddNoteView;
