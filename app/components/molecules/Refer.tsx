import { Avatar } from "@/app/components/atoms/Avatar";
import { Text } from "@/app/components/atoms/Text";

type Props = {
  name: string;
  role: string;
  avatar?: string;
  showName?: boolean;
  className?: string;
};

export function Refer({ name, role, avatar, showName = true, className }: Props) {
  const centered = !showName;
  return (
    <div className={`flex ${centered ? "items-center" : "items-start"} gap-s2${className ? ` ${className}` : ""}`}>
      {avatar && (avatar.startsWith("/") || avatar.startsWith("http")) ? (
        <Avatar src={avatar} alt={name} size={48} className={centered ? "" : "translate-y-[5.5px]"} />
      ) : (
        <span className={`size-s7 rounded-pill bg-surface shrink-0 inline-block${centered ? "" : " translate-y-[5.5px]"}`} />
      )}
      <div className="flex flex-col gap-0">
        {showName && <Text variant="l2" as="span">{name}</Text>}
        <Text variant="l2" as="span" className={`whitespace-nowrap${showName ? " font-normal" : ""}`}>{role}</Text>
      </div>
    </div>
  );
}
