import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserTie, FaUsers, FaChartBar, FaSignOutAlt, FaClipboardList, FaUserGraduate, FaUserCheck, FaBuilding, FaGraduationCap, FaCog, FaHistory, FaUserPlus } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
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
  const { user } = useAuth();

  // Función para obtener los enlaces según el rol
  const getNavItems = () => {
    // Si no hay usuario, no mostramos nada
    if (!user) return [];

    // Enlaces comunes para todos los roles
    const commonItems = [
      { to: '/dashboard', icon: <FaHome />, text: 'Inicio' },
    ];

    // Si es funcionario
    if ((user.perfil as any).toLowerCase() === 'funcionario') {
      return [
        ...commonItems,
        { to: '/gestion-candidatos', icon: <FaUserTie />, text: 'Gestión de Candidatos' },
        { to: '/cargar-aprendices', icon: <FaUsers />, text: 'Cargar Aprendices' },
        { to: '/panel-metricas', icon: <FaChartBar />, text: 'Métricas' },
        { to: '/elecciones', icon: <FaClipboardList />, text: 'Elecciones' },
      ];
    }

    // Si es administrador
    if ((user.perfil as any).toLowerCase() === 'administrador') {
      return [
        { to: '/dashboard-admin', icon: <FaHome />, text: 'Dashboard' },
        { to: '/aprendices', icon: <FaUserGraduate />, text: 'Aprendices' },
        { to: '/funcionarios', icon: <FaUserTie />, text: 'Funcionarios' },
        { to: '/aprendiz-form', icon: <FaUserPlus />, text: 'Aprendiz Form' },
      ];
    }

    return commonItems;
  };

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

  const navItems = getNavItems();

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
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
              onClick={(e) => handleNavigation(e, item.to)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.text}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link
            to="/logout"
            className="sidebar-link"
            onClick={(e) => handleNavigation(e, '/logout')}
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
