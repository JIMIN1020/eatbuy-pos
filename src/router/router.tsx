import { createBrowserRouter } from 'react-router-dom';
import PosPage from '../pages/PoSPage';
import DashboardPage from '../pages/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PosPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
]);

export default router;
