import { Button } from "@/components/ui/button";
import twitter from "@/components/assets/twitter.svg";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center p-4 font-mono bg-gray-100">
      <header className="w-full p-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Note Harbor</h1>
          <div className="flex gap-4">
          <AuthButton mode="register" className="py-1.5 px-4 rounded-md no-underline bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 mt-4 justify-center" />
          <AuthButton mode="login" className="py-1.5 px-4 rounded-md no-underline bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 mt-4 justify-center" />
          </div>
        </nav>
      </header>
      <section className="flex flex-col items-center justify-center flex-grow w-full">
        <h2 className="text-4xl font-bold mb-4 mt-8">Welcome to Note Harbor</h2>
        <p className="text-lg mb-8">
          A note-taking app to help you organize your thoughts and reminders.
        </p>
        <Button size="lg">Get Started</Button>
      </section>
      <footer className="w-full p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Note Harbor. All rights reserved.
            Developed by Parshva Shah.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com/sparshva72">
              <Image priority src={twitter} alt="Follow us on Twitter" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
