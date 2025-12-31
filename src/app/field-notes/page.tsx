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
      <main className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        {/* Page Header */}
        <div className="pb-8 mb-8">
          <span className="font-mono text-xs text-asym-orange tracking-widest uppercase">Archive</span>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide mt-2">Field Notes</h1>
          <p className="font-mono text-sm text-asym-dark/50 dark:text-asym-light/50 mt-6 max-w-lg">
            Thoughts on AI, product, and building things that matter.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-asym-dark/10 dark:border-asym-light/10">
          {fieldNotes.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer border-b border-r border-asym-dark/10 dark:border-asym-light/10 p-8 hover:bg-asym-dark/[0.02] dark:hover:bg-asym-light/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40 tracking-wide">
                  {post.date.toUpperCase()}
                </span>
                <span className="w-1 h-1 rounded-full bg-asym-dark/20 dark:bg-asym-light/20" />
                <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40 tracking-wide">
                  {post.readTime}
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl tracking-wide mb-4 group-hover:text-asym-orange transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="font-sans text-sm text-asym-dark/60 dark:text-asym-light/60 leading-relaxed">
                {post.excerpt}
              </p>

              <span className="inline-block mt-6 font-mono text-xs text-asym-orange opacity-0 group-hover:opacity-100 transition-opacity tracking-wide">
                READ →
              </span>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
