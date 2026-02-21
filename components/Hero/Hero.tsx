import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">

      {/* Background */}
      <Image
        src="/images/backpack.jpg"
        alt="TripBuddy Travel"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>

      {/* Content */}
      <div className="relative z-10 pl-6 sm:pl-12 md:pl-20 lg:pl-28 max-w-4xl text-white">

        {/* Increased spacing from navbar */}
        <div className="mt-16 md:mt-24">

          {/* Eyebrow */}
          <p className="uppercase text-xs tracking-[0.4em] text-gray-300 mb-10">
            Curated Travel Experiences
          </p>

          {/* Reduced Heading Size */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
            Discover India Differently
            <span className="block mt-4 text-orange-500/90">
              Travel Beyond The Ordinary
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-10 max-w-xl text-base sm:text-lg text-gray-200 leading-relaxed">
            Handcrafted travel packages designed for explorers,
            couples and small groups seeking meaningful journeys
            across India’s most breathtaking landscapes.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-6">
            <button className="bg-orange-500 hover:bg-orange-600 transition duration-300 px-8 py-4 rounded-full text-base font-semibold shadow-xl">
              Explore Trips
            </button>

            <button className="border border-white/30 hover:bg-white/10 transition duration-300 px-8 py-4 rounded-full text-base">
              Learn More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}