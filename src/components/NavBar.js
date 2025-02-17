import React from "react";
import { Link } from "react-router-dom";
import CartWidget from "./CartWidget/CartWidget";
import LoginButton from "./LoginButton/LoginButton";
import logo from "../assets/logo.png"; 

const NavBar = () => {
  return (
    <nav className="container-fluid d-flex flex-wrap flex-md-row flex-sm-column justify-content-between align-items-center p-3 border-bottom">
      {/* Logo de la tienda */}
      <Link to="/" className="ms-3 text-decoration-none">
        <img src={logo} alt="Logo" width="350" className="img-fluid" />
      </Link>

      {/* Botones de categorías */}
      <div className="d-flex flex-column flex-md-row justify-content-center mt-3 mt-md-0">
        <Link to="/category/ropa">
          <button type="button" className="btn btn-warning m-2">Ropa</button>
        </Link>
        <Link to="/category/electronicos">
          <button type="button" className="btn btn-warning m-2">Electrónicos</button>
        </Link>
        <Link to="/category/joyeria">
          <button type="button" className="btn btn-warning m-2">Joyería</button>
        </Link>
      </div>

      {/* Login y Carrito */}
      <div className="d-flex flex-column align-items-end mt-3 mt-md-0">
        <LoginButton />
        <CartWidget  />
      </div>
    </nav>
  );
};

export default NavBar;