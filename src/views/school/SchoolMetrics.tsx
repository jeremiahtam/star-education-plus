import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import BodyWrapper from '../../components/BodyWrapper'
import { useSelector } from 'react-redux'
import { Alert, Badge, Card, Col, Row, Image } from 'react-bootstrap'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import BroadcastModal from '../../components/BroadcastModal';
import { Link, useNavigate } from 'react-router-dom';
import menuItems from '../../data/menuItems';
import personIcon from '../../images/person-icon.png'

function SchoolMetrics() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const backEndImageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataContent, setModalDataContent] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataId: number, _modalType: string) => {
    handleShow()
    setModalDataContent(_dataId)
    setModalType(_modalType)
    console.log(`${_dataId} ${_modalType}`)
  }, [setModalType, setModalDataContent])

  const [broadcasts, setBroadcasts] = useState<any>()

  useEffect(() => {
    getBroadcastsHandler()
  }, [userInfoData])

  const getBroadcastsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-broadcasts`, {
        params: {
          search: '',
          itemsPerPage: 7,
          page: 1
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setBroadcasts(resData)
      } else {
        setBroadcasts(resData)
        // setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setBroadcasts({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setBroadcasts({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setBroadcasts({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <BodyWrapper title={``}>
      <Row className=''>
        <Col lg={12}>
          <div className='dashboard-image-box'>
            <Image
              src={userInfoData.userProfilePic == null || "" ?
                personIcon : `${backEndImageBaseUrl}/${userInfoData.userProfilePic}`}
            />
          </div>
          <div >{`Hi, ${userInfoData.userFullname}.`}</div>
          <div className='dashboard-sub-heading'>{userInfoData.schoolName}</div>
        </Col>
      </Row>

      <Row className=''>
        <Col lg={8} md={7} className='mb-3'>
          <div className='dashboard-sub-heading'>Broadcasts</div>
          {broadcasts?.success === false && !broadcasts?.data &&
            <Alert className='form-feedback-message' variant={"danger"} dismissible>
              <div>{broadcasts?.message}</div>
            </Alert>}

          {broadcasts?.data && <>
            <Card className='dashboard-broadcasts-card'>
              <Card.Body>
                {broadcasts.data?.length !== 0 &&
                  <>
                    {broadcasts.data.map((item: any, index: number) => {
                      return (
                        <div className='broadcast-item' key={index}
                          onClick={() => {
                            modalDataHandler(item, 'view-broadcast')
                          }}>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>
                            {item.excerpt}
                          </Card.Text>
                        </div>
                      )
                    })}

                  </>}

                {broadcasts.data?.length == 0 &&
                  <Alert className='form-feedback-message' variant={"info"} dismissible>
                    <div>{broadcasts?.message}</div>
                  </Alert>}
              </Card.Body>

              {broadcasts.data?.length !== 0 &&
                <Card.Footer>
                  <Link to={'/broadcasts'}>
                    See all broadcasts
                  </Link>
                </Card.Footer>
              }
            </Card>
          </>}
          {modalType && <BroadcastModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataContent={modalDataContent} />}
        </Col>
        <Col lg={4} md={5} className='mb-3'>
          <Card className='right-side-dashboard-card mb-3'>
            <Card.Body>
              <Card.Title>Membership Plan</Card.Title>
              <Card.Text>Basic Plan Expires <Badge bg='primary' className='float-end'>12th May, 2024</Badge></Card.Text>
            </Card.Body>
          </Card>
          <Card className='right-side-dashboard-card mb-3'>
            <Card.Body>
              <Card.Title>Membership Tracker</Card.Title>
              <Card.Text>Workshops attended <Badge bg='info' className='float-end'>
                {userInfoData.workshopsAttended}
              </Badge></Card.Text>
              <Card.Text>Webinars attended <Badge bg='info' className='float-end'>
                {userInfoData.webinarsAttended}
              </Badge></Card.Text>
              <Card.Text>Masterclasses attended <Badge bg='info' className='float-end'>
                {userInfoData.masterclassesAttended}
              </Badge></Card.Text>
            </Card.Body>
          </Card>
          <Card className='right-side-dashboard-card mb-3'>
            <Card.Body>
              <Card.Title>School Imporvement Partner</Card.Title>
              <Card.Text>{userInfoData.schoolImprovementPartner}</Card.Text>
            </Card.Body>
          </Card>

          <Card className='right-side-dashboard-card mb-3'>
            <Card.Body>
              <Card.Title>Consultant Improvement Partner</Card.Title>
              <Card.Text>Consultant appointed: {userInfoData.consultantAppointed}</Card.Text>
              <Card.Text>Contact details: {userInfoData.consultantContact}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='dashboard-menu-row'>
        <div className='dashboard-sub-heading'>Navigation</div>
        {menuItems.map((item, index) => {
          const Icon = item.iconName
          return (
            <Col lg={3} md={3} className='mb-3' key={index}>
              <Card className='dashboard-menu-box' onClick={() => {
                navigate(`/${item.itemLink}`)
              }}>
                <Card.Body>
                  <div className='icon-block' style={{ background: item.bgColor }}>
                    <Icon size={40} className='icon mb-3' color='#ffffff' />
                  </div>
                  <div className='text-block'>
                    {item.itemName}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </BodyWrapper>
  )
}

export default SchoolMetrics