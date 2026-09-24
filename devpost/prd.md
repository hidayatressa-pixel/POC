---
doc: prd
status: approved
---

# MSC Traceability — Product Requirements

Kontrol perjalanan satu part sampai penerimaan oleh PPIC Incoming customer, dengan otoritas PIC, jejak transaksi, dan penanganan abnormality.

Sumber: `scope.md > The Unique Kernel`, `The Core Loop`, `The POC Boundary`, serta `Amendments After Scope Approval`. Dokumen ini memakai keputusan bisnis pengguna; detail desain yang didelegasikan dicatat sebagai usulan implementasi.

## The Core Journey
1. PIC masuk menggunakan akun bernama. Nama, departemen, dan role selalu terlihat; menu mengikuti otoritas akun.
2. Planner melihat satu order dan perjalanan part. Warehouse membuka order yang ditugaskan dari Plan dan mencatat Received/Sent sesuai tahapnya.
3. Timeline menghubungkan Plan, Request Material, Prepare, MC A/B/C, Final Inspection, FG, DN, Milkrun, Shipment, dan Customer Received. Transaksi detail setiap mesin ditunda; riwayat contoh diberi penanda data contoh.
4. PPIC Incoming customer melihat DN yang ditujukan kepadanya dan memulai scan barcode DN melalui kamera. Detail order, part, LOT, jumlah, dan customer ditampilkan setelah barcode dikenali.
5. Aplikasi memeriksa akun/customer tujuan, tahap Shipment, DN, ketersediaan kamera, dan lokasi terkini. Hasil pemeriksaan terlihat sebelum konfirmasi penerimaan.
6. Percobaan tidak valid tidak menyelesaikan shipment. Kegagalan kontrol kamera/lokasi mengunci penerimaan DN dan muncul sebagai abnormality.
7. Admin membuka menu khusus, membaca alasan blokir, mengisi alasan tindakan, lalu membuka kesempatan pemeriksaan ulang. Unlock tidak sama dengan menerima barang: kamera, lokasi, DN, dan role wajib diperiksa kembali.
8. Penerimaan sah mencatat satu event Customer Received, memperbarui status, memberi notifikasi dalam aplikasi kepada Planner, dan menampilkan riwayat kepada customer. Admin dapat mengunduh report CSV.

## Screens and Layout
Satu aplikasi dengan Login dan ruang kerja sesuai role. Semua rancangan layar berikut adalah detail yang pengguna delegasikan kepada agen.

| Layar | Pengguna | Tampilan dan tindakan utama |
| --- | --- | --- |
| Login | Semua PIC | Identitas akun dan kata sandi; kesalahan login tidak membuka data transaksi. |
| Order & Tracking | Planner, Admin | Ringkasan satu order, tahap sekarang, part/LOT/qty, PIC tiap event, notifikasi, dan timeline. |
| Warehouse Orders | Warehouse, Admin | Order ditugaskan dari Plan; detail permintaan serta aksi Received/Sent sesuai tahap. |
| Incoming DN | Customer Incoming | DN customer tersebut, detail part dan kuantitas, kamera scan, hasil cek lokasi, konfirmasi receipt, serta riwayat proses terkait. |
| Abnormality & Recovery | Admin | DN terkunci, pemicu, pelaku, waktu, alasan unlock wajib, dan catatan recovery. |
| Report | Admin | Unduh CSV transaksi/abnormality untuk order demonstrasi. |

## Look and Feel
Disetujui pengguna: gaya industrial control room modern, putih–navy, kartu status tegas, hijau valid, merah abnormality, kuning menunggu. Status selalu mempunyai teks dan ikon sehingga tidak bergantung pada warna. Detail pilihan agen: huruf sans-serif yang mudah dibaca, angka LOT/DN berjarak jelas, sidebar pada desktop dan navigasi ringkas pada ponsel. Tombol scan dan konfirmasi mudah ditekan; timeline lebih penting daripada grafik dekoratif.

## Features and Behavior

### Identity and Authority
Sumber: `scope.md > Who It's For` dan `Amendments After Scope Approval`.

| Role | Boleh | Tidak boleh |
| --- | --- | --- |
| Planner | Melihat order, status, histori, notifikasi penerimaan | Mengaku sebagai customer atau membuka blokir |
| Warehouse | Membaca order bagiannya dan Received/Sent tahap Warehouse | Customer Received, menu recovery, transaksi departemen lain |
| Customer Incoming | Scan dan terima DN milik customernya; lihat histori relevan | Membuka blokir, DN customer lain, mengubah histori |
| Admin | Kelola data contoh sebelum transaksi, lihat keseluruhan, report, recovery | Menghapus jejak transaksi atau membuat receipt sah dengan melewati verifikasi |

