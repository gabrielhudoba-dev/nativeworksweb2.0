"use client";

import { Icon } from "@/app/components/atoms";

type Props = {
  locked: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  onClick,
  disabled,
  label,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: "chevron-left" | "chevron-right" | "close";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid place-items-center size-s4 rounded-md text-prim/50 hover:bg-prim/8 hover:text-prim disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
    >
      <Icon name={icon} size="sm" />
    </button>
  );
}

/** Per-block hover frame with reorder / delete controls. */
export function BlockFrame({ locked, isFirst, isLast, onMoveUp, onMoveDown, onDelete, children }: Props) {
  return (
    <div className="group relative -mx-s3 px-s3 py-s2 rounded-lg hover:bg-prim/[0.015] transition-colors">
      {/* Toolbar */}
      <div className="absolute -top-s1 right-s3 z-20 flex items-center gap-[2px] p-[3px] rounded-md bg-white border border-prim/10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rotate-90">
          <ToolbarButton onClick={onMoveUp} disabled={isFirst} label="Move up" icon="chevron-left" />
        </div>
        <div className="rotate-90">
          <ToolbarButton onClick={onMoveDown} disabled={isLast} label="Move down" icon="chevron-right" />
        </div>
        {!locked && (
          <>
            <span className="w-px h-s2 bg-prim/10 mx-[2px]" />
            <ToolbarButton onClick={onDelete} label="Delete block" icon="close" />
          </>
        )}
      </div>

      {locked && (
        <span className="absolute -top-[6px] left-s3 z-10 inline-flex items-center h-[18px] px-s1 rounded-pill bg-prim/5 font-body font-medium text-[10px] uppercase tracking-wide text-prim/35 opacity-0 group-hover:opacity-100 transition-opacity">
          Locked
        </span>
      )}

      {children}
    </div>
  );
}
