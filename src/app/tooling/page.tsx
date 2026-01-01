import Footer from "@/components/Footer";

export default function Tooling() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-8 pt-32 pb-24 w-full">
        {/* Page Header */}
        <div className="pb-8 mb-16">
          <span className="font-mono text-xs text-asym-orange tracking-widest uppercase">Coming Soon</span>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide mt-2">Tooling</h1>
        </div>

        {/* Content */}
        <div className="max-w-3xl">
          <div className="relative p-12">
            {/* Corner borders only */}
            <div className="absolute top-0 left-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute top-0 right-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute bottom-0 right-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute top-0 left-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute top-0 right-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute bottom-0 left-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
            <div className="absolute bottom-0 right-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
            
            <p className="font-display text-2xl sm:text-3xl tracking-wide mb-8 text-asym-dark/80 dark:text-asym-light/80">
              Tools and resources for building AI products.
            </p>

            {/* Coming Soon Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-asym-orange animate-pulse" />
              <span className="font-mono text-xs text-asym-dark/50 dark:text-asym-light/50 tracking-wide">
                LAUNCHING SOON
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

