import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../submit-button";
import Link from "next/link";

export default function Login({
  searchParams
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/notes");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-slate-50">
      <nav className="absolute left-4 top-4">
        <div className="text-2xl font-bold text-gray-900">Note Harbor</div>
      </nav>
      <div className="w-96 max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and password to sign in
        </p>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <SubmitButton
              formAction={signIn}
              pendingText="Signing in..."
              className="hover:bg-primary-dark w-full rounded-lg bg-primary px-4 py-2 font-bold text-white"
            >
              Sign In
            </SubmitButton>
          </div>
          <div className="mt-6 text-center text-sm text-primary">
            <Link href="/register">Sign Up Instead</Link>
          </div>
          {searchParams?.message && (
            <div
              className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <span className="block sm:inline">{searchParams.message}</span>
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-primary">
          <Link href="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
}
