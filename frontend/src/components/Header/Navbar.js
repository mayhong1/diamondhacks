import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="flex items-center gap-4">
            <Link href="/" className="navbar-logo flex items-center gap-2">
              <div className="w-12 h-12 relative">
                <Image
                  src="/logo.jpg"
                  alt="NotRedShirt Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span>NotRedShirt</span>
            </Link>
            <div className="h-8 w-px bg-gray-400 mx-4"></div>
            <Link
              href="https://diamondhacks.acmucsd.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity navbar-logo"
            >
              <div className="w-10 h-10 relative">
                <Image
                  src="/acm.png"
                  alt="ACM Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span>DiamondHacks</span>
            </Link>
          </div>
          <div className="navbar-links flex items-center gap-4">
            <Link
              href="https://github.com/mayhong1/diamondhacks"
              target="_blank"
              rel="noopener noreferrer"
              className={
                buttonVariants({ variant: "outline", size: "lg" }) +
                " text-lg px-6 py-2"
              }
            >
              GitHub
            </Link>
            <Link
              href="/about"
              className={
                buttonVariants({ variant: "outline", size: "lg" }) +
                " text-lg px-6 py-2"
              }
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
