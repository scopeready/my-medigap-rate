import { PHOTOS, type PhotoKey } from "@/lib/photos";

/**
 * A responsive photograph from `lib/photos.ts`.
 *
 * Plain <img> with a 1x/2x srcset rather than next/image: the files are
 * already sized WebP, so there is nothing for an optimiser to do, and the
 * explicit width and height stop the page jumping as it loads.
 *
 * `variant="banner"` is the wide, cropped strip under a page's lede;
 * `"inset"` fills whatever box it is placed in.
 */
export function Photo({
  id,
  variant = "inset",
  priority = false,
  sizes,
  className,
}: {
  id: PhotoKey;
  variant?: "banner" | "inset";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const p = PHOTOS[id];
  const src = `/img/${p.name}.webp`;
  return (
    <img
      className={["photo", `photo--${variant}`, className].filter(Boolean).join(" ")}
      src={src}
      srcSet={`${src} ${p.width}w, /img/${p.name}@2x.webp ${p.width * 2}w`}
      sizes={sizes ?? (variant === "banner" ? "(min-width: 1080px) 1040px, 100vw" : "(min-width: 940px) 440px, 100vw")}
      width={p.width}
      height={p.height}
      alt={p.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
