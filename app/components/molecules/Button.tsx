import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@/app/components/atoms";

type ButtonVariant = "primary" | "secondary" | "dark";

const BASE = "h-s6 px-s3 gap-s4 rounded-pill";

const variantClass: Record<ButtonVariant, string> = {
  primary:   `${BASE} bg-brand text-white`,
  secondary: `${BASE} bg-cta/20 text-prim`,
  dark:      `h-s8 px-s3 gap-s4 rounded-pill bg-accent text-white`,
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  children: ReactNode;
  rightIcon?: IconName;
  leftIcon?: IconName;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonAsButton | ButtonAsLink;

export function Button(props: Props) {
  const { variant = "primary", size, children, rightIcon, leftIcon, className = "", ...rest } = props;
  const sizeOverride = size === "lg" ? "h-s8" : "";
  const cls = `inline-flex items-center justify-between font-body text-l1 cursor-pointer disabled:cursor-default ${variantClass[variant]} ${sizeOverride} ${className}`.trim().replace(/\s+/g, " ");

  const inner = (
    <>
      {leftIcon && <Icon name={leftIcon} size="md" />}
      <span className="whitespace-nowrap">{children}</span>
      {rightIcon && <Icon name={rightIcon} size="md" />}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
