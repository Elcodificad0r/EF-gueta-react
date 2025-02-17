import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Context/CartContext'; 
import NavBar from './components/NavBar';
import Products from './components/Products/Products';
import ProductInfo from './pages/ProductInfo/ProductInfo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getItemsList = async () => {
      const data = await getDocs(collection(db, 'items'));
      const filteredData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(filteredData);
    };
    getItemsList();
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Products items={items} />} />
          <Route path="/category/:categoryId" element={<Products items={items} />} />
          <Route path="/product/:productId" element={<ProductInfo />} />
          <Route path="*" element={<h1>404 Not found</h1>} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;