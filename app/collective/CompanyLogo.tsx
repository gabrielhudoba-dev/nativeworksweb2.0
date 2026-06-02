"use client";

interface CompanyLogoProps {
  src: string;
  alt: string;
  dark?: boolean;
}

export function CompanyLogo({ src, alt, dark }: CompanyLogoProps) {
  return (
    <div className="w-full h-full relative">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const fallback = el.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className={`absolute inset-0 w-full h-full ${dark ? "bg-prim" : "bg-surface"}`}
        style={{ display: "none" }}
      />
    </div>
  );
}
