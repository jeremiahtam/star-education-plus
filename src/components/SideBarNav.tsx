import React from 'react'
import { Link, redirect } from "react-router-dom";
import { IoIosHome, IoIosCloudUpload, IoMdSchool, IoMdClipboard, IoMdInformationCircle } from "react-icons/io";
import { RiDashboardLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { navToggleClassStateType } from '../../types/type-definitions'
import { Image } from 'react-bootstrap';
import SEPLogo from '../images/SEP-Logo-White-Final.png'
import axios from 'axios'
import { store } from '../store/root-reducer';
import { deleteUserData } from '../store/actions/user-info';
import { stateLoggedInUserType } from '../../types/type-definitions';

const SideBarNav = (props: any) => {

  const navToggleClass = useSelector((state: navToggleClassStateType) => state.navToggle.navbarClass)
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const logoutHandler = async (
  ) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin-logout`,
        {},
        {
          headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
        }
      );

      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
        } else {
        }
      } else {
        store.dispatch(deleteUserData());
        redirect('/admin-login')
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {

      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        // setErrors(errorData.errors);
      }
    }
  }

  return (
    <nav id={"sidebar"} className={navToggleClass}>
      <div className="sidebar-header">
        <Image src={SEPLogo} height={35} />
      </div>
      <ul className="list-unstyled components">
        <p>WELCOME </p>
        <li className=''>
          <Link to='/dashboard'> <RiDashboardLine /> Dashboard</Link>
        </li>
        <li className=''>
          <Link to="/broadcasts"><IoMdSchool /> Broadcasts</Link>
        </li>
        <li className=''>
          <Link to="/membership-plans"><IoMdSchool /> Membership Plans</Link>
        </li>
        <li className=''>
          <Link to="/schools"><IoMdSchool /> Schools</Link>
        </li>
        <li className=''>
          <Link to="/packages-and-services"><IoMdSchool /> Packages & Services</Link>
        </li>
        <li className=''>
          <Link to="/resources"><IoMdSchool /> Resources</Link>
        </li>
        <li className=''>
          <Link to="/service-providers"><IoMdSchool /> Service Providers</Link>
        </li>
        <li className=''>
          <Link to="/document-upload"><IoMdSchool /> Document Upload</Link>
        </li>
        <li className=''>
          <Link to="/invoices"><IoMdSchool /> Invoices</Link>
        </li>
        <li className=''>
          <Link to="/messages"><IoMdSchool /> Messages</Link>
        </li>
      </ul>
      <ul className="list-unstyled CTAs">
        <li>
          <Link to="#" className="logout" onClick={() => logoutHandler()}>Logout</Link>
        </li>
      </ul>
    </nav>
  )
}
export default SideBarNav