import type { Photo, TourType } from "@/lib/types";
import Diorama from "./Diorama";
import PhotoDiorama from "./PhotoDiorama";

/**
 * Picks the best visual for a destination:
 * a rendered 3D scene (sceneImage) → the real photo on a 3D slab → the illustrated diorama.
 */
export default function SceneVisual({
  type,
  name,
  sceneImage,
  photo,
  priority,
  compact,
  sizes,
  showCredit,
}: {
  type: TourType;
  name: string;
  sceneImage?: string;
  photo?: Photo;
  priority?: boolean;
  compact?: boolean;
  sizes?: string;
  showCredit?: boolean;
}) {
  if (sceneImage) return <Diorama type={type} image={sceneImage} alt={`3D scene of ${name}`} />;
  if (photo)
    return <PhotoDiorama photo={photo} type={type} priority={priority} compact={compact} sizes={sizes} showCredit={showCredit} />;
  return <Diorama type={type} alt={`Illustrated scene of ${name}`} />;
}
