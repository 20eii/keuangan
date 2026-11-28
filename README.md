# Keuanganku v2.02 💰

Aplikasi pencatat keuangan pribadi — **1 file HTML, tanpa build, tanpa server, tanpa install**.
Buka, catat, selesai. Data tersimpan di HP masing-masing, bukan di server.

> 🔗 **Demo:** `https://USERNAME.github.io/NAMA-REPO/`
> Ganti `USERNAME` dan `NAMA-REPO` dengan username dan nama repo GitHub kamu.

[[Versi](https://img.shields.io/badge/versi-2.02-7c3aed)](CHANGELOG.md)
[[Lisensi](https://img.shields.io/badge/lisensi-MIT-green)](LICENSE)
[[File](https://img.shields.io/badge/file-1%20HTML-blue)](#)

---

## ✨ Fitur

| Kategori | Isinya |
|---|---|
| **Catat** | Pemasukan & pengeluaran, nominal + uraian, kategori custom |
| **Kategori** | Tambah, ganti nama, hapus kategori pemasukan/pengeluaran |
| **Scan QR** | Scan QRIS / QR kode pakai kamera, termasuk QRIS nominal tetap & dinamis |
| **Scan Nota** | Foto nota/struk → OCR, transaksi otomatis terisi dari hasil baca |
| **Anggaran** | Anggaran per kategori per bulan, dengan pengingat pemakaian |
| **Transaksi Rutin** | Jadwal berulang (mis. gaji, langganan) yang bisa dicatat massal |
| **Laporan** | Ringkasan bulan ini, bulan lalu, grafik kategori, Wawasan Keuangan |
| **Sinkronisasi** | Kirim & tarik transaksi ke Google Sheets lewat Apps Script (opsional) |
| **Backup** | Ekspor & pulihkan semua data sebagai file JSON |
| **Tampilan** | Mode gelap/terang, navbar liquid-glass (geser sentuh-tahan), header kaca transparan |

## 🚀 Cara Pakai

1. Buka link demo di atas (atau klik `index.html` di repo ini lalu **Download**).
2. Di HP: buka file-nya di browser (Chrome/Safari), lalu **Add to Home Screen** biar terasa kayak aplikasi.
3. Catat transaksi pertama lewat tombol **Catat** di navbar bawah.

### 📱 Install sebagai aplikasi (PWA)

Berkat `manifest.json` + `sw.js`, Keuanganku bisa di-install seperti aplikasi beneran:

- **Android (Chrome):** buka link demo → menu ⋮ → **Install app** / **Tambahkan ke Layar Utama**.
  Ikon "Rp" ungu-oranye muncul di Home Screen, aplikasinya kebuka fullscreen tanpa address bar.
- **iPhone (Safari):** tombol Share → **Add to Home Screen**.
- **Offline:** setelah sekali dibuka online, aplikasi tetap kebuka walau tanpa internet
  (datanya memang tersimpan lokal di HP). Scan QR/nota tetap butuh kamera + internet
  untuk sinkronisasi Sheets.

> 📷 **Catatan kamera:** fitur Scan QR & Scan Nota butuh akses kamera, jadi harus dibuka lewat **HTTPS**
> (link GitHub Pages sudah HTTPS ✅). Kalau dibuka lewat `file://`, kamera biasanya ditolak browser.

## 📂 Struktur Repo

```
.
├── index.html            ← APLIKASI UTAMA (buka file ini — ini yang ditampilkan GitHub Pages)
├── manifest.json         ← identitas PWA (nama, warna, ikon) — bikin aplikasi bisa di-install
├── sw.js                 ← Service Worker — bikin aplikasi bisa dibuka offline
├── icon-192.png          ← ikon aplikasi 192×192 (Home Screen / splash)
├── icon-192-minimal.png  ← ikon untuk apple-touch-icon (iPhone Add to Home Screen)
├── icon-512.png          ← ikon aplikasi 512×512
├── icon-maskable-512.png ← ikon maskable (Android, ikon full-bleed)
├── README.md             ← file ini
├── CHANGELOG.md          ← riwayat perubahan per versi
├── LICENSE               ← lisensi MIT
└── .gitignore            ← file yang tidak perlu ikut ke-upload (file backup, dll)
```

> `index.html` adalah salinan persis dari `kkk.html` versi 2.02. GitHub Pages menampilkan
> `index.html` secara otomatis, jadi file inilah yang di-upload.

## ⬆️ Cara Upload ke GitHub (lewat web, tanpa install apa-apa)

1. Buka [github.com/new](https://github.com/new) → isi **Repository name** (mis. `keuanganku`)
   → pilih **Public** → klik **Create repository**.
2. Di halaman repo, klik **uploading an existing file** (atau tombol **Add file → Upload files**).
3. Seret / pilih file-file ini dari HP/komputer: `index.html`, `manifest.json`, `sw.js`,
   `icon-192.png`, `icon-192-minimal.png`, `icon-512.png`, `icon-maskable-512.png`,
   `README.md`, `CHANGELOG.md`, `LICENSE`, `.gitignore` → klik **Commit changes**.
4. Aktifkan web-nya: **Settings → Pages** → di **Build and deployment**, Source pilih
   **Deploy from a branch** → Branch pilih **main** + folder **/ (root)** → **Save**.
5. Tunggu ±1 menit, lalu buka `https://USERNAME.github.io/NAMA-REPO/` — aplikasinya langsung jalan. 🎉

### Cara update ke versi baru

1. Upload ulang file yang berubah (biasanya `index.html` + `sw.js`) → timpa yang lama →
   **Commit changes** → GitHub Pages otomatis update sendiri dalam ±1 menit.
2. **Penting:** tiap rilis baru, naikkan angka `CACHE` di `sw.js`
   (mis. `'keuanganku-v2.02'` → `'keuanganku-v2.03'`) — kalau tidak, HP pengunjung
   bisa tetap membuka versi lama dari cache.
3. Versi yang tampil di aplikasi bisa dicek di halaman **Lainnya → Keamanan & Backup**
   (paling bawah kartu).

## 🔒 Privasi & Data

- Semua transaksi, kategori, profil, dan riwayat scan tersimpan di **`localStorage` browser HP kamu sendiri**.
  Repo ini **tidak** menerima, menyimpan, atau mengirim datamu ke mana pun.
- Sinkronisasi Google Sheets **opsional** dan hanya jalan kalau kamu sendiri yang mengisi URL Apps Script.
- File backup JSON berisi seluruh datamu — **jangan upload file backup ke repo publik** dan
  jangan bagikan ke orang lain. (`.gitignore` sudah memblokir pola nama file backup umum.)
- Tombol **Reset Transaksi** menghapus semua transaksi di HP itu saja, dan minta ketik `HAPUS`
  + hitung mundur 10 detik sebagai pengaman.

## 🛠️ Teknologi

- HTML + CSS + JavaScript murni (vanilla, tanpa framework, tanpa build step)
- `localStorage` untuk penyimpanan lokal
- `jsQR` untuk scan QR, OCR untuk baca nota
- Google Apps Script (opsional) sebagai jembatan ke Google Sheets

## 📝 Changelog

Lihat riwayat lengkapnya di [CHANGELOG.md](CHANGELOG.md). Versi terbaru: **2.02** (28 November 2026).

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi MIT — lihat [LICENSE](LICENSE).
