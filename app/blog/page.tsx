import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";
import Image from "next/image";

export default function Blog() {
  return (
    <>
      <PageHero
        title="Travel Stories & Insights"
        subtitle="Inspiration for your next journey."
        image="/images/blog-hero.jpg"
      />

      <section className="bg-white py-32">
        <Container>
          <div className="space-y-24 animate-fadeUp">

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/9-7bWC5u3B.jpg"
                  alt="Kashmir"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tight">
                  Exploring Kashmir in Winter
                </h3>
                <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                  Experience the magic of snow-covered valleys,
                  frozen lakes, and Himalayan serenity.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl md:order-2">
                <Image
                  src="/images/3-D7srdLDQ.jpg"
                  alt="Rajasthan"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tight">
                  Luxury Rajasthan Getaway
                </h3>
                <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                  Discover royal palaces, heritage stays,
                  and immersive cultural experiences.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}