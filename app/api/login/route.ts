import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const { data: user, error: userError } = await supabase
      .from("User")
      .select("email")
      .eq("username", username)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json({ message: "Giriş başarılı!" });
  } catch (error) {
    console.log(error);
  }
}
