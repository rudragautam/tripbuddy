import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({
  title,
  subtitle,
  image,
}: PageHeroProps) {
  return (
    <section className="relative h-[60vh] w-full flex items-center overflow-hidden bg-gray-900">
      
      {/* Only render image if it exists */}
      {image && image.trim() !== "" && (
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}