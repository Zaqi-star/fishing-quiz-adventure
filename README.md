# Fishing Quiz Adventure

Game edukasi berbasis browser yang menggabungkan fishing game dengan kuis sejarah dan pengetahuan umum. Game ini dapat dimainkan di laptop maupun ponsel melalui browser.

## Fitur
- Game fishing dengan mekanisme menangkap ikan
- Kuis pilihan ganda dengan pembahasan jawaban
- Leaderboard skor pemain
- Panel admin untuk mengelola soal
- Bisa dimainkan di browser desktop maupun mobile

## Teknologi
- Node.js
- Express.js
- Socket.IO
- HTML/CSS/JavaScript

## Persyaratan
- Node.js versi 18 atau lebih tinggi
- Browser modern (Chrome, Edge, Firefox)

## Cara menjalankan
1. Buka terminal di folder project
2. Jalankan:
   ```bash
   npm install
   npm start
   ```
3. Buka browser:
   - Laptop: http://localhost:3000
   - Ponsel yang sama jaringan Wi-Fi: http://IP_LAPTOP:3000

Contoh IP laptop:
```bash
ipconfig
```
Lalu cari IPv4 Address.

## Password admin
```text
Kelompok123
```

## Struktur folder utama
```text
project/
├── public/           # file frontend (HTML, CSS, JS)
├── data/             # file soal dan leaderboard
├── server.js         # server utama
├── package.json      # konfigurasi project
├── package-lock.json
├── Kapal.png         # asset kapal
├── ikan.gif          # asset ikan
├── README.md         # dokumentasi
├── .gitignore        # file yang tidak ikut di GitHub
└── node_modules/     # dihasilkan saat install
```

## Catatan penting untuk GitHub
Untuk repo yang siap di-upload, file yang wajib disertakan adalah:
- server.js
- package.json
- package-lock.json
- public/
- data/
- Kapal.png
- ikan.gif
- README.md
- .gitignore

Jangan upload folder `node_modules`.

## Cara akses dari HP
Pastikan laptop dan HP terhubung ke jaringan Wi-Fi yang sama, lalu buka:
```text
http://IP_LAPTOP:3000
```
Contoh: `http://192.168.1.12:3000`

## Deploy ke internet
Jika ingin game bisa dimainkan dari internet, project ini perlu di-deploy ke hosting seperti Render, Railway, atau VPS. GitHub saja hanya menyimpan source code, bukan menjalankan aplikasi secara otomatis.

### Pilihan paling mudah: Render
1. Upload repo ke GitHub
2. Buka https://render.com
3. Pilih New > Web Service
4. Hubungkan repo GitHub
5. Pilih project ini
6. Render otomatis membaca file `render.yaml`
7. Klik Deploy
8. Setelah selesai, Render akan memberi link public seperti:
   ```text
   https://fishing-quiz-adventure.onrender.com
   ```

### Atau deploy manual
Jika tidak memakai `render.yaml`, gunakan konfigurasi berikut:
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `PORT=3000`
  - `ADMIN_PASSWORD=Kelompok123`
  - `NODE_ENV=production`

Setelah deploy, game bisa dimainkan langsung dari link yang diberikan Render.
