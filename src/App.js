import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Context/CartContext'; 
import NavBar from './components/NavBar';
import Products from './components/Products/Products';
import ProductInfo from './pages/ProductInfo/ProductInfo';

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/category/:categoryId" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductInfo />} />
          <Route path="*" element={<h1>404 Not found</h1>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;