import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";
import Image from "next/image";

export default function About() {
  return (
    <>
      <PageHero
        title="About TripBuddy"
        subtitle="Where meaningful journeys begin."
        image="/images/about-hero.jpg"
      />

      <section className="bg-white py-32">
        <Container>
          <div className="grid md:grid-cols-2 gap-24 items-center animate-fadeUp">

            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
                Travel Designed With Purpose
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                TripBuddy is a curated travel platform built for explorers,
                couples, and small groups seeking premium handcrafted experiences.
              </p>

              <p className="text-gray-600 leading-relaxed text-lg">
                We focus on quality over quantity, delivering deeply personalized
                journeys that balance luxury, authenticity, and seamless execution.
              </p>
            </div>

            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/10-Bv3F3jVD.jpg"
                alt="Travel Experience"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}