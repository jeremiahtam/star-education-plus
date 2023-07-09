import { ReactNode, useEffect } from 'react'
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from "../../types/type-definitions"
import { store } from '../store/root-reducer'
import { loadUserData } from '../store/actions/user-info'

interface ProtectedRoutePropType {
  children: ReactNode,
}
function ProtectedRoute(props: ProtectedRoutePropType) {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  useEffect(() => {
    store.dispatch(loadUserData)
  }, [userInfoData])

  if (userInfoData == null) {
    return <Navigate replace to={'/admin-login'} />
  }
  return props.children
}

export default ProtectedRoute
