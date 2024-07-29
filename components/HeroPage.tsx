import { Button } from "@/components/ui/button";
import twitter from "@/components/assets/twitter.svg";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <main className="flex min-h-screen flex-col text-center font-mono">
      <header className="p-4 lg:px-6 h-14 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Note Harbor</h1>
        <div className="flex gap-2 sm:gap-4">
          <AuthButton mode="register" />
          <AuthButton mode="login" />
        </div>
      </header>
      <section className="flex flex-col items-center justify-center flex-grow w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-8">Welcome to Note Harbor</h2>
        <p className="text-base sm:text-lg mb-8 max-w-2xl">
          A note-taking app to help you organize your thoughts and reminders.
        </p>
        <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
      </section>
      <footer className="w-full p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Note Harbor. All rights reserved.
            Developed by Parshva Shah.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com/sparshva72" className="w-6 h-6 sm:w-8 sm:h-8">
              <Image priority src={twitter} alt="Follow us on Twitter" layout="responsive" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}