import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
  const [index, setIndex] = useState(0);
  const visibleCount = 4;
  const maxIndex = Math.max(0, products.length - visibleCount);
  const next = () => setIndex(i => Math.min(i + 1, maxIndex));
  const prev = () => setIndex(i => Math.max(i - 1, 0));
  return (
    <div className="carousel-wrapper">
      <button className="arrow left" onClick={prev} disabled={index === 0}>&lt;</button>
      <div className="carousel">
        {products.slice(index, index + visibleCount).map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
      <button className="arrow right" onClick={next} disabled={index === maxIndex}>&gt;</button>
    </div>
  );
};
export default ProductCarousel; 