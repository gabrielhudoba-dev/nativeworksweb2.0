import Image from "next/image";

type AvatarSize = 32 | 48 | 64 | 80;

const sizeClass: Record<AvatarSize, string> = {
  32: "size-s7",
  48: "size-s8",
  64: "size-s8",
  80: "size-s9",
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
