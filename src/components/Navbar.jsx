import { Link, useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
            Showkat Shafi
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
            >
              Blog
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors hover:text-primary ${location.pathname === "/about" ? "text-primary" : "text-muted-foreground"}`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}