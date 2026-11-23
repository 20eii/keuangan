# Keuanganku

Aplikasi pencatat keuangan pribadi (PWA) — catat pemasukan & pengeluaran, simpan lokal, lalu sinkron ke Google Sheets.

[Icon Keuanganku](icon-512-minimal.png)

## Fitur

- **Transaksi** — pemasukan / pengeluaran, nominal, uraian (kategori tersimpan + uraian baru)
- **Saldo efektif** — total masuk, total keluar, rata-rata keluar per bulan, tombol mata untuk sembunyikan saldo
- **Riwayat** — filter semua / masuk / keluar, hapus transaksi, status sync per transaksi
- **Profil** — nama pemilik + warna avatar, tampil di sapaan & avatar
- **Kategori** — tambah / ganti nama / hapus kategori per tipe
- **Scan QRIS** — scan kode QRIS via kamera (BarcodeDetector) atau dari foto, plus scan nota
- **Sync Google Sheets** — kirim transaksi belum tersinkron via Apps Script, tarik transaksi dari Sheets, tes koneksi
- **Backup / Restore** — ekspor JSON (share / unduh / salin), pulihkan dari file backup
- **PWA / Offline** — bisa di-install ke home screen, jalan offline via Service Worker
- **Anti-copy & anti-zoom** — teks halaman tidak bisa di-blok / di-copy, pinch & double-tap zoom dimatikan (input tetap bisa diketik)

## Struktur File

| File | Deploy sebagai | Keterangan |
| --- | --- | --- |
| `index-fixed.html` | `index.html` | Aplikasi utama (HTML + CSS + JS) |
| `sw-fixed.js` | `sw.js` | Service Worker, cache `keuanganku-v16` |
| `manifest-fixed.json` | `manifest.json` | Manifest PWA |
| `icon-192-minimal.png` | `icon-192-minimal.png` | Icon 192, purpose `any` |
| `icon-512-minimal.png` | `icon-512-minimal.png` | Icon 512, purpose `any` |
| `icon-192-minimal-maskable.png` | `icon-192-minimal-maskable.png` | Icon 192, purpose `maskable` (safe-zone) |
| `icon-512-minimal-maskable.png` | `icon-512-minimal-maskable.png` | Icon 512, purpose `maskable` (safe-zone) |
| `rp-minimal-transparent.png` | (opsional) | Pill `Rp` transparan, untuk dipakai di tempat lain |

Semua file harus satu folder. Jangan ubah nama file icon — `manifest.json` & `sw.js` sudah menunjuk ke nama file di atas.

## Cara Deploy

1. Rename file sesuai kolom "Deploy sebagai" di atas.
2. Upload semua file ke hosting yang sama (HTTPS wajib untuk PWA & kamera).
3. Buka `https://domain-lu/index.html` di HP, lalu **Add to Home Screen / Install**.
4. Kalau PWA lama sudah pernah ter-install: **uninstall dulu**, baru install lagi — biar icon & cache lama kehapus.

## Cara Update Berikutnya

Setiap kali mengubah `index.html` / `manifest.json` / icon:

1. Naikkan versi di `sw.js`: `CACHE = "keuanganku-v17"`, dst.
2. Samakan versi register di `index.html`: `navigator.serviceWorker.register("./sw.js?v=17")`.
3. Upload `index.html` + `sw.js` (+ file yang berubah) bersamaan — jangan dicicil, biar tidak ada versi campur.

## Konfigurasi Google Sheets

1. Buat Google Apps Script dengan endpoint `.../exec` yang menerima:
   - `POST` data CSV satu transaksi per baris (`tanggal,masuk,keluar,keterangan`), dan
   - `GET ?action=list&callback=...` yang mengembalikan daftar transaksi (JSONP).
2. Di aplikasi, buka **Lainnya → URL Sheets**, isi URL `https://script.google.com/macros/s/.../exec`.
3. Tekan **Tes Koneksi**, lalu **Sinkron** / **Tarik dari Sheets**.

