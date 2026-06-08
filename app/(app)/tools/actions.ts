"use server";

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
