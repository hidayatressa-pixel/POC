---
doc: spec
status: approved
---

# MSC Traceability — Technical Spec

## How This Works, In Plain Language
Ini adalah aplikasi browser satu file data. Saat PIC login, browser memuat akun demo dan satu order dari penyimpanan browser (`localStorage`, seperti catatan yang tetap tersimpan pada browser tersebut). Setiap tindakan membuat event baru; event lama tidak ditimpa. Kamera membaca barcode DN melalui `BarcodeDetector` bila browser mendukungnya, lalu browser meminta lokasi perangkat.

Receipt hanya dibuat bila empat kontrol lulus: akun Incoming milik customer tujuan, DN sudah Shipment, kamera berhasil membaca DN, dan lokasi sesuai area customer. Kegagalan kamera atau lokasi membuat lock pada DN dan event abnormality. Admin memberi alasan saat unlock, kemudian Incoming harus menjalankan pemeriksaan lagi. Ini sengaja mandiri agar kernel traceability dapat direkam dalam 2–4 jam tanpa service cloud. `localStorage` dan akun demo bukan keamanan produksi; backend dan Sheets adapter ditambahkan sesudah POC.

## The Core Journey Through the System
Implements `prd.md > The Core Journey`.

1. `index.html` memuat login dan daftar akun demo. `app.js` membuat sesi lokal berdasarkan username/password contoh.
2. Dashboard membatasi menu melalui `role`. Data order dan `events` dimuat dari `localStorage` atau data seed pertama kali.
3. Warehouse menambah event Received/Sent yang valid. Fungsi transaksi menolak duplikasi atau tahap tidak diizinkan.
4. Incoming membuka receipt. Kamera memindai QR/barcode DN menggunakan `BarcodeDetector`, lalu `navigator.geolocation` membaca koordinat/akurasi/waktu.
5. `validateReceipt()` membandingkan DN, role, shipment state, lock state, dan geofence customer. Gagal kontrol menambah `ABNORMALITY_LOCK` tanpa mengubah status Shipment.
6. Admin mengisi alasan unlock. Fungsi recovery menambah `ADMIN_UNLOCK`, menghapus lock, namun tidak membuat `CUSTOMER_RECEIVED`.
7. Receipt yang lolos menambah `CUSTOMER_RECEIVED`, status order berubah, notifikasi Planner muncul, dan Admin dapat ekspor CSV melalui browser.

## Stack
- HTML5, CSS3, JavaScript ES2022 — tanpa framework dan tanpa build step; cepat dibuka dan dipahami untuk POC browser lokal.
- Browser MediaDevices API untuk kamera: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- BarcodeDetector API bila tersedia: https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector . Trade-off: dukungan browser berbeda; aplikasi menampilkan pesan yang jujur bila tidak tersedia.
- Geolocation API untuk posisi perangkat: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- Web Storage API untuk data POC: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API . Trade-off: data tersimpan per browser/perangkat, bukan sinkron untuk banyak user.

Pilihan ini dibuat agen berdasarkan pendelegasian implementasi dari pengguna dan batas 2–4 jam. Tidak ada API key, biaya, database, atau akun cloud yang menghambat demo.

## Where It Runs and How Someone Tries It
Jalankan dari folder proyek dengan:

```bash
python3 -m http.server 4173
```

Buka `http://localhost:4173` pada browser. Kamera/lokasi membutuhkan browser modern dan izin pengguna; localhost dianggap secure context oleh browser modern. Untuk demo lokasi sukses, buka pada perangkat di area konfigurasi customer atau gunakan mode demo yang ditandai jelas sebagai simulasi. Tekan **Reset demo data** di Login untuk mengembalikan order awal.

Submission tetap memerlukan video 1–3 menit dan repo GitHub publik. Deployment tidak diperlukan.

## Look and Feel
Implements `prd.md > Look and Feel`.

White/navy industrial control room: status ditulis dengan teks dan ikon selain warna; hijau valid, merah abnormality, kuning menunggu. Layout menggunakan sidebar desktop dan navigasi ringkas pada ponsel. Nomor DN/LOT memakai huruf monospace agar mudah diperiksa. Tombol scan, kontrol lock, dan status timeline selalu menjadi fokus.

## Components

### Login and Session
Implements `prd.md > Identity and Authority`.

Render akun demo dan membuat sesi `{ userId, role }` di `localStorage`. Semua action memanggil `requireRole()`; menyembunyikan menu bukan satu-satunya kontrol.

### Order Dashboard and Timeline
Implements `prd.md > Order and Process History`.

