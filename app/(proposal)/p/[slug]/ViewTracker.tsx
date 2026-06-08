"use client";

import { useEffect, useRef } from "react";
import { markViewedAction } from "./actions";

/** Fires the "viewed" event exactly once when a client opens the proposal. */
export function ViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void markViewedAction(slug);
  }, [slug]);
  return null;
}
