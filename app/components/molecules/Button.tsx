import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "@/app/components/atoms";

type ButtonVariant = "primary" | "secondary";

const BASE = "h-s8 px-s6 gap-s7 rounded-pill";

const variantClass: Record<ButtonVariant, string> = {
  primary:   `${BASE} bg-brand text-white`,
  secondary: `${BASE} bg-cta/20 text-prim`,
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
