import { Link } from "react-router";

export default function About() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About</h1>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Showkat Shafi</h2>
          <p className="text-lg text-muted-foreground mb-6">Author</p>
          <p className="text-lg leading-relaxed mb-6">
            A shelf for poetry enthusiasts, art, literature and theatre lovers. Dive into a
            captivating world of expressive blogs, insightful poetry reviews, profiles of
            great writers and thought-provoking discussions on society and culture. Explore the
            depths of creativity through the lens of society and immerse yourself in the
            diverse tapestry of human expression.
          </p>
        </div>

        <div className="card p-8">
          <h3 className="text-xl font-bold mb-4">Find Us</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Address</h4>
              <p className="text-muted-foreground">
                Srinagar
                <br />
                Jammu & Kashmir, India
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Hours</h4>
              <p className="text-muted-foreground">
                Monday–Friday: 9:00AM–5:00PM
                <br />
                Saturday & Sunday: 11:00AM–3:00PM
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Contact</h4>
              <p className="text-muted-foreground">
                info [at] beyondtheshelf [dot] com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}