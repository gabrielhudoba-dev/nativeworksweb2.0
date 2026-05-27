import { Heading, Text } from "@/app/components/atoms";
import { Refer } from "./Refer";

type Props = {
  value: string;
  label: string;
  refer?: { name: string; role: string; avatar: string };
};

export function StatColumn({ value, label, refer }: Props) {
  return (
    <div className="flex flex-col gap-s4">
      <Heading variant="numb1">{value}</Heading>
      <Text variant="p3" className="max-w-[300px]">{label}</Text>
      {refer && (
        <div className="mt-s5">
          <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
        </div>
      )}
    </div>
  );
}
