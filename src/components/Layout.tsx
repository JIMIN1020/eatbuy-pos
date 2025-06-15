import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
