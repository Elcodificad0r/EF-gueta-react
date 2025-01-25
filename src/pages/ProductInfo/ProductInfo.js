import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../components/Context/CartContext';
import './ProductInfo.css';
import Swal from 'sweetalert2';

const ProductInfo = () => {
  const { productId } = useParams(); 
  const { addItemToCart } = useCart(); 
  const [product, setProduct] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart({ ...product, quantity: 1 }); 
      Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Producto agregado al carrito',
              showConfirmButton: false,
              timer: 1500,
            });
    }
  };

  if (isLoading) {
    return <p className="loading">Cargando información del producto...</p>;
  }

  if (!product) {
    return <p className="error">No se encontró el producto.</p>;
  }

  return (
    <div className="product-info-container">
      <div>
        <h1 className="product-title">{product.title}</h1>
        <img src={product.image} alt={product.title} className="product-image" />
      </div>
      <p className="product-description">{product.description}</p>
      <div className='d-flex flex-column'>
        
        <p className="product-price">Precio: ${product.price}</p>
        <div>
        <button 
          className="btn btn-primary mt-3 ms-2" 
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
        <Link to="/" className="btn btn-secondary mt-3 ms-2">
          Volver a Productos
        </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;