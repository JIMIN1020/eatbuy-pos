import { createBrowserRouter } from 'react-router-dom';
import PosPage from '../pages/PoSPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionPage from '../pages/TransactionPage';
import Layout from '../components/Layout';

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
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/transactions',
        element: <TransactionPage />,
      },
    ],
  },
]);

export default router;
