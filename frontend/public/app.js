console.log("==== APP.JS YÜKLENDİ! ====");

const COLORS = [
  { key: 'yellow', label: 'Yellow Gold', color: '#E6CA97' },
  { key: 'white', label: 'White Gold', color: '#D9D9D9' },
  { key: 'rose', label: 'Rose Gold', color: '#E1A4A9' }
];

let products = [];
let index = 0;
const visibleCount = 4;

async function fetchProducts(params = {}) {
  try {
    let url = 'http://localhost:3001/api/products';
    const query = [];
    if (params.minPrice) query.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) query.push(`maxPrice=${params.maxPrice}`);
    if (params.minScore) query.push(`minScore=${params.minScore}`);
    if (params.maxScore) query.push(`maxScore=${params.maxScore}`);
    if (query.length) url += '?' + query.join('&');
    const res = await fetch(url);
    products = await res.json();
    renderCarousel();
  } catch (e) {
    document.getElementById('carousel').innerHTML = '<div style="color:red; margin-top:20px; font-size:1.1rem;">Ürünler yüklenemedi.</div>';
  }
}

function renderCarousel() {
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = '';
  const maxIndex = Math.max(0, products.length - visibleCount);
  const visible = products.slice(index, index + visibleCount);
  visible.forEach((product, i) => {
    carousel.appendChild(createProductCard(product));
  });
  document.getElementById('arrow-left').disabled = index === 0;
  document.getElementById('arrow-right').disabled = index === maxIndex;
}

document.getElementById('arrow-left').onclick = () => {
  if (index > 0) { index--; renderCarousel(); }
};
document.getElementById('arrow-right').onclick = () => {
  const maxIndex = Math.max(0, products.length - visibleCount);
  if (index < maxIndex) { index++; renderCarousel(); }
};

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  let color = 'yellow';

  const img = document.createElement('img');
  img.src = product.images[color];
  img.alt = product.name;
  card.appendChild(img);

  const title = document.createElement('div');
  title.className = 'product-title';
  title.textContent = product.name;
  card.appendChild(title);

  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = `$${product.price} USD`;
  card.appendChild(price);

  const colorPicker = document.createElement('div');
  colorPicker.className = 'color-picker';
  COLORS.forEach(c => {
    const dot = document.createElement('span');
    dot.className = 'color-dot' + (color === c.key ? ' selected' : '');
    dot.style.background = c.color;
    dot.onclick = () => {
      color = c.key;
      img.src = product.images[color];
      colorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
      colorLabel.textContent = c.label;
    };
    colorPicker.appendChild(dot);
  });
  card.appendChild(colorPicker);

  const colorLabel = document.createElement('div');
  colorLabel.className = 'color-label';
  colorLabel.textContent = COLORS.find(c => c.key === color).label;
  card.appendChild(colorLabel);

  const rating = document.createElement('div');
  rating.className = 'rating';
  const score5 = (product.popularityScore * 5).toFixed(1);
  const stars = document.createElement('span');
  stars.className = 'stars';
  stars.textContent = '★'.repeat(Math.round(score5)) + '☆'.repeat(5 - Math.round(score5));
  const score = document.createElement('span');
  score.className = 'score';
  score.textContent = `${score5}/5`;
  rating.appendChild(stars);
  rating.appendChild(score);
  card.appendChild(rating);

  return card;
}

function applyFilter() {
  index = 0;
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const minScore = document.getElementById('minScore').value;
  const maxScore = document.getElementById('maxScore').value;
  console.log('Filtrele fonksiyonu çağrıldı!', minPrice, maxPrice, minScore, maxScore);
  fetchProducts({ minPrice, maxPrice, minScore, maxScore });
}

document.addEventListener('DOMContentLoaded', function() {
  const filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    filterBtn.onclick = applyFilter;
  }
  ['minPrice','maxPrice','minScore','maxScore'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilter);
  });
  fetchProducts();
});