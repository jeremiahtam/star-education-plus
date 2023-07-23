import { Button, Row } from "react-bootstrap"
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate } from "react-router"

function ErrorPage() {
  const navigate = useNavigate()

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
