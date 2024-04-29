import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  CalendarIcon,
  FilterIcon,
  LayoutGridIcon,
  ListOrderedIcon,
  PaletteIcon,
  PlusIcon,
  StickyNoteIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";
import NoteCard from "@/components/NoteCard";
import { db } from "@/utils/drizzle/db";
import AddNoteButton from "@/components/AddNoteButton";

const MockNotes = [
  {
    title: "Meeting Notes",
    description: "Meeting notes with the team",
  },
  {
    title: "Grocery List",
    description: "Grocery list for the week",
  },
  {
    title: "Project Ideas",
    description: "Ideas for the new project",
  },
  {
    title: "Recipes",
    description: "Recipes to try this weekend",
  },
];

export default async function ArchivedNotes() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const notes = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", true)
    .order("updated_at", { ascending: false });

  return (
    <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Archived Notes</h2>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <FilterIcon className="h-5 w-5" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LayoutGridIcon className="mr-2 h-4 w-4" />
                  All
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon className="mr-2 h-4 w-4" />
                  Archived
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TagIcon className="mr-2 h-4 w-4" />
                  Categories
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PaletteIcon className="mr-2 h-4 w-4" />
                  Colors
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <ListOrderedIcon className="h-5 w-5" />
                  <span className="sr-only">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date created
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TagIcon className="mr-2 h-4 w-4" />
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PaletteIcon className="mr-2 h-4 w-4" />
                  Color
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {notes.data &&
            notes.data.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                description={note.description}
                createdAt={note.inserted_at}
                updatedAt={note.updated_at}
                isDeleted={note.is_deleted}
                isArchived={note.is_archived}
              />
            ))}
        </div>
      </div>
  );
}
