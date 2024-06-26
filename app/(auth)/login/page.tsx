import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../submit-button";
import Link from "next/link";

export default function Login({ searchParams }: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/notes");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-slate-50">
      <nav className="absolute top-4 left-4">
        <div className="text-2xl font-bold text-gray-900">Note Harbor</div>
      </nav>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Sign In</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and password to sign in
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
            >
              Sign In
            </SubmitButton>
          </div>
          {searchParams?.message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{searchParams.message}</span>
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-primary">
          <Link href="/forgot-password">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
