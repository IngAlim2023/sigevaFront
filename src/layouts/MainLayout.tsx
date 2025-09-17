import { ReactNode } from 'react';
import Sidebar from '../sidebar/Sidebar';
import '../Dashboard.css';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  role?: 'funcionario' | 'aprendiz' | 'administrador';
}

const MainLayout = ({ children, showSidebar = true, role = 'funcionario' }: MainLayoutProps) => {
  return (
    <div className={`main-layout ${role}`}>
      {showSidebar && role === 'funcionario' && <Sidebar />}
      
      <main className={`main-content ${showSidebar && role === 'funcionario' ? 'with-sidebar' : ''}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;