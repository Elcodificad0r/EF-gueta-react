import React, { useState } from 'react';
import { useCart } from '../Context/CartContext'; 
import Swal from 'sweetalert2';
import './CartWidget.css';

const CartWidget = () => {
  const { cartItems, incrementQuantity, decrementQuantity, clearCart } = useCart(); 
  const [isOpen, setIsOpen] = useState(false); 

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

 
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    Swal.fire({
      title: 'Finalizar compra',
      html: `
        <label for="name">Nombre:</label>
        <input id="name" class="swal2-input" placeholder="Tu nombre">
        <label for="address">Dirección:</label>
        <input id="address" class="swal2-input" placeholder="Tu dirección">
        <label for="email">Email:</label>
        <input id="email" class="swal2-input" placeholder="Tu correo">
      `,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const address = Swal.getPopup().querySelector('#address').value;
        const email = Swal.getPopup().querySelector('#email').value;

        if (!name || !address || !email) {
          Swal.showValidationMessage('Por favor, completa todos los campos.');
          return false;
        }

        return { name, address, email };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Información de pago',
          html: `
            <label for="cardNumber">Número de tarjeta:</label>
            <input id="cardNumber" class="swal2-input" placeholder="1234 5678 9012 3456">
            <label for="expiryDate">Fecha de vencimiento:</label>
            <input id="expiryDate" class="swal2-input" placeholder="MM/AA">
            <label for="cvv">CVV:</label>
            <input id="cvv" class="swal2-input" placeholder="123">
          `,
          showCancelButton: true,
          confirmButtonText: 'Pagar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const cardNumber = Swal.getPopup().querySelector('#cardNumber').value;
            const expiryDate = Swal.getPopup().querySelector('#expiryDate').value;
            const cvv = Swal.getPopup().querySelector('#cvv').value;

            if (!cardNumber || !expiryDate || !cvv) {
              Swal.showValidationMessage('Por favor, completa todos los campos de pago.');
              return false;
            }

            return { cardNumber, expiryDate, cvv };
          },
        }).then((paymentResult) => {
          if (paymentResult.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Compra realizada',
              text: `Gracias por tu compra, ${result.value.name}!`,
              didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                  Swal.close();
                  clearCart(); 
                  Swal.fire({
                    icon: 'success',
                    title: 'Transacción completada',
                    text: 'Tu pedido llegará pronto.',
                  });
                }, 2000); 
              },
            });
          }
        });
      }
    });
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
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <span>{item.name}</span>
                  <span>${item.price} x {item.quantity}</span>
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
          <button className="btn btn-secondary w-100" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default CartWidget;