"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Spinner from "./ui/spinner";

const initialState = {
  title: "",
  description: "",
};

const EditNoteView = (props: { id: number }) => {
  const [stateOfInput, setStateOfInput] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { id } = props;

  useEffect(() => {
    const fetchData = async () => {
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
        setStateOfInput({ title: data.title, description: data.description });
      } catch (error: any) {
        console.error("Error: ", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, supabase, router]);

  const editNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const { title, description } = stateOfInput;
    try {
      const { error } = await supabase
        .from("notes")
        .update({ title, description })
        .eq("id", id);
      if (error) throw error;
      toast.success(`${title} has been updated!`);
      router.back();
    } catch (error: any) {
      console.error("Error editing the note:", error.message);
      toast.error(`Failed to update note: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    <div className="flex justify-center items-center h-full">
      <Spinner />
    </div>;
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <form
      className="flex flex-col gap-1 w-full p-1"
      onSubmit={editNote}
      method="dialog"
    >
      <div className="">
        <Input
          id="title"
          placeholder="Enter a title"
          value={stateOfInput.title}
          onChange={(e) =>
            setStateOfInput({ ...stateOfInput, title: e.target.value })
          }
          className="text-xl font-semibold mb-4"
        />
      </div>
      <div className="space-y-1">
        <Textarea
          className="min-h-[200px] text-base font-mono"
          id="note"
          placeholder="- Item 1&#10;- Item 2&#10;- Item 3"
          value={stateOfInput.description}
          onChange={(e) =>
            setStateOfInput({ ...stateOfInput, description: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={handleClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default EditNoteView;