- Akun contoh memakai identitas dan role tetap; pilihan role bukan pengganti login.
- Pembatasan berlaku pada tindakan dan data, termasuk bila pengguna mencoba akses langsung di luar menu.
- Identitas PIC dan waktu transaksi berasal dari akun dan pencatatan sistem; pengguna tidak mengetik nama PIC/waktu untuk mengaku sebagai orang lain.
- Kriteria: Warehouse mencoba Customer Received → ditolak; membuka menu recovery → ditolak. Customer hanya melihat DN untuk customer pada akunnya.

### Order and Process History
Sumber: `scope.md > The POC Boundary` dan `What "Working" Looks Like`.
- Header order menunjukkan nomor Plan/Order, Part ID/nama, LOT, qty/satuan, DN, tujuan customer, dan status.
- Histori berurutan menunjukkan tahap, PIC/departemen, waktu, qty, dan hasil. Percobaan gagal tetap terlihat dengan label ditolak; tidak dianggap perpindahan part yang berhasil.
- Event baru tidak menimpa event lama. Refresh atau login ulang tidak menghapus transaksi ataupun blokir.
- Kriteria: scan ditolak → status terakhir yang sah tetap sama; event penolakan muncul. Riwayat contoh dibedakan dari transaksi yang dijalankan saat demo.

### Warehouse Handoff
Sumber: `scope.md > The Core Loop` dan `Amendments After Scope Approval`.
- Warehouse melihat satu order dari Plan yang ditugaskan kepadanya, serta Part ID, LOT, qty, satuan, asal, dan tujuan.
- Received/Sent hanya berlaku pada handoff Warehouse dan urutan yang diizinkan. Tidak dapat mengubah tahapan mesin atau penerimaan customer.
- Kriteria: handoff berhasil menambah satu event dengan PIC Warehouse. Pengulangan tindakan yang sama tidak menambah transaksi ganda.

### Customer Receipt
Sumber: `scope.md > The Unique Kernel` dan `The Core Loop`.
- Hanya akun Incoming untuk customer tujuan yang dapat menyelesaikan receipt; DN wajib berstatus Shipment dan belum Received.
- Kamera harus tersedia dan barcode DN dikenali. Tidak ada input manual yang menggantikan scan pada alur receipt.
- Lokasi harus tersedia, cukup baru dan cukup akurat, serta berada di area customer yang terdaftar. Radius, ambang akurasi, dan umur lokasi ditetapkan pada spec, terlihat dalam detail pemeriksaan.
- Setelah semua pemeriksaan lulus, PIC memeriksa rincian dan menekan Konfirmasi Penerimaan. Hanya satu penerimaan untuk satu DN.
- Kriteria: receipt valid → status Customer Received, satu event, satu notifikasi Planner, histori tersedia. Scan ulang DN tersebut → tampilkan bukti sebelumnya, tidak menambah qty/event penerimaan.

### Receipt Lock and Admin Recovery
Sumber: keputusan pengguna bahwa kamera/lokasi ditolak harus memblokir total, dan hanya Admin dapat membuka kembali.
- Hilang/ditolaknya kamera atau lokasi, lokasi di luar area, atau lokasi yang tidak memenuhi syarat menghentikan penerimaan dan mengunci DN yang sedang diproses.
- Blokir adalah status kontrol terpisah; status pengiriman tetap pada tahap sah terakhir. Pengguna lain dan sesi baru tidak menghilangkan blokir.
- Admin melihat pemicu dan histori; alasan unlock wajib diisi. Unlock menghasilkan event berisi Admin, waktu, DN, dan alasan.
- Unlock hanya memberi kesempatan mencoba lagi. Admin tidak dapat menekan tombol untuk mengesahkan Customer Received secara manual.
- Kriteria: setelah lokasi ditolak, izin yang diaktifkan kembali saja tidak membuka blokir. Setelah unlock Admin, kegagalan pemeriksaan berikutnya mengunci lagi.

