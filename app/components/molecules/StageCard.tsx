import { Heading, Text } from "@/app/components/atoms";

type Props = {
  title: string;
  desc: string;
};

export function StageCard({ title, desc }: Props) {
  return (
    <div className="bg-surface rounded-lg flex flex-col justify-end gap-s6 pt-s6 pb-s8 px-s6 w-[300px] h-[300px] snap-start shrink-0">
      <Heading variant="h3">{title}</Heading>
      <Text variant="p3">{desc}</Text>
    </div>
  );
}
