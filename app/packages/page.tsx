import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";
import Image from "next/image";

export default function Packages() {
  return (
    <>
      <PageHero
        title="Luxury Travel Packages"
        subtitle="Handcrafted journeys tailored to your style."
        image="/images/packages-hero.jpg"
      />

      <section className="bg-white py-28">
        <Container>
          <div className="grid md:grid-cols-2 gap-16">
            {[
              "/images/7-C3EbZX1a.jpg",
              "/images/9-7bWC5u3B.jpg",
              "/images/10-Bv3F3jVD.jpg",
              "/images/11-B62wrOai.jpg",
            ].map((img, i) => (
              <div key={i} className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
                <Image src={img} alt="Package" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}