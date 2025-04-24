"use server";

import { supabase } from "../lib/supabase";

export default async function deleteTodo(id: number) {
  if (isNaN(id)) return false;

  const { error } = await supabase.from("Todo").delete().eq("id", id);

  if (error) {
    console.error("Supabase error:", error);
    return false;
  }
  return true;
}
