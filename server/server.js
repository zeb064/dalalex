const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading products.json:', err);
      return res.status(500).json({ error: 'Error al cargar los productos' });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error('Error parsing products.json:', parseErr);
      res.status(500).json({ error: 'Error al procesar los datos' });
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Dalalex API corriendo en http://localhost:${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/api/products`);
});
