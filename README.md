# Quiz App 🎯

## Proje Hakkında
Quiz App, kullanıcıların interaktif bir şekilde quiz sorularını yanıtlayabilecekleri modern bir web uygulamasıdır. Uygulama, kullanıcı dostu arayüzü ve anlık geri bildirim özellikleriyle etkileşimli bir öğrenme deneyimi sunar.

## Özellikler ✨
- Çoktan seçmeli soru formatı
- Anlık doğru/yanlış geri bildirimi
- Soru ilerleme göstergesi
- Modern ve responsive tasarım
- Bootstrap tabanlı temiz arayüz

## Teknolojiler 🛠
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.3
- Bootstrap Icons 1.11.3

## Proje Yapısı 📁
```
Quiz App/
├── css/
│   └── style.css
├── js/
│   ├── app.js      # Ana uygulama mantığı
│   ├── quiz.js     # Quiz sınıfı ve metodları
│   ├── soru.js     # Soru sınıfı tanımlamaları
│   └── ui.js       # Kullanıcı arayüzü işlemleri
└── index.html      # Ana HTML dosyası
```

## Kurulum 🚀
1. Projeyi bilgisayarınıza klonlayın
2. `index.html` dosyasını modern bir web tarayıcısında açın

## Kullanım 📝
- Uygulama başlatıldığında ilk soru otomatik olarak yüklenir
- Her soru için dört seçenek sunulur (a, b, c, d)
- Bir seçenek seçildiğinde doğru/yanlış olduğu anında gösterilir
- İleri butonuyla bir sonraki soruya geçilebilir
- Quiz bitiminde sonuçlar görüntülenir

## Teknik Detaylar 🔧

### Quiz Sınıfı
Soru listesini ve mevcut soru indeksini yönetir. Temel özellikleri:
- Soru listesi yönetimi
- Mevcut soru takibi
- Soru getirme fonksiyonları

### UI Sınıfı
Kullanıcı arayüzü etkileşimlerini yönetir:
- Soru gösterimi
- Seçenek işlemleri
- Doğru/yanlış ikonları
- İlerleme göstergesi

### Soru Sınıfı
Her bir sorunun yapısını tanımlar:
- Soru metni
- Seçenekler
- Doğru cevap
- Cevap kontrolü

## Katkıda Bulunma 🤝
Yeni özellikler eklemek veya hataları düzeltmek için pull request gönderebilirsiniz.
