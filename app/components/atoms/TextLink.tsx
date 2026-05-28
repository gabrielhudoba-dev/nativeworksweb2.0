import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const CLS = "font-body font-normal text-p3 text-prim underline underline-offset-8 translate-y-[5.5px] hover:opacity-60 transition-opacity w-fit";

type AsLink = { href: string; children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
type AsButton = { href?: undefined; children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>;

type Props = AsLink | AsButton;

export function TextLink({ children, className = "", ...rest }: Props) {
  const cls = `${CLS} ${className}`.trim();

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AsLink;
    return (
      <Link href={href} className={cls} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={`${cls} border-none bg-transparent p-0`} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
