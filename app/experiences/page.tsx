import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";
import Image from "next/image";

export default function Experiences() {
  return (
    <>
      <PageHero
        title="Exclusive Experiences"
        subtitle="Moments designed beyond the ordinary."
        image="/images/backpack.jpg"
      />

      <section className="bg-white py-28">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              "/images/2-CCwxLBNf.jpg",
              "/images/5-B137TKjW.jpg",
              "/images/12-C8GUHtRf.jpg",
            ].map((img, i) => (
              <div key={i} className="relative h-80 rounded-3xl overflow-hidden shadow-lg">
                <Image src={img} alt="Experience" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}