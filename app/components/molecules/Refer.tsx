import { Avatar } from "@/app/components/atoms/Avatar";
import { Text } from "@/app/components/atoms/Text";

type Props = {
  name: string;
  role: string;
  avatar?: string;
  className?: string;
};

export function Refer({ name, role, avatar, className }: Props) {
  return (
    <div className={`flex items-start gap-s2${className ? ` ${className}` : ""}`}>
      {avatar ? (
        <Avatar src={avatar} alt={name} size={48} className="translate-y-[5.5px]" />
      ) : (
        <span className="size-s7 rounded-pill bg-surface shrink-0 inline-block translate-y-[5.5px]" />
      )}
      <div className="flex flex-col gap-0">
        <Text variant="l2" as="span">{name}</Text>
        <Text variant="l2" as="span" className="font-normal">{role}</Text>
      </div>
    </div>
  );
}
