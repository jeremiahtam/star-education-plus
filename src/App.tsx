import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminDashboard from './views/admin/AdminDashboard';
import AdminMetrics from './views/admin/AdminMetrics';
import AdminLogin from './views/admin/AdminLogin';
import AdminBroadcasts from './views/admin/AdminBroadcasts';
import ErrorPage from './views/ErrorPage';
import AdminMembershipPlans from './views/admin/AdminMembershipPlans';
import AdminSchools from './views/admin/AdminSchools';
import AdminPackagesAndServices from './views/admin/AdminPackagesAndServices';
import AdminResources from './views/admin/AdminResources';
import AdminServiceProviders from './views/admin/AdminServiceProviders';
import AdminPackagesAndServicesDocumentUpload from './views/admin/AdminPackagesAndServicesDocumentUpload';
import AdminInvoices from './views/admin/AdminInvoices';
import AdminMessages from './views/admin/AdminMessages';
import AdminViewSchoolProfile from './views/admin/AdminViewSchoolProfile';
import AdminViewSchoolPackagesAndServices from './views/admin/AdminViewSchoolPackagesAndServices';
import AdminResourcesDocumentUpload from './views/admin/AdminResourcesDocumentUpload';
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/' element={<AdminDashboard />}>
        <Route path='/' element={<AdminMetrics />} />
        <Route path='/dashboard' element={<AdminMetrics />} />
        <Route path='/broadcasts' element={<AdminBroadcasts />} />
        <Route path='/membership-plans' element={<AdminMembershipPlans />} />
        <Route path='/schools' >
          <Route path='/schools' element={<AdminSchools />} />
          <Route path='/schools/:schoolId' element={<AdminViewSchoolProfile />} />
          <Route path='/schools/:schoolId/service-providers' element={<AdminServiceProviders />} />
          <Route path='/schools/:schoolId/packages-and-services'
            element={<AdminViewSchoolPackagesAndServices />} />
        </Route>
        <Route path='/packages-and-services' element={<AdminPackagesAndServices />} />
        <Route path='/resources' >
          <Route path='/resources' element={<AdminResources />} />
          <Route path='/resources/:resourcesId' element={<AdminResourcesDocumentUpload />} />
        </Route>
        <Route path='/packages-and-services-uploads/:schoolId/:orderedItemsId'
          element={<AdminPackagesAndServicesDocumentUpload />} />
        <Route path='/invoices' element={<AdminInvoices />} />
        <Route path='/messages' element={<AdminMessages />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
