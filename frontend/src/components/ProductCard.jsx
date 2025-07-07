import React, { useState } from 'react';
import './ProductCard.css';

const COLORS = [
  { key: 'yellow', label: 'Yellow Gold', color: '#E6CA97' },
  { key: 'white', label: 'White Gold', color: '#D9D9D9' },
  { key: 'rose', label: 'Rose Gold', color: '#E1A4A9' }
];

function ProductCard({ product }) {
  const [color, setColor] = useState('yellow');
  const score5 = (product.popularityScore * 5).toFixed(1);
  return (
    <div className="product-card">
      <img src={product.images[color]} alt={product.name} className="product-img" />
      <div className="product-info">
        <div className="product-title">{product.name}</div>
        <div className="product-price">${product.price} USD</div>
        <div className="color-picker">
          {COLORS.map(c => (
            <span
              key={c.key}
              className={`color-dot${color === c.key ? ' selected' : ''}`}
              style={{ background: c.color }}
              onClick={() => setColor(c.key)}
            />
          ))}
        </div>
        <div className="color-label">{COLORS.find(c => c.key === color).label}</div>
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.round(score5))}{'☆'.repeat(5 - Math.round(score5))}</span>
          <span className="score">{score5}/5</span>
        </div>
      </div>
    </div>
  );
}
export default ProductCard; 