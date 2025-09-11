import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import '../Dashboard.css';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  role?: 'funcionario' | 'aprendiz';
}

const MainLayout = ({ children, showSidebar = true, role = 'funcionario' }: MainLayoutProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`main-layout ${role}`}>
      {showSidebar && role === 'funcionario' && (
        <>
          <div className={`sidebar-container ${isMobile ? 'mobile' : ''} ${sidebarOpen ? 'open' : ''}`}>
            <Sidebar onNavigate={() => isMobile && setSidebarOpen(false)} />
          </div>
          {isMobile && sidebarOpen && (
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          )}
        </>
      )}
      
      <main 
        className={`main-content ${showSidebar && role === 'funcionario' ? 'with-sidebar' : ''} ${isMobile ? 'mobile' : ''}`}
      >
        {showSidebar && role === 'funcionario' && isMobile && (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
        )}
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;