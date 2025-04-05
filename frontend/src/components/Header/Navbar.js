import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="navbar-logo">
            DiamondHacks2025
          </Link>
          <div className="navbar-links">
            <Link href="/github" className="navbar-link">
              GitHub
            </Link>
            <Link href="/about" className="navbar-link">
              About
            </Link>
            <Link href="/signin" className="navbar-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