Menampilkan metadata order, state terakhir, event dari lama ke baru, PIC, departemen, waktu, quantity, dan hasil kontrol. Semua penolakan/recovery masuk timeline.

### Warehouse Handoff
Implements `prd.md > Warehouse Handoff`.

Hanya Warehouse/Admin dapat menekan Received/Sent. Guard mengecek status handoff sebelum event baru dibuat.

### Incoming Receipt Controller
Implements `prd.md > Customer Receipt`.

Menjalankan kamera, scanner barcode, lokasi, evaluasi geofence, layar hasil pemeriksaan, dan konfirmasi receipt. Input teks manual tidak pernah menghasilkan Customer Received.

### Lock and Admin Recovery
Implements `prd.md > Receipt Lock and Admin Recovery`.

Simpan struktur `receiptLock`; hanya Admin dapat unlock dengan alasan tidak kosong. Unlock meninggalkan event permanen lalu customer harus scan ulang.

### Notification and CSV Report
Implements `prd.md > Planner Notification and Report`.

Notifikasi dilihat pada dashboard Planner setelah event receipt. Admin men-download CSV lokal dari seluruh events.

## Data Model

```js
User { id, name, password, role, department, customerId? }
Order { id, planNo, partId, partName, lotId, quantity, unit, customerId, dnCode, status, warehouseState, receiptLock? }
Customer { id, name, latitude, longitude, radiusMeters }
Event { id, type, status, orderId, dnCode, actorId, actorName, role, department, at, quantity, location?, reason?, demoSeed? }
ReceiptLock { lockedAt, reason, actorId, location?, recoveredAt?, recoveredBy?, recoveryReason? }
Session { userId, role }
```

`seedData` hanya dipakai saat pertama kali browser dibuka. `events`, order state, lock, dan notifikasi diperbarui atomik pada browser lalu dirender ulang. Reset menghapus data POC dari browser itu dan memuat seed baru.

## File Structure

```text
line-stop-coach/
├── index.html             # shell aplikasi dan dialog kamera
├── styles.css             # industrial responsive design
├── app.js                 # session, role guard, event engine, scan/location, CSV
├── README.md              # cara run, demo accounts, batas POC
├── devpost/
│   ├── scope.md           # approved scope
│   ├── prd.md             # approved PRD
│   └── spec.md            # technical blueprint ini
└── .gitignore             # profile belajar dan file lokal
```

## External Services and Dependencies
Tidak ada service eksternal atau API key untuk POC. Kamera dan lokasi berasal dari browser pengguna setelah izin diberikan. Planned integration Google Sheets/App Script belum dipanggil oleh code ini agar demo tetap dapat berjalan offline setelah file dimuat dari localhost.

## Important Failure Modes
- **Browser tidak mendukung BarcodeDetector** → tampilkan status scanner tidak tersedia; receipt tidak dapat disahkan. Pada perangkat demo gunakan Chrome Android terbaru atau lakukan pengetesan awal.
- **Kamera/lokasi ditolak atau gagal** → buat `ABNORMALITY_LOCK`, tampilkan alasan, dan blokir receipt sampai Admin recovery.
- **Data browser rusak atau format lama** → tombol Reset Demo Data memulihkan seed; jangan menganggap data lokal sebagai audit produksi.

## What Was Simplified and Why
- **Akun demo lokal** instead of identity server — menunjukkan otoritas role tanpa setup server. Server auth diperlukan sebelum pelanggan memakai aplikasi.
- **Satu browser/persistent localStorage** instead of multi-user real-time database — kernel lock/receipt/timeline bisa didemokan tanpa konflik sinkronisasi.
- **Customer coordinate demo** instead of lokasi customer asli — aman untuk video dan tidak mengungkap lokasi bisnis. Data nyata dimasukkan pada konfigurasi production.
- **CSV browser** instead of Google Sheets/App Script — report berfungsi sekarang; connector dapat ditambahkan ke event engine berikutnya.

## Decisions and Open Issues
- Pengguna menyerahkan code dan visual kepada agen setelah menetapkan flow, role, blokir, recovery Admin, report, serta arah visual.
- Ketidakpastian nyata adalah dukungan scanner pada browser perangkat. Penjelasan: scanner bawaan browser tidak merata; build akan mendeteksi dukungan di awal dan menolak receipt secara jujur bila tidak ada. Ini diverifikasi saat build dengan capability check dan instruksi test Chrome Android.
- Geofence success menggunakan koordinat demo yang dapat diatur di data seed. Uji lapangan memerlukan koordinat customer yang sah dan perangkat dengan izin kamera/lokasi.
