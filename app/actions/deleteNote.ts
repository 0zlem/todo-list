"use server";

import { supabase } from "../lib/supabase";

export default async function deleteNote(id: number) {
  if (isNaN(id)) return false;

  const { error } = await supabase.from("Note").delete().eq("id", id);

  if (error) {
    console.error("Supabase error:", error);
    return false;
  }
  return true;
}
