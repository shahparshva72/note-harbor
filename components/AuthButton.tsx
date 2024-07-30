import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AuthButton({
  mode,
  className,
}: {
  mode?: "register" | "login";
  className?: string;
}) {
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
        <Button type="submit">Logout</Button>
      </form>
    </div>
  ) : (
    <Button asChild>
      <Link href={mode === "register" ? "/register" : "/login"}>
        {mode === "register" ? "Sign up" : "Login"}
      </Link>
    </Button>
  );
}
