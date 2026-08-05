# Proje Kuralları

- **Dağıtım (Deploy) Kuralı:** Kullanıcı açıkça "deploy et", "canlıya al" veya "yayına al" talimatı vermedikçe hiçbir şekilde `firebase deploy` veya canlıya alma komutları çalıştırma. Tüm değişiklikleri yalnızca yerel ortamda test et ve kullanıcı onayına sun.
- **Mobil Uyumluluk Kuralı:** Yapılan tüm tasarım ve UI/UX değişiklikleri istisnasız mobil (telefon/tablet) ekran boyutlarına da tam uyumlu (responsive) olacak şekilde uygulanmalıdır. Mobil görünümler ve touch friendly bileşenler her aşamada kontrol edilmelidir.
- **Veri Senkronizasyonu ve Mobil Veri Kuralı:** Yapılan tüm veri değişiklikleri, state güncellemeleri ve Firebase/veritabanı işlemleri mobil cihazlarda da eş zamanlı ve kesintisiz yansıyacak şekilde (real-time listeners / responsive data binding) kurgulanmalıdır. Mobil ekranlarda veri eksikliği, önbellek takılması veya senkronizasyon hatası oluşmaması için gerekli önlemler alınmalıdır.


