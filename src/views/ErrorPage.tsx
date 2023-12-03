import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "react-bootstrap"
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate } from "react-router"
import { stateLoggedInUserType } from "../../types/type-definitions"

function ErrorPage() {
  const navigate = useNavigate()
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
// console.log(userInfoData)
  useEffect(() => {
    if (userInfoData === null) {//only if it is NULL***
      // console.log(userInfoData)
      navigate('/')
    } else {
      // navigate('/dashboard')
    }
  }, [userInfoData])

  return (
    <div className="error-container">
      <div className="container">
        <div className="error-code">404</div>
        <div className="error-heading">Oops!</div>
        <div className="error-body">THIS PAGE DOES NOT EXIST OR IS UNAVAILABLE</div>
        <div className="error-action">
          <Button className="btn btn-custom-outline" onClick={() => {
            navigate(-1)
          }}>
            <HiOutlineArrowLeft /> Go To Previous Page
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
