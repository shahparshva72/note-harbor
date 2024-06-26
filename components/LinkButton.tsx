"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Button} from "@/components/ui/button";

interface LinkButtonProps {
  href: string;
  title: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, title}) => {
    const currentPath = usePathname();
    return (
        <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
                currentPath === href ? "bg-gray-200" : ""
            }`}
        >
            <span>{title}</span>
        </Link>
    );
};

export default LinkButton