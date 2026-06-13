import { Heading, Text } from "@/app/components/atoms";
import { Refer } from "./Refer";

type Props = {
  value: string;
  label: string;
  refer?: { name: string; role: string; avatar: string };
};

export function StatColumn({ value, label, refer }: Props) {
  return (
    <div className="flex flex-col">
      <Heading variant="numb1">{value}</Heading>
      <Text variant="p2" className="max-w-pill mt-s3 pr-s3">{label}</Text>
      {refer && (
        <div className="mt-s3">
          <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
        </div>
      )}
    </div>
  );
}
