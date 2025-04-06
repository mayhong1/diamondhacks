import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="navbar-logo flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="NotRedShirt Logo"
              width={40}
              height={40}
              className="rounded-md"
              priority
            />
            <span className="text-xl font-bold">NotRedShirt</span>
          </Link>
          <div className="navbar-links">
            <Link
              href="https://github.com/mayhong1/diamondhacks"
              className={buttonVariants({ variant: "outline" })}
            >
              GitHub
            </Link>
            <Link
              href="/about"
              className={buttonVariants({ variant: "outline" })}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
