import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Button, Spinner } from "react-bootstrap"
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate } from "react-router"
import { stateLoggedInUserType } from "../../types/type-definitions"

function StartupLoadingPage() {
  const navigate = useNavigate()
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  console.log(userInfoData)
  useEffect(() => {
    if (userInfoData === null) {//only if it is NULL***
      console.log(userInfoData)
      navigate('/')
    } else {
      // navigate('/dashboard')
    }
  }, [userInfoData])

  return (
    <div className="error-container">
      <div className="container">
        <div className="error-body"><Spinner /> Loading...</div>
      </div>
    </div>
  )
}

export default StartupLoadingPage
