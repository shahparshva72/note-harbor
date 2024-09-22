"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotebookIcon, ArchiveIcon, TrashIcon } from "lucide-react";

// Map for icons based on title
const icons = {
  Notes: NotebookIcon,
  Archive: ArchiveIcon,
  Trash: TrashIcon,
};

interface LinkButtonProps {
  href: string;
  title: keyof typeof icons;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, title }) => {
  const currentPath = usePathname();
  const Icon = icons[title] || null;

  return (
    <Link
      href={href}
      className={`flex justify-start gap-2 rounded-md p-2 hover:w-full hover:bg-gray-200 ${
        currentPath === href ? "bg-gray-200" : ""
      }`}
    >
      {Icon && <Icon />}
      <span>{title}</span>
    </Link>
  );
};

export default LinkButton;
