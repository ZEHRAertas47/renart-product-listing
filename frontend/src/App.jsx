import React, { useEffect, useState } from 'react';
import './App.css';
import ProductCarousel from './components/ProductCarousel';

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  return (
    <div className="container">
      <h1 className="title">Product List</h1>
      <ProductCarousel products={products} />
    </div>
  );
}
export default App; 