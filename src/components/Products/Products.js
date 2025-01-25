import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext'; 
import fetchProducts from '../../request';
import './Products.css';
import Swal from 'sweetalert2';


const categoryMap = {
  ropa: ["men's clothing", "women's clothing"], 
  electronicos: 'electronics',
  joyeria: 'jewelery',
};

const Products = () => {
  const { categoryId } = useParams(); 
  const { addItemToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      try {
        const allProducts = await fetchProducts(); 

        const filteredProducts = categoryId
          ? allProducts.filter((product) => {
              const apiCategory = categoryMap[categoryId];
              return Array.isArray(apiCategory)
                ? apiCategory.includes(product.category) 
                : product.category === apiCategory; 
            })
          : allProducts;

        setProducts(filteredProducts);

       
        const initialQuantities = {};
        filteredProducts.forEach((product) => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, [categoryId]); 

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }));
  };

  const handleAddToCart = (product) => {
    if (quantities[product.id] > 0) {
      addItemToCart({ ...product, quantity: quantities[product.id] });
      
      setQuantities((prev) => ({
        ...prev,
        [product.id]: 0,
      }));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Selecciona al menos una unidad',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      <h1 className='ms-5'>Productos {categoryId ? `de la categoría: ${categoryId}` : 'en general'}</h1>
      <div className="products-map">
        {products.length === 0 ? (
          <p>No hay productos disponibles en esta categoría.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong> - ${product.price}
              <div className="quantity-controls">
                <button onClick={() => handleDecrement(product.id)}>-</button>
                <span>{quantities[product.id]}</span>
                <button onClick={() => handleIncrement(product.id)}>+</button>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Agregar al carrito
              </button>
              
              <Link to={`/product/${product.id}`} className="details-btn">
                Ver detalles
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;