// components/Layout.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
  FilterIcon,
  LayoutGridIcon,
  ListOrderedIcon,
  PaletteIcon,
  StickyNoteIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";
import AddNoteButton from "@/components/AddNoteButton";

export default async function Layout({ children }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-gray-100 p-6 md:flex">
        <div className="mb-6 flex items-center gap-2">
          <StickyNoteIcon className="h-6 w-6 text-gray-500" />
          <h1 className="text-xl font-bold">Note Harbor</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            href="/notes"
          >
            <LayoutGridIcon className="h-4 w-4" />
            All Notes
          </Link>
          <Link
            className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            href="/notes/archived"
          >
            <ArchiveIcon className="h-4 w-4" />
            Archived
          </Link>
          <Link
            className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            href="/notes/trash"
          >
            <Trash2Icon className="h-4 w-4" />
            Trash
          </Link>
        </nav>
        <div className="mt-auto justify-center">
          <AddNoteButton user={user} />

          {/* Auth Button */}
          <AuthButton className="py-1.5 px-4 rounded-md no-underline bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 mt-4 justify-center" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
