"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  FileEditIcon,
  ArchiveIcon,
  TrashIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isArchived: boolean;
}

const NoteCard = ({
  id,
  title,
  description,
  createdAt,
  updatedAt,
  isDeleted,
  isArchived,
}: NoteCardProps) => {
  const router = useRouter();

  const deleteNote = async () => {
    try {
      const supabase = createClient();
      await supabase.from("notes").update({ is_deleted: true, is_archived: false }).match({ id });
      router.refresh();
      toast.success("Note moved to trash.");
    } catch (error: any) {
      console.error("Error deleting the note:", error.message);
    }
  };

  const archiveNote = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return router.push("/login");
      }
      await supabase
        .from("notes")
        .update({ is_archived: true })
        .match({ id })
        .eq("user_id", user.id);
      router.refresh();
      toast.success("Note archived.");
    } catch (error: any) {
      console.error("Error archiving the note:", error.message);
    }
  };

  return (
    <Card className="relative flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="h-5 w-5" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={archiveNote}>
              <ArchiveIcon className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            {isDeleted ? (
              <DropdownMenuItem onClick={deleteNote}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={deleteNote}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-gray-500 mt-0">{description}</p>

      <div className="flex flex-col text-gray-500 text-xs space-y-1 mt-auto">
        <p className="mt-auto">
          Created:{" "}
          <span className="font-medium">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
        <p>
          Last updated at{" "}
          <span className="font-medium">
            {new Date(updatedAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
    </Card>
  );
};

export default NoteCard;
