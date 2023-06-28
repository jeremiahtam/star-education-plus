import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminDashboard from './views/admin/AdminDashboard';
import AdminMetrics from './views/admin/AdminMetrics';
import AdminLogin from './views/admin/AdminLogin';
import AdminBroadcasts from './views/admin/AdminBroadcasts';
import { Provider } from 'react-redux'
import { store } from './store/root-reducer';
import SchoolLogin from './views/school/SchoolLogin';
import ErrorPage from './views/ErrorPage';
import AdminMembershipPlans from './views/admin/AdminMembershipPlans';
import AdminSchools from './views/admin/AdminSchools';
import AdminPackagesAndServices from './views/admin/AdminPackagesAndServices';
import AdminResources from './views/admin/AdminResources';
import AdminServiceProviders from './views/admin/AdminServiceProviders';
import AdminDocumentUpload from './views/admin/AdminDocumentUpload';
import AdminInvoices from './views/admin/AdminInvoices';
import AdminMessages from './views/admin/AdminMessages';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SchoolLogin />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/admin-login",
      element: <AdminLogin />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/admin-dashboard',
      element: <AdminDashboard />,
      errorElement: <ErrorPage />,
      children: [{
        path: '/admin-dashboard',
        element: <AdminMetrics />,
      },
      {
        path: '/admin-dashboard/broadcasts',
        element: <AdminBroadcasts />,
      },
      {
        path: '/admin-dashboard/membership-plans',
        element: <AdminMembershipPlans />,
      },
      {
        path: '/admin-dashboard/schools',
        element: <AdminSchools />,
      },
      {
        path: '/admin-dashboard/packages-and-services',
        element: <AdminPackagesAndServices />,
      },
      {
        path: '/admin-dashboard/resources',
        element: <AdminResources />,
      },
      {
        path: '/admin-dashboard/service-providers',
        element: <AdminServiceProviders />,
      },
      {
        path: '/admin-dashboard/document-upload',
        element: <AdminDocumentUpload />,
      },
      {
        path: '/admin-dashboard/invoices',
        element: <AdminInvoices />,
      },
      {
        path: '/admin-dashboard/messages',
        element: <AdminMessages />,
      }]
    }
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
