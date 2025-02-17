import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../components/Context/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './ProductInfo.css';
import Swal from 'sweetalert2';

const ProductInfo = () => {
  const { productId } = useParams();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'items', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItemToCart({ ...product, quantity });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto agregado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  if (isLoading) return <p className="loading">Cargando información...</p>;
  if (!product) return <p className="error">No se encontró el producto.</p>;

  return (
    <div className="product-info-container">
      <div>
        <h1 className="product-title">{product.nombre}</h1>
        <img src={product.img} alt={product.nombre} className="product-image" />
      </div>
      <p className="product-description">{product.descripcion}</p>
      <div>
        <p className="product-precio text-primary">Precio: ${product.precio}</p>
        <p className="product-stock text-success">Productos disponibles: {product.stock}</p>
        <div className="quantity-controls">
          <button onClick={handleDecrement} className="btn btn-secondary">-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrement} className="btn btn-secondary">+</button>
        </div>
        <div>
          <button className="m-3 btn btn-primary" onClick={handleAddToCart}>Agregar al carrito</button>
          <Link to="/" className="btn btn-secondary">Volver a Productos</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;