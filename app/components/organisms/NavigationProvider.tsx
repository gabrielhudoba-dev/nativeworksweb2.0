"use client";

import { useState, createContext, useContext } from "react";

type NavCtx = { open: boolean; setOpen: (v: boolean | ((p: boolean) => boolean)) => void };

export const NavContext = createContext<NavCtx>({ open: false, setOpen: () => {} });

export function useNavOpen() { return useContext(NavContext).open; }
export function useNavContext() { return useContext(NavContext); }

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <NavContext.Provider value={{ open, setOpen }}>{children}</NavContext.Provider>;
}
