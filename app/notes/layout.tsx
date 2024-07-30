import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { StickyNoteIcon, MenuIcon, XIcon, PlusIcon } from "lucide-react";
import LinkButton from "@/components/LinkButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        className="fixed left-4 top-4 z-20 cursor-pointer md:hidden"
      >
        <MenuIcon className="h-6 w-6 text-gray-500" />
      </label>
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Left Sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 w-64 -translate-x-full transform flex-col border-r bg-gray-100 p-6 transition duration-200 ease-in-out peer-checked:translate-x-0 md:relative md:flex md:translate-x-0">
        <label
          htmlFor="sidebar-toggle"
          className="absolute right-4 top-4 cursor-pointer md:hidden"
        >
          <XIcon className="h-6 w-6 text-gray-500" />
        </label>
        <div className="mb-6 mt-10 flex items-center gap-2">
          <StickyNoteIcon className="h-6 w-6 text-gray-500" />
          <h1 className="text-xl font-bold">Note Harbor</h1>
        </div>
        <nav className="mt-10 flex flex-col space-y-2">
          <LinkButton href="/notes" title="Notes" />
          <LinkButton href="/notes/archived" title="Archive" />
          <LinkButton href="/notes/trash" title="Trash" />
        </nav>
        <div className="mt-auto justify-center">
          <Button
            className="mt-4 w-full py-1.5 font-semibold text-white"
            asChild
          >
            <Link href="/add-note">
              <span className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                New Note
              </span>
            </Link>
          </Button>

          {/* Auth Button */}
          <AuthButton className="mt-4 justify-center rounded-md bg-primary text-white no-underline hover:bg-black/90 focus:bg-gray-800 focus:outline-none" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}
