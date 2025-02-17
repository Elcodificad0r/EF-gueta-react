import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext'; 
import './Products.css';
import Swal from 'sweetalert2';

const Products = ({ items }) => {
  const { categoryId } = useParams(); 
  const { addItemToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    console.log("Categoría seleccionada:", categoryId); 

    if (!items || items.length === 0) {
      console.log("No hay productos disponibles"); 
      setProducts([]);
      return;
    }

    const selectedCategory = categoryId ? categoryId.toLowerCase() : null;
    console.log("Filtrando productos para categoría:", selectedCategory); 

    const filteredProducts = selectedCategory
      ? items.filter(product => 
          product.category && product.category.toLowerCase() === selectedCategory
        )
      : items;

    console.log("Productos filtrados:", filteredProducts); 

    setProducts(filteredProducts);
    setQuantities(Object.fromEntries(filteredProducts.map(p => [p.id, 0])));
  }, [categoryId, items]);

  const handleIncrement = id => setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const handleDecrement = id => setQuantities(prev => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));

  const handleAddToCart = product => {
    if (quantities[product.id] > 0) {
      addItemToCart({ ...product, quantity: quantities[product.id] });
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
      Swal.fire({ position: 'center', icon: 'success', title: 'Producto agregado', showConfirmButton: false, timer: 1500 });
    } else {
      Swal.fire({ position: 'center', icon: 'warning', title: 'Selecciona al menos una unidad', showConfirmButton: false, timer: 1500 });
    }
  };

  return (
    <div>
      <h1 className='ms-5'>Productos {categoryId ? `de la categoría: ${categoryId}` : 'en general'}</h1>
      <div className="products-map">
        {products.length === 0 ? <p>No hay productos disponibles en esta categoría.</p> : products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.img} alt={product.title} />
            <strong>{product.nombre}</strong> <span className='text-primary'>Precio: ${product.precio}</span>
            <span className='text-success'>Productos disponibles: {product.stock}</span>
            <div className="quantity-controls">
              <button onClick={() => handleDecrement(product.id)}>-</button>
              <span>{quantities[product.id]}</span>
              <button onClick={() => handleIncrement(product.id)}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
            <Link to={`/product/${product.id}`} className="details-btn">Ver detalles</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;