> Catatan: pengiriman memakai iframe (cross-origin), jadi "terkirim" artinya form terkirim — bukan konfirmasi dari Sheets. Setelah sync, jalankan **Tarik dari Sheets** untuk verifikasi jumlah baris.

## Cara Pakai

1. Tekan **Pemasukan** / **Pengeluaran** → isi nominal → **Lanjut**.
2. Pilih uraian yang tersimpan, atau ketik uraian baru → **Simpan Uraian** / **Tanpa Uraian**.
3. Transaksi tersimpan lokal (status kuning = menunggu sync).
4. Isi URL Sheets, lalu **Sinkron** — status berubah hijau kalau sudah terkirim.
5. Scan QRIS: buka tab QRIS → arahkan bingkai ke kode → hasil scan masuk otomatis sebagai transaksi.

## Perbaikan yang Sudah Diterapkan (Audit)

### PWA & Service Worker

- **Dulu:** `index.html` tidak punya `<link rel="manifest">`, `theme-color`, `apple-touch-icon`, dan tidak ada `<!DOCTYPE html>` — PWA tidak terdeteksi.
- **Sekarang:** semua meta PWA ditambahkan, `start_url` menunjuk ke `./index.html` yang benar.
- **Dulu:** HTML register `sw.js?v=11`, file-nya `sw_2.js`, cache di dalamnya `v12` — tiga versi beda, SW tidak pernah update dengan benar.
- **Sekarang:** satu nama `sw.js`, register `?v=14`, cache `keuanganku-v14` — konsisten.
- **Dulu:** precache tidak menyertakan `index.html` / `./`, jadi offline pertama kali tetap blank.
- **Sekarang:** precache menyertakan `./`, `index.html`, `manifest.json`, dan 4 icon.
- **Dulu:** SW meng-cache semua respons termasuk error / redirect / opaque.
- **Sekarang:** hanya respons `res.ok` + same-origin yang di-cache; fallback HTML ke `./index.html`; `ignoreSearch` supaya `?v=` tidak bikin cache miss.

### Keamanan — XSS

- **Dulu:** `renderKat()`, `renderKatManage()`, dan render riwayat memakai `innerHTML` + `${k.nama}` / `${t.keterangan}` mentah — kategori/uraian dari backup bisa menyuntik HTML/JS.
- **Sekarang:** semua nama kategori & keterangan lolos `esc()` (escape `& < > " '`) sebelum masuk `innerHTML`.

### Sync & Data Loss

- **Dulu:** `toCSV()` tidak escape koma / newline / kutip di keterangan — uraian `Gaji, bonus` memecah kolom di Sheets.
- **Sekarang:** `toCSV()` memakai CSV escaping standar (bungkus kutip + gandakan `"`).
- **Dulu:** `tarikDariSheets()` punya `data.forEach(x => x.synced = true)` — semua transaksi lokal yang belum terkirim ikut tertandai synced, jadi tidak pernah dikirim lagi.
- **Sekarang:** baris itu dihapus; hanya transaksi yang benar-benar ditarik dari Sheets yang `synced: true`.
- **Dulu:** `postViaForm()` resolve `true` hanya karena iframe ter-load, padahal cross-origin tidak bisa membaca respons Apps Script — gagal di Sheets tetap tertandai synced.
- **Sekarang:** didokumentasikan sebagai keterbatasan; verifikasi dilakukan dengan **Tarik dari Sheets** setelah sync.

### Restore Backup

- **Dulu:** `restore()` menerima JSON apa pun, tidak restore `profil` / `url`, tidak reset input file.
- **Sekarang:** `restore()` memvalidasi bentuk data (array, tanggal `YYYY-MM-DD`, angka masuk/keluar valid), lalu restore `data`, `kategori`, `profil`, dan `url`; input file di-reset.

### Icon

- **Dulu:** icon `maskable` memakai file yang sama persis dengan `any` — logo `Rp` mepet pinggir, terpotong jadi lingkaran di Android. Plus border oranye.
- **Sekarang:** icon minimal tanpa border oranye — pill putih + `Rp` navy di atas gradasi ungu. Versi `maskable` memakai safe-zone (pill lebih kecil, 62% lebar) supaya tidak terpotong.

