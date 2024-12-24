import CarWidget from "./CartWidget/CartWidget"

const NavBar = ()=>{
    return(
        <nav>
            <h3>
                Ecommerce
            </h3>
            <div>
                <button type="button" className="btn btn-primary"> Shoes </button>
                <button type="button" className="btn btn-primary"> Ropes </button>
                <button type="button" className="btn btn-primary"> Chalk bags </button>
            </div>
            <CarWidget />
        </nav>
    )

}

export default NavBar