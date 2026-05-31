import Image from "next/image";

type AvatarSize = 32 | 48 | 64 | 72 | 80 | 128;

const sizeClass: Record<AvatarSize, string> = {
  32:  "size-s4",   /* 32px */
  48:  "size-s6",   /* 48px */
  64:  "size-s8",   /* 64px */
  72:  "size-s9",   /* 72px = 3×24 */
  80:  "size-s10",  /* 80px */
  128: "size-s16",  /* 128px */
};

type Props = {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt, size = 48, className = "" }: Props) {
  return (
    <span
      className={`relative inline-block rounded-pill overflow-hidden shrink-0 ${sizeClass[size]} ${className}`.trim()}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}
