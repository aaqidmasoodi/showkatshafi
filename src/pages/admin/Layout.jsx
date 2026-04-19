import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { getCurrentUser, logout } from "../../lib/auth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) return null;

  const navItems = [
    { path: "/admin", label: "Posts", icon: "📝" },
    { path: "/admin/posts/new", label: "New Post", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded"
              >
                ☰
              </button>
              <Link to="/admin" className="font-bold text-lg">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
                View Site
              </Link>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex gap-8">
          <aside className={`${sidebarOpen ? "w-48" : "w-0"} transition-all overflow-hidden`}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}