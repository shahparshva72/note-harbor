import { Button } from "@/components/ui/button";
import twitter from "@/components/assets/twitter.svg";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <main className="flex min-h-screen flex-col text-center font-mono">
      <header className="flex h-14 items-center justify-between p-4 lg:px-6">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
          Note Harbor
        </h1>
        <div className="flex gap-2 sm:gap-4">
          <AuthButton mode="register" />
          <AuthButton mode="login" />
        </div>
      </header>
      <section className="flex w-full flex-grow flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 mt-8 text-2xl font-bold sm:text-3xl md:text-4xl">
          Welcome to Note Harbor
        </h2>
        <p className="mb-8 max-w-2xl text-base sm:text-lg">
          A note-taking app to help you organize your thoughts and reminders.
        </p>
        <Button size="lg" className="w-full sm:w-auto">
          Get Started
        </Button>
      </section>
      <footer className="w-full p-4 sm:p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs sm:text-left sm:text-sm">
            © {new Date().getFullYear()} Note Harbor. All rights reserved.
            Developed by Parshva Shah.
          </p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/sparshva72"
              className="h-6 w-6 sm:h-8 sm:w-8"
            >
              <Image
                priority
                src={twitter}
                alt="Follow us on Twitter"
                layout="responsive"
              />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
