import './App.css';
import { useEffect } from 'react';
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
import { store } from '../src/store/root-reducer'
import { insertUserData, loadUserData } from '../src/store/actions/user-info'
import { navToggleClassStateType, stateLoggedInUserType } from '../types/type-definitions'
import { useSelector } from 'react-redux'
import SchoolLogin from './views/school/SchoolLogin';
import SchoolSignup from './views/school/SchoolSignup';
import SchoolRecoverPassword from './views/school/SchoolRecoverPassword';
import SchoolEnterPasswordRecoveryCode from './views/school/SchoolEnterPasswordRecoveryCode';
import SchoolChangePassword from './views/school/SchoolChangePassword';
import SchoolDashboard from './views/school/SchoolDashboard';
import SchoolMetrics from './views/school/SchoolMetrics';
import AdminPackagesAndServicesAttendance from './views/admin/AdminPackagesAndServicesAttendance';
import AdminResourcesAttendance from './views/admin/AdminResourcesAttendance';
import SchoolInvoices from './views/school/SchoolInvoices';
import SchoolPackagesAndServices from './views/school/SchoolPackagesAndServices';
import SchoolResources from './views/school/SchoolResources';
import SchoolServiceProviders from './views/school/SchoolServiceProviders';
import SchoolProfile from './views/school/SchoolProfile';
import SchoolMembershipPlans from './views/school/SchoolMembershipPlans';
import SchoolBroadcasts from './views/school/SchoolBroadcasts';
import SchoolResourcesList from './views/school/SchoolResourcesList';
import SchoolMembershipPlansHistory from './views/school/SchoolMembershipPlansHistory';
import SchoolCheckout from './views/school/SchoolCheckout';

function App() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  useEffect(() => {
    store.dispatch(loadUserData())
  }, [])

  return (
    <Routes>
      {/* For admin login but can be accessed by anyone when*/}
      <Route path='/admin-login' element={<AdminLogin />} />

      {/* For admin when logged into their portal */}
      {userInfoData?.userType == 'admin' &&
        <Route path='/' element={<AdminDashboard />}>
          <Route path='/' element={<AdminMetrics />} />
          <Route path='/dashboard' element={<AdminMetrics />} />
          <Route path='/broadcasts' element={<AdminBroadcasts />} />
          <Route path='/membership-plans' element={<AdminMembershipPlans />} />
          <Route path='/schools'>
            <Route path='/schools' element={<AdminSchools />} />
            <Route path='/schools/:schoolId' element={<AdminViewSchoolProfile />} />
            <Route path='/schools/:schoolId/service-providers' element={<AdminServiceProviders />} />
            <Route path='/schools/:schoolId/packages-and-services'
              element={<AdminViewSchoolPackagesAndServices />} />
          </Route>
          <Route path='/packages-and-services' element={<AdminPackagesAndServices />} />
          <Route path='/resources' >
            <Route path='/resources' element={<AdminResources />} />
            <Route path='/resources/resources-document-upload/:resourcesId' element={<AdminResourcesDocumentUpload />} />
            {/* <Route path='/resources/resources-attendance/:resourcesId' element={<AdminResourcesAttendance />} /> */}
          </Route>
          <Route path='/packages-and-services-document-upload/:schoolId/:orderedItemsId'
            element={<AdminPackagesAndServicesDocumentUpload />} />
          {/* <Route path='/packages-and-services-attendance/:schoolId/:orderedItemsId'
            element={<AdminPackagesAndServicesAttendance />} /> */}
          <Route path='/invoices' element={<AdminInvoices />} />
          <Route path='/messages' element={<AdminMessages />} />
        </Route>}

      {/* For schools to login but can be accessed by anyone when*/}
      <Route path='/' element={<SchoolLogin />} />
      {/* <Route path='/signup' element={<SchoolSignup />} /> */}
      <Route path='/recover-password' element={<SchoolRecoverPassword />} />
      <Route path='/enter-recovery-code' element={<SchoolEnterPasswordRecoveryCode />} />
      <Route path='/change-password' element={<SchoolChangePassword />} />

      {/* For schools only. Can be accessed by after school logs in*/}
      {userInfoData?.userType == 'school' &&
        <Route path='/' element={<SchoolDashboard />}>
          <Route path='/' element={<SchoolMetrics />} />
          <Route path='/dashboard' element={<SchoolMetrics />} />
          <Route path='/broadcasts' element={<SchoolBroadcasts />} />
          <Route path='/membership-plans' element={<SchoolMembershipPlans />} />
          <Route path='/membership-plans-history' element={<SchoolMembershipPlansHistory />} />
          <Route path='/packages-and-services' element={<SchoolPackagesAndServices />} />

          <Route path='/resources' >
            <Route path='/resources' element={<SchoolResources />} />
            <Route path='/resources/:resourcesId' element={<SchoolResourcesList />} />
          </Route>
          <Route path='/service-providers' element={<SchoolServiceProviders />} />
          <Route path='/checkout' element={<SchoolCheckout />} />
          <Route path='/invoices' element={<SchoolInvoices />} />
          <Route path='/profile' element={<SchoolProfile />} />
        </Route>}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
