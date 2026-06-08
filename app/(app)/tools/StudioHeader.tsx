"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Logo, Icon } from "@/app/components/atoms";
import { logout } from "./actions";

const AVATAR_COLORS = [
  "#E07B54", "#5E81AC", "#A3BE8C", "#B48EAD",
  "#EBCB8B", "#88C0D0", "#BF616A", "#8FBCBB",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name[0].toUpperCase();
}

function Avatar({ name, avatar, size }: { name: string; avatar: string | null; size: number }) {
  const fontSize = size <= 24 ? 11 : 13;
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0 select-none"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex items-center justify-center rounded-full text-white font-body font-semibold select-none flex-shrink-0"
      style={{ width: size, height: size, fontSize, background: avatarColor(name) }}
    >
      {initials(name)}
    </span>
  );
}

export function StudioHeader({ name, avatar }: { name: string | null; avatar: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-s9 px-s4 bg-surface/80 backdrop-blur border-b border-prim/8">
      <a href="/tools">
        <Logo size="sm" />
      </a>

      {name && (
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-s1 rounded-md px-s2 py-1 hover:bg-prim/5 transition-colors cursor-pointer"
          >
            <Avatar name={name} avatar={avatar} size={24} />
            <span className="font-body text-l2 text-prim/70">{name}</span>
            <Icon name="chevron-down" className="w-[14px] h-[14px] text-prim/40 ml-0.5" aria-hidden />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-prim/10 bg-white shadow-xl overflow-hidden z-50">
              {/* Account row */}
              <div className="flex items-center gap-[10px] px-3 py-[10px]">
                <Avatar name={name} avatar={avatar} size={32} />
                <span className="font-body text-l2 text-prim truncate">{name}</span>
              </div>

              <div className="border-t border-prim/8 mx-1" />

              {/* Log out */}
              <button
                type="button"
                onClick={() => logout()}
                className="w-full text-left px-3 py-[10px] font-body text-l2 text-prim/50 hover:bg-prim/5 hover:text-prim transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
