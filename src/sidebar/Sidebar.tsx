import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserTie, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
// import logo2 from '../assets/icon-sena-2.svg';
import logo1 from '../assets/icon-sena-sigeva.svg'
import "./sidebar.css";
import { useAuth } from '../context/auth/auth.context';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const {logout} = useAuth();

  const handleClose = useCallback(() => {
    setShow(false);
    onNavigate?.();
  }, [onNavigate]);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) handleClose();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleClose]);

  const handleNavigation = useCallback((e: React.MouseEvent, to: string) => {
    e.preventDefault();
    navigate(to);
    handleClose();
  }, [navigate, handleClose]);

  const navItems = [
    { to: '/dashboard', icon: <FaHome />, text: 'Inicio' },
    { to: '/gestion-candidatos', icon: <FaUserTie />, text: 'Gestión de Candidatos' },
    { to: '/cargar-aprendices', icon: <FaUsers />, text: 'Cargar Aprendices' },
    { to: '/panel-metricas', icon: <FaChartBar />, text: 'Métricas' },
    { to: '/elecciones', icon: <FaClipboardList />, text: 'Elecciones' },
    
  ];

  const renderNavItem = (item: typeof navItems[0]) => (
    <Link
      key={item.to}
      to={item.to}
      className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
      onClick={(e) => handleNavigation(e, item.to)}
    >
      <span className="sidebar-icon">{item.icon}</span>
      <span className="sidebar-text">{item.text}</span>
    </Link>
  );

  return (
    <>
      {/* Botón de menú en móvil */}
      {isMobile && (
        <Button variant="light" className="sidebar-toggle" onClick={handleShow}>
          <BsList size={24} />
        </Button>
      )}

      {/* Contenido del Sidebar */}
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <img src={logo1} alt="SENA" className="logo-sena" />
        </div>
        <nav className="sidebar-nav">
          {navItems.map(renderNavItem)}
        </nav>
        <div className="sidebar-footer">
          <Link
            to="/"
            className="sidebar-link"
            onClick={logout}
          >
            <FaSignOutAlt className="sidebar-icon" />
            <span className="sidebar-text">Cerrar Sesión</span>
          </Link>
        </div>
      </div>

      {/* Overlay para móvil */}
      {show && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
