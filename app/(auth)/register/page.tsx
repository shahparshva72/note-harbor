import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/app/(auth)/submit-button";
import { Input } from "@/components/ui/input";

export default function Register({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/register?message=Could not authenticate user");
    }

    return redirect(
      "/register?message=Check email to continue sign in process",
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">Note Harbor</h2>
            <p className="text-sm text-primary">
              Sign Up to create and organize your notes
            </p>
          </div>
        </div>
        <form className="space-y-6">
          <div className="space-y-1">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              placeholder="you@example.com"
              required
              type="email"
              name="email"
            />
          </div>
          <div className="space-y-1">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row">
              <SubmitButton
                formAction={signUp}
                pendingText={"Signing up..."}
                className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Sign Up
              </SubmitButton>
            </div>
            {searchParams?.message && (
              <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
                {searchParams.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
