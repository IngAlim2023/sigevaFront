import { Link } from "react-router-dom";
import { TbLogout } from "react-icons/tb";


const Navbar = () => {


  return (
    <nav className="navbar navbar-light bg-light shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Título o Logo */}
        <Link className="navbar-brand fw-bold text-primary m-0 logo-text" to="/home">
          <img
            src={"../public/Sigeva.svg"}
            alt="Logo"
            style={{ height: "30px" }} // puedes ajustar tamaño
          />
        </Link>

        {/* Icono logout */}
        <Link to="/" className="nav-link">
          <TbLogout size={24} className="text-danger" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;