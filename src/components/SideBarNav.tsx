import React from 'react'
import { Link } from "react-router-dom";
import { IoIosHome, IoIosCloudUpload, IoMdSchool, IoMdClipboard, IoMdInformationCircle } from "react-icons/io";
import { RiDashboardLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { navToggleClassStateType } from '../../types/type-definitions'

const SideBarNav = (props: any) => {

  const navToggleClass = useSelector((state: navToggleClassStateType) => state.navToggle.navbarClass)

  return (
    <nav id={"sidebar"} className={navToggleClass}>
      <div className="sidebar-header">
        <div className="sidebar-header-text">Welcome Baby</div>
      </div>
      <ul className="list-unstyled components">
        <p>WELCOME </p>
        <li className=''>
          <Link to='/admin-dashboard'> <RiDashboardLine /> Dashboard</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/broadcasts"><IoMdSchool /> Broadcasts</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/membership-plans"><IoMdSchool /> Membership Plans</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/schools"><IoMdSchool /> Schools</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/packages-and-services"><IoMdSchool /> Packages & Services</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/resources"><IoMdSchool /> Resources</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/service-providers"><IoMdSchool /> Service Providers</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/document-upload"><IoMdSchool /> Document Upload</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/invoices"><IoMdSchool /> Invoices</Link>
        </li>
        <li className=''>
          <Link to="/admin-dashboard/messages"><IoMdSchool /> Messages</Link>
        </li>
      </ul>
      <ul className="list-unstyled CTAs">
        <li>
          <Link to="#" className="logout">Logout</Link>
        </li>
      </ul>
    </nav>
  )
}
export default SideBarNav