import { ReactNode } from "react";
import { Text } from "./Text";

type BadgeVariant = "ai";

const variantClass: Record<BadgeVariant, string> = {
  ai: "bg-danger text-danger-fg",
};

type Props = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

export function Badge({ variant = "ai", children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center px-s3 py-s3 rounded-sm ${variantClass[variant]} ${className}`.trim()}
    >
      <Text variant="badge" as="span">
        {children}
      </Text>
    </span>
  );
}
