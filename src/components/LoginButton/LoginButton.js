import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { db } from "../../config/firebase";
import { collection, query, where, getDocs, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import './LoginButton.css'; 

const LoginButton = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const ordersRef = query(collection(db, "orders"), where("email", "==", user.email));
      const unsubscribe = onSnapshot(ordersRef, (querySnapshot) => {
        const fetchedOrders = querySnapshot.docs.map(doc => doc.data());
        setOrders(fetchedOrders);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL || "https://via.placeholder.com/30" // Asegura que siempre haya un valor por defecto
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setTimeout(() => {
        setUser(loggedUser);
      }, 100);

      console.log("Usuario logueado:", loggedUser);
    } catch (error) {
      console.error("Error en login:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      setOrders([]);
      setMenuOpen(false); 
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const addNewOrder = async (newOrder) => {
    try {
      await addDoc(collection(db, "orders"), newOrder);
      Swal.fire("Orden agregada", "", "success");
    } catch (error) {
      console.error("Error al agregar nueva orden:", error.message);
      Swal.fire("Error", "Hubo un problema al agregar la orden", "error");
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);  
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedOrder(null); 
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const clearOrders = async () => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará todas tus órdenes.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const ordersToDelete = await getDocs(
            query(collection(db, "orders"), where("email", "==", user.email))
          );
          ordersToDelete.forEach(async (orderDoc) => {
            await deleteDoc(doc(db, "orders", orderDoc.id));
          });

          setOrders([]);
          Swal.fire("Órdenes eliminadas", "", "success");
        }
      });
    } catch (error) {
      console.error("Error al eliminar órdenes:", error.message);
      Swal.fire("Error", "Hubo un problema al eliminar las órdenes", "error");
    }
  };

  return (
    <div className="d-flex align-items-center m-3">
      {user ? (
        <>
          <div className="d-flex align-items-center" style={{ position: 'relative' }}>
            <span 
              className="me-2" 
              onClick={toggleMenu} 
              style={{ cursor: "pointer", userSelect: "none" }}>
              {user.name || user.email}
            </span>
            <img 
              src={user.photo ? user.photo : "https://via.placeholder.com/30"} 
              alt="User" 
              className="rounded-circle" 
              width="30" 
              onError={(e) => e.target.src = "/path/to/local/default-image.png"}  // Imagen predeterminada local
            />

            {menuOpen && (
              <div className="fixed-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <h6 className="dropdown-header">Órdenes</h6>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <a 
                      className="dropdown-item" 
                      key={index} 
                      onClick={() => viewOrderDetails(order)} 
                      style={{ cursor: "pointer" }}
                    >
                      <strong>Orden {index + 1}:</strong> {order.items.reduce((total, item) => total + item.cantidad, 0)} artículos
                    </a>
                  ))
                ) : (
                  <a className="dropdown-item">No tienes órdenes</a>
                )}
                <button onClick={clearOrders} className="btn btn-danger w-100 mt-2">Limpiar Órdenes</button>
              </div>
            )}

            {selectedOrder && (
              <div className="order-details">
                <h6>Detalles de la orden:</h6>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.nombre} - {item.cantidad} x ${item.precio}
                    </li>
                  ))}
                </ul>
                <p><strong>Total: </strong>${selectedOrder.total}</p>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">Cerrar detalles</button>
              </div>
            )}
          </div>
          <button className="btn btn-danger ms-2" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </>
      ) : (
        <button className="btn btn-primary m-3" onClick={handleLogin}>
          Iniciar Sesión con Google
        </button>
      )}

      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </div>
  );
};

export default LoginButton;