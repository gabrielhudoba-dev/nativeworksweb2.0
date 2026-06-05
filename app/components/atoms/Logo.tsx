import Image from "next/image";

const SIZES = {
  sm: { width: 98, height: 36 },
  md: { width: 145, height: 55 },
} as const;

type Props = {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = "md", className, priority }: Props) {
  const { width, height } = SIZES[size];
  return (
    <Image
      src="/images/nativeWorksLogoFull.svg"
      alt="Native Works"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
