import type { FigmaUser } from "$lib/figma/types";
import { writable } from "svelte/store";

export const auth = writable<FigmaUser & { accessToken: string } | null>(null);

export function logout() {
  auth.set(null);
}

export const isLoggedIn = auth.subscribe((user) => {
  return !!user;
});
