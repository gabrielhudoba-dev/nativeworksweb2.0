type Props = {
  className?: string;
};

export function Divider({ className = "" }: Props) {
  return <hr className={`h-px w-full border-0 bg-prim/10 ${className}`.trim()} />;
}
