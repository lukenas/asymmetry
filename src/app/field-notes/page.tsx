import Footer from "@/components/Footer";

const fieldNotes = [
  {
    id: 1,
    title: "Building AI Products That Actually Ship",
    excerpt: "The gap between prototype and production is where most AI projects die. Here's how to bridge it.",
    date: "Dec 28, 2025",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Asymmetry of Information in Product Development",
    excerpt: "Why the best product decisions come from understanding what you don't know.",
    date: "Dec 20, 2025",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Designing for Human-AI Collaboration",
    excerpt: "Moving beyond automation to create genuinely collaborative experiences.",
    date: "Dec 15, 2025",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "The Case for Simplicity in Complex Systems",
    excerpt: "How constraints and simplicity lead to better products, not worse ones.",
    date: "Dec 10, 2025",
    readTime: "4 min read",
  },
];

export default function FieldNotes() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 pt-32 pb-16">
        {/* Page Title */}
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide mb-4">Field Notes</h1>
        <p className="font-mono text-sm text-asym-dark/60 dark:text-asym-light/60 mb-16">
          Thoughts on AI, product, and building things that matter.
        </p>

        {/* Posts */}
        <div className="space-y-12">
          {fieldNotes.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer border-b border-asym-dark/10 dark:border-asym-light/10 pb-12"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="font-mono text-xs text-asym-dark/60 dark:text-asym-light/60">
                  {post.date}
                </span>
                <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40">
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-display text-2xl tracking-wide mb-3 group-hover:text-asym-orange transition-colors">
                {post.title}
              </h2>
              <p className="font-sans text-asym-dark/70 dark:text-asym-light/70 leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
