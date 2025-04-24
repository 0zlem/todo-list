import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ message: "Çıkış yapıldı!" });
}
