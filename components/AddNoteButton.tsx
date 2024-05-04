// components/AddNoteButton.tsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AddNoteButtonProps {
  user: { id: string };
}

const AddNoteButton: React.FC<AddNoteButtonProps> = ({ user }) => {
  const router = useRouter();
  const addANote = async () => {
    try {
      const supabase = createClient();
      await supabase.from("notes").insert([
        {
          title: "New Note",
          description: "Start writing your note here",
          user_id: user.id,
        },
      ]);

      // Refresh the page to see the new note using nextjs router
      router.refresh();
    } catch (error: any) {
      console.error("Error adding a note:", error.message);
    }
  };

  return (
    <Button
      className="mt-4 bg-black text-white font-semibold w-full"
      asChild
    >
      <Link href="add-note">
      <PlusIcon className="mr-2 h-4 w-4" />
      New Note
      </Link>
    </Button>
  );
};

export default AddNoteButton;
