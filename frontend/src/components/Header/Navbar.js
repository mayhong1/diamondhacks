import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="navbar-logo">
            NotRedShirt
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
