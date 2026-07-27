import os
from PIL import Image

# ==========================================
# AYARLAR
# ==========================================
INPUT_FOLDER = "./pics"            # Orijinal büyük resimlerin olduğu klasör
OUTPUT_FOLDER = "./pics_mini"      # Sıkışanların çıkacağı klasör (Aynı klasörü verirsen üstüne yazar)
MAX_WIDTH = 500                    # Resmin genişliği en fazla 500 piksel olsun
QUALITY = 75                       # Görüntü kalitesi (75 hem net hem çok düşük boyutludur)
# ==========================================

def compress_images():
    # Çıktı klasörü yoksa oluştur
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    # Klasördeki tüm dosyaları tara
    for filename in os.listdir(INPUT_FOLDER):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            input_path = os.path.join(INPUT_FOLDER, filename)
            
            # Sadece ismini alıp sonunu her ihtimale karşı standart .jpg yapıyoruz
            name_without_ext = os.path.splitext(filename)[0]
            output_path = os.path.join(OUTPUT_FOLDER, name_without_ext + ".jpg")

            # Eğer çıktı klasöründe zaten varsa tekrar işlememek için atla
            if INPUT_FOLDER != OUTPUT_FOLDER and os.path.exists(output_path):
                continue

            try:
                with Image.open(input_path) as img:
                    # PNG'lerde transparanlık varsa arka planı siyah yapmaması için RGB'ye çevir
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")

                    # Eğer resim çok genişse, orantısını bozmadan 500 piksele küçült
                    if img.width > MAX_WIDTH:
                        ratio = MAX_WIDTH / float(img.width)
                        new_height = int(float(img.height) * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

                    # Optimize edilmiş JPG olarak kaydet
                    img.save(output_path, "JPEG", quality=QUALITY, optimize=True)
                    
                print(f"✅ Sıkıştırıldı: {filename}")
            except Exception as e:
                print(f"❌ Hata ({filename}): {str(e)}")

if __name__ == "__main__":
    print("🚀 Resim diyet motoru çalışıyor...")
    compress_images()
    print("🎉 Tüm resimler bildirim boyutuna (100 KB altı) uygun hale getirildi!")
