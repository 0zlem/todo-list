"use server";

import { supabase } from "../lib/supabase";

export default async function addNote(content: string, todoId: number) {
  if (!content || isNaN(todoId)) return null;

  const { data, error } = await supabase
    .from("Note")
    .insert([{ content, todoId }])
    .select();

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  return data[0];
}
