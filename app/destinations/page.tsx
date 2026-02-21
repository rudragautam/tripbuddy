import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";
import Image from "next/image";

const destinations = [
  { name: "Goa", image: "/images/2-CCwxLBNf.jpg" },
  { name: "Rajasthan", image: "/images/3-D7srdLDQ.jpg" },
  { name: "Himachal", image: "/images/5-B137TKjW.jpg" },
  { name: "Kerala", image: "/images/7-C3EbZX1a.jpg" },
  { name: "Kashmir", image: "/images/9-7bWC5u3B.jpg" },
  { name: "Andaman", image: "/images/12-C8GUHtRf.jpg" },
];

export default function Destinations() {
  return (
    <>
      <PageHero
        title="Explore Destinations"
        subtitle="Discover handpicked destinations across India."
        image="/images/destinations-hero.jpg"
      />

      <main className="bg-white py-28">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {destinations.map((place) => (
              <div
                key={place.name}
                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition duration-500"
              >
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-200 mt-2">
                    Curated premium experiences
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}