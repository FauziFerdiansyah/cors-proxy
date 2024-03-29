const express = require('express');
const cors = require('cors');

const app = express();

// Middleware untuk mengizinkan CORS dari semua domain
app.use(cors());

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

app.get('/:url(*)', allowCors(async (req, res) => {
  const targetUrl = req.params.url;
  try {
    // Menggunakan dynamic import() untuk mengimpor modul node-fetch
    const fetch = await import('node-fetch');

    // Mengambil header dari permintaan asli dan meneruskannya ke permintaan ke server tujuan
    const response = await fetch.default(targetUrl, {
      headers: {
        ...req.headers, // Meneruskan semua header dari permintaan asli
        host: new URL(targetUrl).host // Menetapkan host dari target URL sebagai bagian dari header
      }
    });

    // Mendapatkan data dari respons dan mengirimkannya kembali ke klien
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses permintaan' });
  }
}));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server ini berjalan di http://localhost:${port}`);
});
