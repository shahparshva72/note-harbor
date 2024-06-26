import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import {
  ArchiveIcon,
  LayoutGridIcon,
  StickyNoteIcon,
  Trash2Icon,
} from "lucide-react";
import AddNoteButton from "@/components/AddNoteButton";
import LinkButton from "@/components/LinkButton";

const links = [
  {
    title: "All Notes",
    href: "/notes",
    Icon: LayoutGridIcon,
  },
  {
    title: "Archived",
    href: "/notes/archived",
    Icon: ArchiveIcon,
  },
  {
    title: "Trash",
    href: "/notes/trash",
    Icon: Trash2Icon,
  },
];

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
      {/* Left Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-gray-100 p-6 md:flex">
        <div className="mb-6 flex items-center gap-2">
          <StickyNoteIcon className="h-6 w-6 text-gray-500" />
          <h1 className="text-xl font-bold">Note Harbor</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          {links.map((link, index) => (
            <LinkButton href={link.href} title={link.title} key={index}/>
          ))}
        </nav>
        <div className="mt-auto justify-center">
          <AddNoteButton user={user} />

          {/* Auth Button */}
          <AuthButton className="py-1.5 px-4 rounded-md no-underline bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 mt-4 justify-center" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}
