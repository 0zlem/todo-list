"use server";

import { supabase } from "../lib/supabase";

export default async function addTodo(title: string) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error("Hata: Kullanıcı oturumu bulunamadı!", error);
    return null;
  }

  const user_id = data.user.id;

  console.log("Yeni Todo Ekleniyor:", { title, user_id });

  const { data: todoData, error: todoError } = await supabase
    .from("Todo")
    .insert([{ title, user_id }])
    .select();

  if (todoError) {
    console.error("Todo ekleme hatası:", todoError);
    return null;
  }

  console.log("Başarıyla eklendi:", todoData);
  return todoData[0];
}
