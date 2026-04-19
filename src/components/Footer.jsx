import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Showkat Shafi</h3>
            <p className="text-sm text-muted-foreground">
              A shelf for poetry enthusiasts, art, literature and theatre lovers.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <nav className="space-y-2 text-sm text-muted-foreground">
              <Link to="/" className="block hover:text-foreground">Blog</Link>
              <Link to="/about" className="block hover:text-foreground">About</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              info [at] showkatshafi [dot] com
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Showkat Shafi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}