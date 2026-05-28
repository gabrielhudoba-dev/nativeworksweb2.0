import { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "@/app/components/atoms";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
};

export function IconButton({ icon, label, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`size-s3 flex items-center justify-center shrink-0 text-prim ${className}`.trim()}
      {...rest}
    >
      <Icon name={icon} size="md" />
    </button>
  );
}
