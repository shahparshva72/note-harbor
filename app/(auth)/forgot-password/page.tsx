import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Banner from "@/components/Banner";

export default function ForgotPassword({
  searchParams
}: {
  searchParams: { message: string; status: string };
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin") || "http://localhost:3000";
    const email = formData.get("email") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`
    });

    if (error) {
      return redirect(`/forgot-password?message=${error.message}&status=error`);
    }

    return redirect(`/forgot-password?message=${data}&status=success`);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Banner message={searchParams.message} status={searchParams.status} />
      <nav className="absolute left-4 top-16">
        <div className="text-2xl font-bold">Note Harbor</div>
      </nav>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
        </div>
        <form className="space-y-6" action={resetPassword} method="POST">
          <div>
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
