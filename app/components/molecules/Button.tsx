import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@/app/components/atoms";

type ButtonVariant = "primary" | "secondary" | "pill" | "cta" | "cta-active";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "h-s8 px-s7 gap-s7 bg-brand text-white rounded-pill",
  secondary:
    "h-s8 px-s6 gap-s6 bg-prim text-white rounded-pill",
  pill:
    "h-s8 pl-s5 pr-s6 gap-s5 bg-white/20 text-prim rounded-pill",
  cta:
    "h-s8 px-s7 gap-s7 bg-cta/20 text-prim rounded-pill",
  "cta-active":
    "h-s8 px-s7 gap-s7 bg-brand text-white rounded-pill",
};

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  rightIcon?: IconName;
  leftIcon?: IconName;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonAsButton | ButtonAsLink;

export function Button(props: Props) {
  const { variant = "primary", children, rightIcon, leftIcon, className = "", ...rest } = props;
  const cls = `inline-flex items-center justify-between font-body text-l1 cursor-pointer ${variantClass[variant]} ${className}`.trim();

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
