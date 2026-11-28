# Changelog Keuanganku

Semua perubahan penting dicatat di sini. Format: `Versi` — tanggal.

## [2.02] — 28 November 2026

Versi yang di-upload ke GitHub pertama kali.

### Tampilan & Navigasi
- Navbar liquid-glass final: lens satu warna navy di semua halaman (tidak lagi hijau/coklat per halaman).
- Lens navbar bisa **diseret sentuh-tahan**, berhenti **dead stop** tanpa mantul/overshoot.
- Navbar tinggal 4 tab: Beranda, Catat, Laporan, Lainnya. Scan QR pindah ke header, di sebelah jam.
- Toggle Mode Gelap pindah ke dalam kartu Profil Pemilik (halaman Lainnya).
- Header dibuat statis (tetap di atas saat scroll) dan transparan seperti navbar.
- Transparansi header (40%) dan navbar disamakan antara mode terang dan mode gelap.
- Ikon Catat diganti pensil compose (lebih premium), teks tab aktif berwarna biru `#7cc0ff`.
- **Teks header tetap terbaca** saat konten warna-warni lewat di belakangnya: blur header
  diperkuat (20px → 30px) + halo putih/hitam di belakang teks (sesuai mode terang/gelap),
  label WIB dipertegas, ikon header dikasih bayangan lembut.

### Keterbacaan & Umpan Balik
- Pil notifikasi (island) tidak lagi kepotong: teks boleh nge-wrap 2–3 baris, lebar menyesuaikan
  layar, durasi tampil diperpanjang 2,2 → 3,2 detik.
- Tombol kembali di scanner diganti chevron SVG tebal — konsisten dan jelas di semua HP Android.
- Semua dot status (Auto-Sync, per transaksi) **berkedip** merah/hijau/kuning sesuai statusnya.
- Ikon warning ⚠️ di Reset Transaksi + 2 dialog konfirmasi bahaya **berkedip**.

### PWA (baru — file-file-nya baru dibuat di rilis ini)
- `manifest.json` + `sw.js` + 4 ikon: aplikasi bisa di-install ke Home Screen
  (Android: Install app, iPhone: Add to Home Screen) dan dibuka **offline** setelah
  pertama kali dibuka online. Ikon "Rp" gradasi ungu→oranye, sama dengan avatar aplikasi.
- Catatan: HTML aplikasi sebenarnya sudah mereferensikan `manifest.json`, `sw.js`,
  dan `icon-192-minimal.png` sejak lama — file-file itu baru dilengkapi di rilis ini,
  jadi PWA-nya baru benar-benar aktif sekarang.

### Konten
- 3 kartu intro dihapus (Ringkasan Keuangan, Laporan & Perencanaan, Pengaturan & Data).
- Kartu Wawasan Keuangan dirapikan: nominal 1 baris tidak kepotong, label bulan
  ditulis "Oktober 2026" (bukan "2026-10").
- Label versi `v2.02` ditampilkan di kartu Keamanan & Backup (halaman Lainnya) dan di judul tab.
