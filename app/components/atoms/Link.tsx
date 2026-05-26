import NextLink from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export function Link({ href, children, className = "", ...rest }: Props) {
  const cls =
    `font-body text-l2 text-prim underline underline-offset-2 hover:no-underline ${className}`.trim();
  const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} className={cls} {...rest}>
      {children}
    </NextLink>
  );
}
