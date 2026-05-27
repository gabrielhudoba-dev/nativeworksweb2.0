import { Avatar } from "@/app/components/atoms/Avatar";
import { Text } from "@/app/components/atoms/Text";

type Props = {
  name: string;
  role: string;
  avatar?: string;
  className?: string;
};

export function Attribution({ name, role, avatar, className }: Props) {
  return (
    <div className={`flex items-center gap-s5${className ? ` ${className}` : ""}`}>
      {avatar ? (
        <Avatar src={avatar} alt={name} size={48} />
      ) : (
        <span className="size-s8 rounded-pill bg-surface shrink-0 inline-block" />
      )}
      <div className="flex flex-col gap-0">
        <Text variant="l2" as="span">{name}</Text>
        <Text variant="l3" as="span">{role}</Text>
      </div>
    </div>
  );
}