### Planner Notification and Report
Sumber: `scope.md > What "Working" Looks Like` dan tambahan report dari pengguna.
- Saat penerimaan berhasil tersimpan, Planner yang membuka aplikasi mendapat pembaruan status dan notifikasi dalam aplikasi. Koneksi terputus ditampilkan; aplikasi tidak mengaku sudah menerima pembaruan terkini ketika offline.
- CSV Admin memuat ID event, order, Part ID, LOT, DN, qty, satuan, status/hasil, PIC/role, waktu, hasil lokasi, alasan penolakan/recovery, dan penanda data contoh.
- Kriteria: penolakan dan unlock juga ada dalam report; duplikasi scan tidak menggandakan penerimaan. Customer hanya melihat histori yang terkait pengirimannya.

## States and Boundaries
| Kondisi | Perilaku yang terlihat |
| --- | --- |
| Belum login / sesi habis | Kembali ke Login; aksi tidak diterima sebagai transaksi sah. |
| Tidak ada order/DN yang ditugaskan | Pesan kosong sesuai role; tidak memunculkan order milik pihak lain. |
| Barcode tidak dikenal / DN salah | Pesan barcode tidak cocok; tidak mengubah status atau menandai DN acak sebagai Received. |
| Belum Shipment / sudah Received | Aksi ditolak dengan alasan; receipt tidak ganda. |
| Kamera/lokasi gagal | DN terkunci, alasan terlihat, arahkan ke Admin. |
| DN terkunci | Aksi receipt tidak tersedia hingga recovery Admin. |
| Alasan unlock kosong | Unlock tidak dapat dikirim. |
| Lokasi usang / akurasi buruk | Tidak boleh Received; tampilkan kegagalan kontrol lokasi. |
| Jaringan putus / simpan gagal | Tidak ada notifikasi sukses; tampilkan gagal/belum terkonfirmasi. Jangan menyelesaikan penerimaan offline. |
| Berhasil | Bukti penerimaan beserta waktu, PIC, rincian DN, dan histori dapat dibaca kembali. |

## Product Decisions
**Dari pengguna:** flow plan hingga customer; PIC per departemen; identitas part melalui barcode/LOT; fokus abnormality pada customer receipt palsu; PPIC Incoming customer scan DN; Planner diberi notifikasi; histori tersedia untuk customer; role/auth; Warehouse Sent/Received; Admin mengelola; report; kamera/lokasi gagal diblokir dan hanya Admin membuka; visual putih–navy dikonfirmasi.

**Pilihan agen dalam kewenangan yang diberikan:** satu aplikasi dengan menu per role; empat role minimum; CSV; notifikasi dalam aplikasi; blokir per DN; unlock mengizinkan pemeriksaan ulang dan tidak melewati kontrol; transaksi detail seluruh mesin ditunda. Pilihan ini ditampilkan agar dapat direview, bukan dinyatakan sebagai keputusan yang sudah diucapkan pengguna.

## What We're Building
Satu order, satu part/LOT, satu customer, satu DN; named sign-in dan otoritas minimum; handoff Warehouse; histori ringkas; scan DN; verifikasi lokasi; blokir; recovery Admin; penerimaan tunggal; notifikasi Planner; report CSV. Prioritas build adalah membuktikan penolakan, recovery, lalu receipt sah.

## Deferred From the POC
- Google Sheets + Apps Script sebagai integrasi lanjutan; belum terhubung pada demo mandiri ini.
- Self-service registration, reset password, enterprise identity, dan pengelolaan banyak perusahaan.
- Detail operasi setiap mesin, BOM/inventory/purchasing/accounting, pengiriman WA/email, partial receipt, dan multi-DN.
- Proteksi spoofing perangkat dan audit independen tingkat produksi.

## Proof and Demo Boundaries
Lokasi perangkat dan barcode adalah bukti pendukung, bukan jaminan bahwa barang fisik sudah tiba atau seluruh proses bebas kecurangan. Data contoh atau koordinat uji harus ditandai sebagai simulasi dan tidak dicampur dengan bukti transaksi nyata. Mode lokasi nyata memerlukan perangkat dengan kamera dan izin lokasi. Rekaman demo wajib membedakan kontrol yang bekerja dari pengujian di lingkungan pabrik yang belum dilakukan.

## Open Questions
Tidak ada keputusan bisnis yang perlu diulang sebelum menulis spec. Detail teknis yang didelegasikan: metode login/pencatatan, ambang lokasi, barcode yang didukung, cara menjalankan dua akun/perangkat, dan adapter integrasi berikutnya. Identitas/geofence customer nyata hanya diperlukan saat uji lapangan; tidak diminta untuk membuat rancangan ini.
