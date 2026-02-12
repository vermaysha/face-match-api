# Face Match API

API untuk deteksi kehadiran wajah (face liveness detection) menggunakan TensorFlow.js dan Human library.

## Deskripsi

Project ini menyediakan REST API untuk menganalisis gambar dan mendeteksi apakah wajah dalam gambar adalah asli (live) atau tidak. Menggunakan teknologi machine learning untuk identifikasi bukti kehidupan pada wajah.

## Fitur Utama

- ✅ Deteksi liveness wajah (real/fake detection)
- ✅ Analisis multiple faces dalam satu gambar
- ✅ Ekstraksi informasi wajah (posisi, confidence, dll)
- ✅ Built with Elysia framework dan Bun runtime

## Teknologi

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Elysia](https://elysiajs.com)
- **ML Library**: [@vladmandic/human](https://github.com/vladmandic/human)
- **Backend**: [TensorFlow.js](https://www.tensorflow.org/js)
- **Language**: TypeScript

## Instalasi

```bash
# Install dependencies
bun install

# Jalankan development server
bun run src/index.ts
```

## API Endpoints

### GET /
Mendapatkan informasi API

**Response:**
```json
{
  "message": "Face Liveness Detection API",
  "endpoints": {
    "POST /detect-liveness": "Upload an image to detect liveness"
  }
}
```

### POST /detect-liveness
Mengirim gambar untuk deteksi kehadiran wajah

**Request:**
- Form data dengan field `image` (file gambar)

**Response:**
```json
{
  "success": true,
  "total_faces": 1,
  "live_faces": 1,
  "faces": [
    {
      "live": 1,
      "confidence": 0.95,
      ...
    }
  ]
}
```

## Build Production

```bash
bun run build
```

## Project Structure

```
.
├── src/
│   └── index.ts          # Main API application
├── models/               # Pre-trained ML models
├── package.json
└── tsconfig.json
```

## Development

Project ini menggunakan Bun sebagai package manager dan runtime. Pastikan Bun sudah ter-install di system Anda.

```bash
# Cek versi Bun
bun --version
```

## License

MIT
