import React, { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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
import AdminViewSchoolProfile from './views/admin/AdminViewSchoolProfile';
import { useSelector } from 'react-redux';
import { loadUserData } from './store/actions/user-info';
import { stateLoggedInUserType } from '../types/type-definitions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  // const publicRouter = createBrowserRouter([
  //   {
  //     path: "/admin-login",
  //     element: <AdminLogin />,
  //     errorElement: <ErrorPage />,
  //   }])

  const schoolRouter = createBrowserRouter([
    {
      path: "/admin-login",
      element: <AdminLogin />,
      errorElement: <ErrorPage />,
    }])
  const adminRouter = createBrowserRouter([
    {
      path: "/admin-login",
      element: <AdminLogin />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/',
      element: <AdminDashboard />,
      errorElement: <ErrorPage />,
      children: [{
        path: '/dashboard',
        element: <AdminMetrics />,
      },
      {
        path: '/broadcasts',
        element: <AdminBroadcasts />,
      },
      {
        path: '/membership-plans',
        element: <AdminMembershipPlans />,
      },
      {
        path: '/schools',
        errorElement: <ErrorPage />,
        children: [{
          path: '/schools',
          element: <AdminSchools />,
          errorElement: <ErrorPage />
        },
        {
          path: '/schools/:userId',
          element: <AdminViewSchoolProfile />,
          errorElement: <ErrorPage />
        }]
      },
      {
        path: '/packages-and-services',
        element: <AdminPackagesAndServices />,
      },
      {
        path: '/resources',
        element: <AdminResources />,
      },
      {
        path: '/service-providers',
        element: <AdminServiceProviders />,
      },
      {
        path: '/document-upload',
        element: <AdminDocumentUpload />,
      },
      {
        path: '/invoices',
        element: <AdminInvoices />,
      },
      {
        path: '/messages',
        element: <AdminMessages />,
      }]
    }
  ]);

  return (
    <RouterProvider router={adminRouter} />
  );
}

export default App;
