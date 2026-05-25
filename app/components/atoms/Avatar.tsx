import Image from "next/image";

type AvatarSize = 32 | 48 | 64 | 80;

const sizeClass: Record<AvatarSize, string> = {
  32: "size-32",
  48: "size-48",
  64: "size-64",
  80: "size-80",
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
