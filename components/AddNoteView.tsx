"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const AddNoteView = () => {
  const router = useRouter();

  const addANote = async (formData: FormData) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return router.push("/login");
      }

      const title = formData.get("title") as string;
      const description = formData.get("note") as string;

      await supabase.from("notes").insert([
        {
          title,
          description,
          user_id: user.id,
        },
      ]);

      router.push("/notes");
    } catch (error: any) {
      console.error("Error adding a note:", error.message);
    }
  };

  return (
    <form className="flex flex-col gap-1 w-full p-1" action={addANote}>
      <h2 className="text-2xl font-bold">Add a Note</h2>
      <div className="space-y-1">
        <Input id="title" placeholder="Enter a title" name="title" />
      </div>
      <div className="space-y-1">
        <Textarea placeholder="Write your note here..." name="note" />
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Button>Add</Button>
      </div>
    </form>
  );
};

export default AddNoteView;
