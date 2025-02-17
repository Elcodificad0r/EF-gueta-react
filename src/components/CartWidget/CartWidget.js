import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext'; 
import Swal from 'sweetalert2';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../../config/firebase'; 
import './CartWidget.css';

const CartWidget = () => {
  const { cartItems, incrementQuantity, decrementQuantity, clearCart, setCart } = useCart(); 
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart); // Usa setCart para actualizar el estado global
      } catch (error) {
        console.error("Error al leer localStorage:", error);
      }
    }
  }, [setCart]); 

  // Guardar en localStorage cada vez que cartItems cambia
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart"); // Elimina si está vacío
    }
  }, [cartItems]);

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No tienes artículos en el carrito. Agrega productos antes de realizar la compra.',
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para finalizar tu compra.',
      });
      return;
    }

    const { value: userData } = await Swal.fire({
      title: 'Finalizar compra',
      html: `
        <label for="name">Nombre:</label>
        <input id="name" class="swal2-input" placeholder="Tu nombre" value="${user.displayName || ''}">
        <label for="email">Email:</label>
        <input id="email" class="swal2-input" placeholder="Tu correo" value="${user.email}" disabled>
        <label for="address">Dirección de envío:</label>
        <input id="address" class="swal2-input" placeholder="Calle, número, ciudad">
      `,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const email = Swal.getPopup().querySelector('#email').value;
        const address = Swal.getPopup().querySelector('#address').value;

        if (!name || !address) {
          Swal.showValidationMessage('Por favor, completa todos los campos.');
          return false;
        }
        return { name, email, address };
      },
    });

    if (!userData) return;

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        name: userData.name,
        email: userData.email,
        address: userData.address,
        items: cartItems.map(item => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.quantity,
          precio: item.precio,
        })),
        total: totalPrice,
        timestamp: serverTimestamp(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: `Gracias por tu compra, ${userData.name}!`,
      });

      clearCart();
      localStorage.removeItem("cart");

    } catch (error) {
      console.error("Error guardando orden:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la compra.',
      });
    }
  };

  return (
    <div className="cart-widget justify-content-end me-5">
      <div onClick={toggleCart} type="button" className="btn btn-primary cart-icon">
        <i className="fas fa-shopping-cart"></i>
        <span>🛒 {totalItems}</span>
        <span className="cart-word">Carrito</span>
      </div>

      {isOpen && (
        <div className="cart-popup">
          <div className="d-flex justify-content-between m-2">
            <div>
              <button type="button" onClick={toggleCart} className="btn btn-outline-secondary close-cart">
                X
              </button>
            </div>
            <h2 className="align-self-center m-2"> 🛒 Carrito</h2>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <span>{item.nombre}</span>
                  <span>${item.precio} x {item.quantity}</span>
                </div>
                <div className="item-controls">
                  <button onClick={() => decrementQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <strong>Total de productos:</strong> {totalItems}
            </div>
            <div className="cart-price">
              <strong>Total a pagar:</strong> ${totalPrice.toFixed(2)}
            </div>
          </div>

          <button className="btn btn-primary w-100 mb-2" onClick={handleCheckout}>
            Comprar ahora
          </button>
          <button className="btn btn-secondary w-100" onClick={() => { clearCart(); localStorage.removeItem("cart"); }}>
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default CartWidget;