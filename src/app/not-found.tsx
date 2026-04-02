import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, Search, Sparkles, Heart } from "lucide-react";

const categories = [
  { name: "Perfumes", icon: Sparkles },
  { name: "Fragrance Oils", icon: Heart },
  { name: "Candles", icon: Sparkles },
  { name: "Diffusers", icon: Heart },
  { name: "Hair Mist", icon: Sparkles },
  { name: "Body Mist", icon: Heart },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-white px-4 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-[#b2a896]/20 blur-3xl" />
          <div
            className="absolute -bottom-32 -right-32 h-[400px] w-[400px] animate-pulse rounded-full bg-[#f7f6f2]/30 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <div className="mb-6">
            <Image
              src="https://cms.aromaticscentslab.com/wp-content/uploads/2025/12/ASL-Website-Images-Patchouli-Glow-06.webp"
              alt="Aromatic Scents Lab"
              width={120}
              height={120}
              className="mx-auto rounded-full object-cover shadow-lg"
              style={{ width: 120, height: 120 }}
            />
          </div>

          <h1 className="mb-4 text-2xl font-bold text-[#633d1f] md:text-4xl">
            Looks like this page has drifted away...
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-[#b2a896] md:text-lg">
            The page you were looking for may have moved, but your perfect scent
            is still waiting. Let us help you find what you need.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/en"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#c67a46] bg-[#c67a46] px-8 text-base font-medium uppercase tracking-wide text-white transition-all duration-300 hover:bg-transparent hover:text-[#c67a46]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/en/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#c67a46] bg-transparent px-8 text-base font-medium uppercase tracking-wide text-[#c67a46] transition-all duration-300 hover:bg-[#c67a46] hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Our Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c67a46]" />
            <h2 className="text-lg font-semibold uppercase tracking-widest text-[#c67a46] md:text-xl">
              Popular Categories
            </h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c67a46]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/en/shop"
                className="group flex items-center gap-3 rounded-xl border border-[#e8e0d5] bg-[#F5F0E8]/50 p-4 transition-all duration-300 hover:border-[#b2a896] hover:bg-[#F5F0E8] hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f6f2] transition-colors group-hover:bg-[#b2a896]">
                  <cat.icon className="h-5 w-5 text-[#b2a896]" />
                </div>
                <span className="text-sm font-medium text-[#633d1f] md:text-base">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-[#F5F0E8] px-4 py-12">
        <div className="container mx-auto max-w-2xl text-center">
          <Search className="mx-auto mb-4 h-8 w-8 text-[#c67a46]" />
          <h3 className="mb-2 text-lg font-semibold text-[#633d1f]">
            Need Help?
          </h3>
          <p className="mb-6 text-[#b2a896]">
            Our team is here to help you find exactly what you&apos;re looking
            for.
          </p>
          <Link
            href="/en/contact"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full border-2 border-[#c67a46] bg-transparent px-4 text-xs font-medium uppercase tracking-wide text-[#c67a46] transition-all duration-300 hover:bg-[#c67a46] hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
