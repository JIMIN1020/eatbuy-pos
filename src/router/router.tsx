import { createBrowserRouter } from 'react-router-dom';
import PosPage from '../pages/PoSPage';
import SalesPage from '../pages/SalesPage';
import TransactionPage from '../pages/TransactionPage';
import Layout from '../components/Layout';
import DashboardPage from '../pages/Dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PosPage />,
      },
      {
        path: '/sales',
        element: <SalesPage />,
      },
      {
        path: '/transactions',
        element: <TransactionPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

export default router;
