"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkButtonProps {
  href: string;
  title: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, title }) => {
    const currentPath = usePathname();
    return (
        <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
                currentPath === href ? "bg-gray-200" : ""
            }`}
        >
            {/* <Icon className="h-5 w-5" /> */}
            <span>{title}</span>
        </Link>
    );
};

export default LinkButton