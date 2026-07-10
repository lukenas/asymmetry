import Footer from "@/components/Footer";

export default function Interviews() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight">Interviews</h1>
          <p className="font-sans text-sm mt-2 leading-relaxed">
            Conversations with builders, operators, and investors.
          </p>
        </header>

        <p className="font-sans text-xs tracking-wider uppercase mt-8">
          Coming Soon
        </p>
      </div>

      <Footer />
    </div>
  );
}
