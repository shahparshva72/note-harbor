import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AuthButtonProps {
  className?: string;
}

export default async function AuthButton({ mode, className }: { mode?: "register" | "login", className: string }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className={`flex items-center ${className}`}>
      <form action={signOut}>
        <button type="submit">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href={mode === "register" ? "/register" : "/login"}
      className="py-2 px-3 flex rounded-md no-underline bg-black hover:bg-black/80 text-white hover:text-white/80 transition-colors duration-200 ease-in-out"
    >
      {mode === "register" ? "Sign up" : "Login"}
    </Link>
  );
}
