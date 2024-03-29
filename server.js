const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Middleware untuk mengizinkan CORS dari semua domain
app.use(cors());

app.get('/:url(*)', async (req, res) => {
  const targetUrl = req.params.url;
  try {
    const response = await fetch(targetUrl, {
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      }
    });

    // Menetapkan header CORS di respons
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses permintaan' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
