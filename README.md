# FlowBoard — Kanban Proje Yönetim Uygulaması
Next.js 14, Supabase ve dnd-kit kullanılarak geliştirilmiş, gerçek zamanlı veri senkronizasyonuna sahip görev yönetim sistemidir.

# Proje Bağlantıları
Canlı Uygulama: https://kanban-app.vercel.app

Kaynak Kod: https://github.com/leylashikhzaman/kanban-app

Test Hesabı: demo@flowboard.com / Demo1234

Teknik Yığın (Tech Stack)
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS

Backend & Veritabanı: Supabase (PostgreSQL), Row Level Security (RLS)

Sürükle-Bırak: dnd-kit (@dnd-kit/core, @dnd-kit/sortable)

Deployment: Vercel

Proje Dizini Yapısı
Plaintext
src/
├── app/                # Next.js App Router (Sayfalar ve Layout)
├── components/         # Kanban Board, Column ve Card bileşenleri
│   ├── kanban/         # Sürükle-bırak mantığının yönetildiği ana bileşenler
│   └── ui/             # Temel arayüz elemanları
├── hooks/              # Veri çekme ve sürükle-bırak sensör hookları
├── lib/                # Supabase istemcisi ve yardımcı fonksiyonlar
├── services/           # Veritabanı CRUD operasyonları
└── types/              # TypeScript arayüz tanımlamaları (Board, Column, Card)
Teknik Uygulama Detayları
1. Sürükle-Bırak ve Kütüphane Seçimi
Projede dnd-kit tercih edilmiştir. Bu seçimin temel nedenleri:

Modülerlik: Sadece gerekli sensörlerin (@dnd-kit/core) yüklenmesiyle düşük bundle boyutu sağlanmıştır.

Mobil Uyumluluk: PointerSensor kullanımı sayesinde mobil cihazlarda touch eventleri sorunsuz işlenmektedir.

Erişilebilirlik: Klavye desteği ve ekran okuyucu uyumluluğu yerleşiktir.

2. Sıralama ve Veri Tutarlılığı
Sayfa yenilendiğinde sıralamanın korunması için şu mimari izlenmiştir:

Her kart position (integer) değerine sahiptir.

Sürükleme işlemi bittiğinde (onDragEnd), etkilenen kartların yeni pozisyonları asenkron olarak Supabase üzerinde güncellenir.

Veritabanı seviyesinde ORDER BY position ASC sorgusuyla her zaman tutarlı dizilim sağlanır.

3. Mobil Kullanıcı Deneyimi
Mobil cihazlarda scroll (kaydırma) ve drag (sürükleme) işlemlerinin karışmaması için activationConstraint uygulanmıştır:

Kullanıcının parmağı 5px hareket etmeden sürükleme tetiklenmez.

Sütunlar için yatay scroll yapısı kurgulanarak küçük ekranlarda kullanım kolaylığı artırılmıştır.

4. Güvenlik ve Veri Modeli
Auth: Supabase Auth ile kullanıcı bazlı oturum yönetimi sağlanmaktadır.

RLS: PostgreSQL Row Level Security politikaları sayesinde, bir kullanıcı asla başka bir kullanıcının board veya kart verisine erişemez.

Temel Özellikler
Oturum Yönetimi: E-posta/Şifre ile kayıt ve giriş.

Dinamik Yönetim: Sınırsız board, sütun ve kart oluşturma/silme.

Görsel İpuçları: Sürükleme sırasında gölge ve renk değişimi ile kullanıcı geri bildirimi.

Etiket Sistemi: Geliştirme, Tamamlandı, Bekliyor ve Acil durum etiketleri.

Yerel Kurulum
Bash
# Depoyu klonlayın
git clone https://github.com/leylashikhzaman/kanban-app.git

# Bağımlılıkları yükleyin
npm install

# Geliştirme ortamını başlatın
npm run dev

Hazırlayan: Leyla Shikhzaman | Staj Başvurusu | 2026
