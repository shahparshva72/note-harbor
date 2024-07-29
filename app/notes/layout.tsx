import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import {
  StickyNoteIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import AddNoteButton from "@/components/AddNoteButton";
import LinkButton from "@/components/LinkButton";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen w-full">
      {/* Hamburger menu for mobile */}
      <label
        htmlFor="sidebar-toggle"
        className="cursor-pointer md:hidden fixed top-4 left-4 z-20"
      >
        <MenuIcon className="h-6 w-6 text-gray-500" />
      </label>
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />

      {/* Left Sidebar */}
      <div className="fixed inset-y-0 left-0 transform -translate-x-full peer-checked:translate-x-0 md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 flex-col border-r bg-gray-100 p-6 md:flex z-10">
        <label
          htmlFor="sidebar-toggle"
          className="absolute top-4 right-4 cursor-pointer md:hidden"
        >
          <XIcon className="h-6 w-6 text-gray-500" />
        </label>
        <div className="mb-6 flex items-center gap-2 mt-10">
          <StickyNoteIcon className="h-6 w-6 text-gray-500" />
          <h1 className="text-xl font-bold">Note Harbor</h1>
        </div>
        <nav className="flex flex-col space-y-2 mt-10">
          <LinkButton href="/notes" title="Notes" />
          <LinkButton href="/notes/archive" title="Archive" />
          <LinkButton href="/notes/trash" title="Trash" />
        </nav>
        <div className="mt-auto justify-center">
          <AddNoteButton user={user} />

          {/* Auth Button */}
          <AuthButton className="py-1.5 px-4 rounded-md no-underline bg-primary text-white hover:bg-black/90 focus:outline-none focus:bg-gray-800 mt-4 justify-center" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}
