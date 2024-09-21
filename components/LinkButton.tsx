"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
// Import icons
import { NotebookIcon, ArchiveIcon, TrashIcon } from "lucide-react";

interface LinkButtonProps {
  href: string;
  title: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, title }) => {
  const currentPath = usePathname();
  
  // Function to render icons based on title
  const renderIcon = (title: string) => {
    switch (title) {
      case 'Notes':
        return <NotebookIcon />;
      case 'Archive':
        return <ArchiveIcon />;
      case 'Trash':
        return <TrashIcon />;
      default:
        return null;
    }
  };

  return (
    <Link
        key={href}
        href={href}
        className={`flex justify-start gap-2 rounded-md p-2 hover:w-full hover:bg-gray-200 ${
          currentPath === href ? "bg-gray-200" : ""
        }`}
      >
        {renderIcon(title)}
        <span>{title}</span>
      </Link>
  );
};

export default LinkButton;
