"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditNoteView = (props: { id: Number }) => {
  const [stateOfInput, setStateOfInput] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();
  const supabase = createClient();
  const { id } = props;

  useEffect(() => {
    const fetchData = async () => {
      const { data: {user} } = await supabase.auth.getUser();
      if (!user) {
        return router.push("/login");
      }
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (error) {
        console.error("Error: ", error.message);
      } else {
        setStateOfInput({ title: data.title, description: data.description });
      }
    };
    fetchData();
  }, [id, supabase]);

  const editNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description } = stateOfInput;
    try {
      await supabase.from("notes").update({ title, description }).eq("id", id);
      toast.success("Note updated.");
      router.back();
    } catch (error: any) {
      console.error("Error editing the note:", error.message);
    }
  };

  return (
    <form className="flex flex-col gap-1 w-full p-1" onSubmit={editNote}>
      <div className="space-y-1">
        <Input
          id="title"
          placeholder="Enter a title"
          value={stateOfInput.title}
          onChange={(e) => setStateOfInput({ ...stateOfInput, title: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Textarea
          className="h-2/3"
          id="note"
          placeholder="Write your note here..."
          value={stateOfInput.description}
          onChange={(e) => setStateOfInput({ ...stateOfInput, description: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default EditNoteView;
