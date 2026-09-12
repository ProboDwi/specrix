# AI-Assisted Data Sourcing Pipeline

Pipeline ini digunakan untuk mengumpulkan data spesifikasi gadget menggunakan AI + web search, kemudian menyimpannya ke database.

## Prinsip Utama

> **AI tidak boleh menjawab dari memori saja.** Selalu gunakan web search tool untuk mengambil data dari sumber resmi, bukan generate dari training data.

## Alur Kerja

```
Sumber resmi (GSMArena, situs brand, spec sheet)
        ↓
AI + web search → ekstrak ke JSON sesuai schema.ts
        ↓
Validasi manual (spot-check field kritis: baterai, kamera, harga)
        ↓
Import ke database via script
```

## Cara Menjalankan (Masa Depan)

1. Buat file daftar device yang ingin ditambahkan (`devices-to-add.txt`)
2. Jalankan script sourcing (belum dibuat — butuh Gemini API key + web search):
   ```bash
   npx tsx lib/ai-sourcing/fetch-specs.ts devices-to-add.txt
   ```
3. Review output JSON di `lib/ai-sourcing/output/`
4. Jalankan import ke database:
   ```bash
   npx tsx lib/ai-sourcing/import.ts lib/ai-sourcing/output/
   ```

## Schema Output

Setiap device harus menghasilkan JSON yang sesuai dengan interface di `schema.ts`:

```json
{
  "name": "Samsung Galaxy S25",
  "brand": "samsung",
  "category": "HP",
  "priceIdr": 13999000,
  "shortDesc": "Flagship terbaru Samsung dengan Snapdragon 8 Elite...",
  "sourceUrl": "https://www.gsmarena.com/samsung_galaxy_s25-12345.php",
  "crossCheckUrl": "https://www.samsung.com/id/smartphones/galaxy-s/galaxy-s25/",
  "specs": {
    "chipset": "Snapdragon 8 Elite",
    "ram": "12 GB",
    "storage": "256 GB",
    ...
  }
}
```

## Field Kritis (Wajib Cross-Check)

- `priceIdr` — harga sering berubah, cek minimal 2 sumber (GSMArena + official store)
- `battery.capacity` — penting untuk keputusan pembelian
- `chipset` / `cpu` — core selling point, jangan salah
- `rearCamera` / `frontCamera` — sering menjadi keputusan utama pembeli

## Sumber Referensi

1. **GSMArena** (https://www.gsmarena.com) — database HP terlengkap
2. **Situs resmi brand** (samsung.com, xiaomi.com, dll)
3. **Nanoreview** (https://nanoreview.net) — untuk spec comparison
4. **Notebookcheck** (https://www.notebookcheck.net) — untuk laptop

## Metadata yang Wajib Diisi

Setiap gadget di database harus memiliki:
- `source_url` — URL utama sumber data
- `last_verified_date` — tanggal terakhir diverifikasi
