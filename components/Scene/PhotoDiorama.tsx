import Image from "next/image";
import type { Photo, TourType } from "@/lib/types";

/** Colour of the slab's base per trip type (earth under the photo). */
const slab: Record<TourType, string> = {
  hills: "#4a3b2b",
  mountain: "#5a4936",
  desert: "#9a522c",
  beach: "#8f7448",
  backwaters: "#4c3a26",
  heritage: "#8c5f45",
  wildlife: "#5b4828",
  snow: "#8496ae",
};

function slabShadow(color: string, depth: number) {
  const layers = Array.from({ length: depth }, (_, i) => `0 ${i + 1}px 0 ${color}`);
  return [...layers, `0 ${depth + 26}px 50px -18px rgb(0 0 0 / 0.45)`].join(", ");
}

/**
 * A real photo presented as a 3D diorama slab: tilted back, with a thick earthy base and a ground shadow,
 * so it sits in the same visual language as the reference designs.
 */
export default function PhotoDiorama({
  photo,
  type,
  priority = false,
  compact = false,
  sizes = "(min-width: 1024px) 55vw, 100vw",
  showCredit = true,
}: {
  photo: Photo;
  type: TourType;
  priority?: boolean;
  compact?: boolean;
  sizes?: string;
  showCredit?: boolean;
}) {
  const depth = compact ? 10 : 22;
  return (
    <figure className="group relative m-0 [perspective:1800px]">
      <div
        className="relative mx-auto w-[94%] transition-transform duration-700 ease-out [transform:rotateX(20deg)_rotateZ(-3deg)] group-hover:[transform:rotateX(12deg)_rotateZ(-1.5deg)] motion-reduce:transition-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`relative overflow-hidden ${compact ? "rounded-2xl" : "rounded-[28px]"} aspect-[4/3] bg-neutral-300`}
          style={{ boxShadow: slabShadow(slab[type], depth) }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* soft light from the top edge, like a lit miniature */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/20" />
        </div>
      </div>
      {showCredit && <PhotoCredit photo={photo} className="mt-6 text-right" />}
    </figure>
  );
}

export function PhotoCredit({ photo, className = "" }: { photo: Photo; className?: string }) {
  return (
    <figcaption className={`text-[11px] leading-tight text-t-muted ${className}`}>
      Photo:{" "}
      {photo.sourceUrl ? (
        <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
          {photo.author}
        </a>
      ) : (
        photo.author
      )}
      {" · "}
      {photo.licenseUrl ? (
        <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
          {photo.license}
        </a>
      ) : (
        photo.license
      )}
    </figcaption>
  );
}
