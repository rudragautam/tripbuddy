import PageHero from "@/components/Layout/PageHero";
import Container from "@/components/Layout/Container";

export default function Contact() {
  return (
    <>
      <PageHero
        title="Plan Your Journey"
        subtitle="Let us craft a personalized travel experience for you."
        image="/images/packages-hero.jpg"
      />

      <section className="bg-gray-50 py-32">
        <Container>
          <div className="max-w-3xl mx-auto animate-fadeUp">

            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Start Your Journey
              </h2>
              <p className="mt-6 text-gray-600 max-w-xl mx-auto leading-relaxed">
                Share your travel vision and our experts will curate
                a tailored experience crafted exclusively for you.
              </p>
            </div>

            <form className="space-y-10 bg-white p-12 rounded-3xl shadow-2xl">

              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-200 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-500 mb-3">
                  Tell Us About Your Trip
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
                />
              </div>

              <div className="text-center pt-6">
                <button className="bg-orange-500 hover:bg-orange-600 transition px-10 py-4 rounded-full text-white font-semibold shadow-xl">
                  Submit Inquiry
                </button>
              </div>

            </form>
          </div>
        </Container>
      </section>
    </>
  );
}