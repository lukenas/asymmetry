import Footer from "@/components/Footer";

export default function Interviews() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-32 pb-24">
        {/* Page Header — same scale as field-notes: 0.8rem / 1.95–2.44rem / 1.25rem */}
        <div className="space-y-2 mb-10">
          <span className="font-mono text-[0.8rem] text-asym-dark/50 dark:text-asym-light/50 tracking-wider uppercase block">
            COMING SOON
          </span>
          <h1 className="font-display text-[1.95rem] md:text-[2.44rem] tracking-tight leading-[1.1]">
            Interviews
          </h1>
        </div>

        {/* Content */}
        <div className="max-w-[28rem]">
          <p className="font-display text-[1.25rem] leading-snug tracking-wide text-asym-dark/80 dark:text-asym-light/80">
            Conversations with builders, operators, and investors.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}