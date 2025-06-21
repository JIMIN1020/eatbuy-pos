import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useSaveData } from '../hooks/useSaveData';

function Layout() {
  useSaveData();

  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
