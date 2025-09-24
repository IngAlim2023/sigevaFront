import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserTie, FaUsers, FaChartBar, FaSignOutAlt, FaClipboardList, FaUserGraduate, FaUserPlus, FaChevronDown } from 'react-icons/fa';
import { Button, Dropdown } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import "./sidebar.css";
import { useAuth } from '../context/auth/auth.context';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const isAdmin = user?.perfil?.toLowerCase() === 'administrador';
  const sidebarClass = isAdmin ? 'admin-sidebar' : '';

  const handleClose = useCallback(() => {
    setShowSidebar(false);
    onNavigate?.();
  }, [onNavigate]);

  const handleShow = useCallback(() => {
    setShowSidebar(true);
  }, []);

  // Manejar redimensionamiento de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtener los enlaces según el rol del usuario
  const getNavItems = useCallback(() => {
    if (!user) return [];

    const commonItems = [];

    if (user.perfil?.toLowerCase() === 'funcionario') {
      return [
        { to: '/dashboard', icon: <FaHome />, text: 'Inicio', type: 'link' },
        { 
          type: 'dropdown', 
          text: 'Gestión de Usuarios', 
          icon: <FaUsers />,
          items: [
            { to: '/aprendices', icon: <FaUserGraduate />, text: 'Aprendices' },
          ] 
        },
        // { to: '/gestion-candidatos', icon: <FaUserTie />, text: 'Gestión de Candidatos', type: 'link' },
        { to: '/cargar-aprendices', icon: <FaUserPlus />, text: 'Cargar Aprendices', type: 'link' },
        //{ to: '/panel-metricas', icon: <FaChartBar />, text: 'Métricas', type: 'link' },
        { to: '/elecciones', icon: <FaClipboardList />, text: 'Elecciones', type: 'link' },
      ];
    }

    if (user.perfil?.toLowerCase() === 'administrador') {
      return [
        { to: '/dashboard-admin', icon: <FaHome />, text: 'Dashboard', type: 'link' },
        { 
          type: 'dropdown', 
          text: 'Gestión de Usuarios', 
          icon: <FaUsers />,
          items: [
            { to: '/aprendices', icon: <FaUserGraduate />, text: 'Aprendices' },
            { to: '/funcionarios', icon: <FaUserTie />, text: 'Funcionarios' },
             { to: '/cargar-aprendices-admin', icon: <FaUserPlus/>, text: 'Cargar aprendices' },
          ] 
        },
        { to: '/aprendiz-form', icon: <FaUserPlus />, text: 'Añadir Aprendiz', type: 'link' },
      ];
    }

    return commonItems;
  }, [user]);

  const handleNavigation = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    navigate(to);
    if (isMobile) {
      setShowSidebar(false);
      onNavigate?.();
    }
  };

  const navItems = getNavItems();
  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      {/* Botón de menú en móvil */}
      {isMobile && (
        <Button 
          variant="light" 
          className="sidebar-toggle" 
          onClick={() => setShowSidebar(true)}
        >
          <BsList size={24} />
        </Button>
      )}

      {/* Overlay para móvil */}
      {isMobile && showSidebar && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Contenido del Sidebar */}
      <div className={`sidebar-container ${sidebarClass} ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img 
            src="/src/assets/icon-sena-sigeva.svg" 
            alt="SENA" 
            className="logo-sena" 
          />
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            if (item.type === 'dropdown') {
              return (
                <Dropdown key={index} className="sidebar-dropdown">
                  <Dropdown.Toggle as="div" className={`sidebar-link ${item.items.some(i => isActive(i.to)) ? 'active' : ''}`}>
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-text">{item.text}</span>
                    <FaChevronDown className="ms-auto" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="sidebar-submenu">
                    {item.items.map((subItem, subIndex) => (
                      <Dropdown.Item 
                        key={subIndex}
                        as={Link}
                        to={subItem.to}
                        className={`dropdown-item ${isActive(subItem.to) ? 'active' : ''}`}
                        onClick={(e: React.MouseEvent) => handleNavigation(e, subItem.to)}
                      >
                        <span className="sidebar-icon">{subItem.icon}</span>
                        <span className="sidebar-text">{subItem.text}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              );
            }
            
            return (
              <Link
                key={index}
                to={item.to}
                className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                onClick={(e) => handleNavigation(e, item.to)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.text}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <button
            className="sidebar-link"
            onClick={(e) => {
              e.preventDefault();
              logout();
              navigate('/');
            }}
          >
            <FaSignOutAlt className="sidebar-icon" />
            <span className="sidebar-text">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
