# NuCorpus

**Nükleer Acil Durum Alanı için LLM İnce Ayar Veri Seti Oluşturma Aracı**

[简体中文](./README.zh-CN.md) | [English](./README.md) | [Türkçe](./README.tr.md)

## Genel Bakış

NuCorpus, özellikle nükleer acil durum gibi dikey alanlar için Büyük Dil Modelleri (LLM) ince ayar veri setleri oluşturmak üzere tasarlanmış bir uygulamadır. Belge yükleme, akıllı bölme, soru/cevap üretimi ve veri seti dışa aktarma gibi eksiksiz bir iş akışı sunar.

## Özellikler

- **Akıllı Belge İşleme**: PDF, Markdown, DOCX, EPUB, TXT formatları desteği
- **Akıllı Metin Bölme**: Çoklu bölme algoritmaları + özelleştirilebilir görsel segmentasyon
- **Akıllı Soru Üretimi**: Metin parçalarından ilgili soruları çıkarır, nükleer acil durum senaryoları desteği
- **Alan Etiketleri**: Global alan etiket ağacını akıllıca oluşturur
- **Cevap Üretimi**: LLM API kullanarak cevaplar ve Düşünce Zinciri (COT) üretir
- **Esnek Düzenleme**: Herhangi bir aşamada soruları, cevapları ve veri setlerini düzenleyin
- **Çoklu Dışa Aktarma Formatları**: Alpaca, ShareGPT, multilingual-thinking (JSON/JSONL)
- **Geniş Model Desteği**: OpenAI formatı LLM API, Ollama, 智谱AI, OpenRouter
- **Bilgi Grafiği (İsteğe Bağlı)**: Üçlü çıkarma ve Neo4j entegrasyonu

## Yerel Çalıştırma

### pnpm ile Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Veritabanını başlat
pnpm db:push

# Geliştirme sunucusunu başlat
pnpm dev
```

Tarayıcıda `http://localhost:1717` adresine gidin.

### Docker ile

```bash
docker-compose up -d
```

Tarayıcıda `http://localhost:1717` adresine gidin.

## Kullanım

### 1. Proje Oluşturma

Ana sayfada "Proje Oluştur"a tıklayın, proje adını ve açıklamasını girin, LLM API ayarlarını yapılandırın.

### 2. Belge İşleme

"Metin Bölme" sayfasında dosya yükleyin (PDF, Markdown, DOCX, TXT), otomatik bölünmüş metin parçalarını görüntüleyin ve ayarlayın.

### 3. Soru Üretimi

Metin bloklarına dayalı toplu soru oluşturun, etiket ağacını kullanarak soruları düzenleyin.

### 4. Veri Seti Oluşturma

Sorulara dayalı toplu cevap üretin, üretilen cevapları görüntüleyin, düzenleyin ve optimize edin.

### 5. Veri Seti Dışa Aktarma

Dışa aktarma formatını (Alpaca/ShareGPT/multilingual-thinking) ve dosya formatını (JSON/JSONL) seçin, özel sistem istemi ekleyin ve dışa aktarın.

## Teknoloji Yığını

- **Frontend**: Next.js 14 (App Router), React 18, Material-UI v5
- **Backend**: Node.js, Prisma ORM, SQLite
- **Masaüstü**: Electron
- **i18n**: i18next (Çince, İngilizce, Türkçe)

## Lisans

Bu proje AGPL 3.0 Lisansı altındadır.
