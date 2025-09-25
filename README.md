# Todo List Uygulaması

Bu proje, kullanıcıların kişisel görevlerini ve notlarını yönetebileceği bir **Todo List** uygulamasıdır. Kullanıcılar sisteme giriş yapabilir, not ve yapılacaklar listesi (todo) oluşturabilir, düzenleyebilir ve silebilir.

## Özellikler

- **Kullanıcı Girişi**: Supabase ile kullanıcı kayıt ve giriş sistemi.
- **Todo Yönetimi**: Kullanıcılar yapılacak görevler ekleyebilir, tamamlayabilir veya silebilir.
- **Not Yönetimi**: Görevlerle ilişkili veya bağımsız not ekleme ve düzenleme.
- **Bildirimler**: İşlem uyarıları ve toast mesajları (Radix UI Toast ile).
- **Form Doğrulama**: React Hook Form ve Zod ile kullanıcı giriş ve todo formları doğrulama.
- **Tema ve UI**: TailwindCSS ve Lucide React ile modern ve responsive arayüz.

## Kullanılan Teknolojiler

- **Next.js** – React tabanlı sunucu tarafı render ve frontend.
- **React** – Kullanıcı arayüzü.
- **TailwindCSS** – Stil ve layout yönetimi.
- **Supabase** – Kullanıcı kimlik doğrulama ve veri yönetimi.
- **Prisma** – Veritabanı ORM.
- **Radix UI** – UI bileşenleri (Label, Menubar, Toast vs.).
- **React Hook Form & Zod** – Form yönetimi ve doğrulama.
- **Bcryptjs** – Kullanıcı şifrelerinin güvenliği.
- **React JSON View** – JSON verilerini görselleştirme.
- **Class Variance Authority & clsx** – UI sınıflarının yönetimi.

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/todo-list.git
   cd todo-list
