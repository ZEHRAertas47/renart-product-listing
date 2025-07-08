const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

const PRODUCTS_PATH = './products.json';
const GOLD_API_URL = 'https://www.goldapi.io/api/XAU/USD';
const GOLD_API_KEY = 'goldapi-demo-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Demo key, gerçek anahtar ile değiştirilmeli

async function getGoldPrice() {
  try {
    const res = await axios.get(GOLD_API_URL, {
      headers: { 'x-access-token': GOLD_API_KEY, 'Content-Type': 'application/json' }
    });
    return res.data.price_gram_24k;
  } catch (e) {
    // Fallback: Sabit fiyat
    return 75; // USD/gram
  }
}

app.get('/api/products', async (req, res) => {
  const { minPrice, maxPrice, minScore, maxScore } = req.query;
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const goldPrice = await getGoldPrice();
  const result = products.map(p => {
    const price = ((p.popularityScore + 1) * p.weight * goldPrice).toFixed(2);
    return { ...p, price: Number(price), goldPrice };
  }).filter(p => {
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    if (minScore && p.popularityScore < minScore) return false;
    if (maxScore && p.popularityScore > maxScore) return false;
    return true;
  });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 