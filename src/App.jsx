import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/Toast";
import BlogIndex from "./pages/BlogIndex.tsx";
import PostDetail from "./pages/PostDetail.tsx";
import About from "./pages/About.tsx";
import CategoryPosts from "./pages/CategoryPosts";
import TagPosts from "./pages/TagPosts";
import Login from "./pages/Login.tsx";
import AdminLayout from "./pages/admin/Layout";
import AdminPosts from "./pages/admin/Posts.tsx";
import PostEditor from "./pages/admin/PostEditor.tsx";
import AdminCategories from "./pages/admin/Categories.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPosts />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/:id" element={<PostEditor />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
          <Route path="*" element={<>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<BlogIndex />} />
                <Route path="/about" element={<About />} />
                <Route path="/post/:slug" element={<PostDetail />} />
                <Route path="/category/:slug" element={<CategoryPosts />} />
                <Route path="/tag/:slug" element={<TagPosts />} />
              </Routes>
            </main>
            <Footer />
          </>} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}