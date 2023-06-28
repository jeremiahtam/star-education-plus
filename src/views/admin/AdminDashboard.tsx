import React from 'react'
import PropTypes from 'prop-types'
import TopNav from "../../components/TopNav"
import SideBarNav from "../../components/SideBarNav"
import { useSelector } from 'react-redux'
import { navToggleClassStateType } from '../../../types/type-definitions'
import AdminMetrics from '../../views/admin/AdminMetrics';
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const navToggleClass = useSelector((state: navToggleClassStateType) => state.navToggle.navbarClass)
  return (
    <div className="wrapper">
      <SideBarNav />
      <div id="content" className={navToggleClass}>
        <TopNav />
        <Outlet />
      </div>
    </div>
  )
}

AdminDashboard.propTypes = {
}

export default AdminDashboard