### Animasi Scan QR

- **Dulu:** garis scan menganimasikan `top` + `box-shadow: blur` — memaksa layout + repaint tiap frame di atas video kamera, jadi patah-patah; keyframe `0% → 50% → 100%` + `ease-in-out` membuat garis seperti berhenti lama di ujung.
- **Sekarang:** garis scan memakai `transform: translate3d(...)` + `will-change: transform` (compositor-only, tanpa layout), `box-shadow` diganti gradient fade, animasi `alternate` 1.6s yang bolak-balik mulus.
- **Dulu:** decode QR jalan tiap 350 ms di thread yang sama dengan animasi.
- **Sekarang:** interval jadi 500 ms + skip saat tab tidak terlihat (`document.hidden`).

### Tanggal Transaksi (UTC vs Lokal)

- **Dulu:** tanggal transaksi dihitung `new Date().toISOString().slice(0,10)` — itu tanggal **UTC**. Jam 00:00–06:59 WIB masih tanggal kemarin di UTC. Contoh: tes jam 00:29 WIB tanggal 24 → UTC masih 17:29 tanggal 23 → baris di Sheets tertulis 23 November 2026. Shortcut iOS pakai tanggal lokal HP → 24. Makanya web & shortcut beda.
- **Sekarang:** helper `tglLokal()` — `getFullYear/getMonth/getDate` (kalender lokal HP) → `YYYY-MM-DD`. Dipakai di `simpanTransaksi()` dan simpan hasil scan QRIS. Baris lama yang sudah terlanjur salah tanggal di Sheets tidak berubah otomatis — yang diperbaiki hanya transaksi baru.

### Anti-Copy & Anti-Zoom

- Viewport dikunci: `maximum-scale=1, minimum-scale=1, user-scalable=no`.
- CSS: `user-select: none` + `-webkit-touch-callout: none` di halaman; `touch-action: manipulation` (matikan double-tap zoom, scroll tetap jalan).
- JS memblokir `copy`, `cut`, `selectstart`, `dragstart`, `contextmenu`, `Ctrl/Cmd + C/X/A`, `Ctrl/Cmd + plus/minus/0`, `Ctrl + scroll`, `gesturestart` (pinch iOS lama), dan double-tap.
- **Pengecualian:** `input`, `textarea`, dan `[contenteditable]` tetap bisa diketik & teksnya bisa dipilih — supaya nominal, uraian, URL Sheets, dan backup tetap bisa diedit.
- **Batasan jujur:** ini mengunci pengguna kasual saja. Yang berniat tetap bisa membaca teks lewat DevTools / View Source / screenshot — tidak ada cara 100% mengunci teks di web.

## Batasan yang Diketahui

- Sync iframe tidak bisa mengonfirmasi sukses dari Apps Script (cross-origin). Verifikasi dengan **Tarik dari Sheets**.
- Kamera QR butuh HTTPS + izin kamera; di beberapa browser lama, fallback-nya **Pilih Foto QR**.
- Anti-copy tidak berlaku untuk screenshot & DevTools.

## Versi

| Versi | Isi |
| --- | --- |
| `keuanganku-v12` | SW lama (file `sw_2.js`), precache tidak lengkap, cache respons apa pun |
| `keuanganku-v13` | Perbaikan SW awal + manifest, masih icon lama |
| `keuanganku-v14` | Icon minimal, precache icon minimal, anti-copy & anti-zoom, animasi QR halus, restore tervalidasi |
| `keuanganku-v15` | Perbaikan tombol tidak merespons (hapus guard touchend), safe-area notch, apple-touch-icon ke icon minimal, tarik dari Sheets terima baris array, pesan gagal tarik bisa didiagnosis, esc() keterangan riwayat |
| `keuanganku-v16` | **Saat ini** — tanggal transaksi pakai tanggal lokal HP (WIB), bukan UTC — perbaikan bug tanggal 23 vs 24 |
