import React, { useState, useEffect, useCallback } from 'react'
import { Navigate, Outlet, redirect, useNavigate } from 'react-router-dom'
import TopNav from "../../components/TopNav"
import SideBarNav from "../../components/SideBarNav"
import { useSelector } from 'react-redux'
import { navToggleClassStateType, stateLoggedInUserType } from '../../../types/type-definitions'
import { store } from '../../store/root-reducer'
import { insertUserData, loadUserData } from '../../store/actions/user-info'

const AdminDashboard = () => {
  const navigate = useNavigate();
  //Toggle side nav bar
  const navToggleClass = useSelector((state: navToggleClassStateType) => state.navToggle.navbarClass)

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  useEffect(() => {
    store.dispatch(loadUserData())
  }, [])

  useEffect(() => {
    if (userInfoData === null) {//only if it is NULL***
      console.log(userInfoData)
      navigate('/admin-login')
    } else {
      // navigate('/dashboard')
    }
  }, [userInfoData])

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