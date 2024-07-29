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
  ArchiveIcon,
  TrashIcon,
  MoreHorizontalIcon,
  NotebookPenIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Note, NoteActionHandlers } from "@/types/note";

type NoteCardProps = Note & NoteActionHandlers;

const NoteCard = ({
  id,
  title,
  description,
  inserted_at,
  updated_at,
  is_deleted,
  is_archived,
  onDelete,
  onArchive,
  onRestore,
}: NoteCardProps) => {
  const router = useRouter();

  const handleAction = (action: (id: string) => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    action(id);
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
            {is_archived ? (
              <DropdownMenuItem onClick={handleAction(onRestore)}>
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Unarchive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleAction(onArchive)}>
                <ArchiveIcon className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
            {is_deleted ? (
              <>
                <DropdownMenuItem onClick={handleAction(onRestore)}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleAction(onDelete)}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => router.push(`/note/${id}`)}>
              <NotebookPenIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-gray-500 mt-0">{description}</p>

      <div className="flex flex-col text-gray-500 text-xs space-y-1 mt-auto">
        <p className="mt-auto">
          Created:{" "}
          <span className="font-medium">
            {new Date(inserted_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
        <p>
          Last updated:{" "}
          <span className="font-medium">
            {new Date(updated_at).toLocaleTimeString("en-US", {
              month: "short",
              day: "numeric",
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
