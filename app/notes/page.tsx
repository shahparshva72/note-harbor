import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, ListOrderedIcon } from "lucide-react";
import NoteCardGrid from "@/components/NoteCardGrid";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .neq("is_deleted", true)
    .neq("is_archived", true)
    .order("inserted_at", { ascending: false });

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Notes</h2>
        <div className="flex items-center gap-4">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {notes ? <NoteCardGrid notes={notes} /> : <div>Loading...</div>}
      </div>
    </div>
  );
}
