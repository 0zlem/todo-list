import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullname, username, email, password } = await req.json();

    if (!fullname || !username || !email || !password) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    console.log("Gelen veri:", { fullname, username, email, password });

    const { data: existingUser } = await supabase
      .from("User")
      .select("*")
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta veya kullanıcı adı zaten mevcut" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("User")
      .insert([{ fullname, username, email, password: hashedPassword }]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu.", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulamadı, sunucu hatası." },
      { status: 500 }
    );
  }
}
