import { createBrowserRouter } from 'react-router-dom';
import PosPage from '../pages/pos/PoSPage';
import SalesPage from '../pages/sales/SalesPage';
import TransactionPage from '../pages/transactions/TransactionPage';
import Layout from '../layouts/Layout';
import DashboardPage from '../pages/dashboard/DashboardPage';

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
