import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@/app/components/atoms";

type ButtonVariant = "primary" | "secondary" | "pill";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "h-64 px-32 gap-32 bg-accent text-accent-fg rounded-pill",
  secondary:
    "h-48 px-24 gap-24 bg-prim text-fg-inverse rounded-pill",
  pill:
    "h-64 pl-16 pr-24 gap-16 bg-pill text-prim rounded-pill",
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
  const cls = `inline-flex items-center justify-between font-body text-cta transition-transform duration-300 ease-out hover:scale-[0.99] active:scale-[0.98] ${variantClass[variant]} ${className}`.trim();

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
