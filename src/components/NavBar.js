import React from 'react';
import { Link } from 'react-router-dom';
import CartWidget from './CartWidget/CartWidget';

const NavBar = () => {
  return (
    <nav>
      <Link to="/" className="d-flex justify-content-center m-2">
        <h3>Ecommerce</h3>
      </Link>
      
      <div className="d-flex justify-content-center m-2">
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
      
      <CartWidget />
    </nav>
  );
};

export default NavBar;