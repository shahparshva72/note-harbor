import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ResetPassword({ searchParams }: {
    searchParams: { code: string, message: string };
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  const resetPassword = async (formData: FormData) => {
    'use server';

    const password = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      return redirect(`/reset-password?message=Passwords do not match. Try again!`);
    }

    if (searchParams.code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(searchParams.code);
      if (exchangeError) {
        return redirect(`/reset-password?message=Unable to reset Password. Link expired!`);
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      console.log(updateError);
      return redirect(`/reset-password?message=Unable to reset Password. Try again!`);
    }

    return redirect(`/login?message=Your Password has been reset successfully. Sign in.`);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {searchParams.message && (
        <div className="absolute top-4 left-4 right-4 p-4 bg-red-100 text-red-800 rounded-md shadow-md">
          {searchParams.message}
        </div>
      )}
      <nav className="absolute top-4 left-4">
        <div className="text-2xl font-bold text-gray-900">Note Harbor</div>
      </nav>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your new password to reset your account.</p>
        </div>
        <form className="space-y-6" action={resetPassword}>
          <div className="space-y-1">
            <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</Label>
            <Input id="newPassword" name="newPassword" type="password" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          <Button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Reset Password
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
