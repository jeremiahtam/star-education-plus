import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import TopNav from "../../components/TopNav"
import SideBarNav from "../../components/SideBarNav"
import { useSelector } from 'react-redux'
import { navToggleClassStateType, stateLoggedInUserType } from '../../../types/type-definitions'
import { store } from '../../store/root-reducer'
import { loadUserData } from '../../store/actions/user-info'
import { Alert } from 'react-bootstrap'

const SchoolDashboard = () => {
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
      navigate('/')
    } else {
      // navigate('/dashboard')
    }
  }, [userInfoData])

  return (
    <div className="wrapper">
      <SideBarNav />
      <div id="content" className={navToggleClass}>
        <TopNav />
        {userInfoData.schoolStatus == 'pending review' &&
          <Alert className='form-feedback-message' variant={"info"} style={{ margin: '10px' }}>
            <div>
              You account is currently being assessed and pending approval.
              Please be patient while your account is being reviewed.Contact us at <a href='mailto:contact@stareducationplus.org.uk'>contact@stareducationplus.org.uk</a>
            </div>
          </Alert>}
        {userInfoData.schoolStatus == 'suspended' &&
          <Alert className='form-feedback-message' variant={"danger"} style={{ margin: '10px' }}>
            <div>
              You account is currently suspended. Contact the admin <a href='mailto:contact@stareducationplus.org.uk'>contact@stareducationplus.org.uk</a>
            </div>
          </Alert>}
        {userInfoData.schoolStatus == 'approved' && <Outlet />}
      </div>
    </div>
  )
}

export default SchoolDashboard