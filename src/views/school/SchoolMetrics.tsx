import 'react-calendar/dist/Calendar.css';
import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import BodyWrapper from '../../components/BodyWrapper'
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux'
import { Alert, Badge, Card, Col, Row, Image, Button } from 'react-bootstrap'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import BroadcastModal from '../../components/BroadcastModal';
import { Link, useNavigate } from 'react-router-dom';
import menuItems from '../../data/menuItems';
import personIcon from '../../images/person-icon.png'
import SchoolDashboardBroadcastsCard from '../../components/atoms/SchoolDashboardBroadcastsCard';
import { MdCardMembership, MdGraphicEq, MdSelfImprovement } from 'react-icons/md';
import SchoolDashboardInvoicesCard from '../../components/atoms/SchoolDashboardInvoicesCard';
import SchoolDashboardResourcesCard from '../../components/atoms/SchoolDashboardResourcesCard';
import SchoolDashboardServiceProvidersCard from '../../components/atoms/SchoolDashboardServiceProvidersCard';
import ReactDatePicker from 'react-datepicker';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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


  const [broadcasts, setBroadcasts] = useState<any>()

  useEffect(() => {
    getBroadcastsHandler()
  }, [userInfoData])

  const [currentDate, setCurrentDate] = useState(new Date());

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
    <BodyWrapper title={`Dashboard`}>
      <Row>
        <Col md={9}>
          <Row className='school-dashboard-row-one'>
            <Col lg={7} md={7} className='mb-3'>
              <Card className='school-dashboard-user-box'>
                <div className='school-dashboard-image-box'>
                  <Image
                    src={userInfoData.userProfilePic == null || "" ?
                      personIcon : `${backEndImageBaseUrl}/${userInfoData.userProfilePic}`}
                  />
                </div>
                <div className='school-dashboard-user-info'>
                  <div>{`Welcome back, ${userInfoData.userFullname}.`}</div>
                  <div>{userInfoData.schoolName}</div>
                </div>
              </Card>
            </Col>
            <Col lg={5} md={5} className='mb-3'>
              <Card className='school-dashboard-user-box'>
                <div className='school-dashboard-user-info'>
                  <p>Consultant Improvement Partner</p>
                  <div>Consultant appointed: {userInfoData.consultantAppointed}</div>
                  <div>Contact details: {userInfoData.consultantContact}</div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className='school-dashboard-row-two'>
            <Col md={7} className='mb-3'>
              <Card className='school-dashboard-membership-tracker-box'>
                <p className='top'>
                  <div>Membership Tracker</div>
                  <MdGraphicEq className="icon" />
                </p>
                <Row>
                  <Col sm={4}>
                    <div className='tracker-title'>Workshops </div>
                    <div className='tracker-value'>{userInfoData.workshopsAttended}</div>
                  </Col>
                  <Col sm={4}>
                    <div className='tracker-title'>Webinars </div>
                    <div className='tracker-value'>{userInfoData.webinarsAttended}</div>
                  </Col>
                  <Col sm={4}>
                    <div className='tracker-title'>Masterclasses </div>
                    <div className='tracker-value'>
                      {userInfoData.masterclassesAttended}
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={5} className='mb-3'>
              <Card className='school-dashboard-plan-box'>
                <p className='top'>
                  <div>Membership Plan</div>
                  <MdCardMembership className="icon" />
                </p>
                <div className='bottom'>
                  <div className='plan-name'>Basic Plan</div>

                  <div className='plan-expiry'>Expires {userInfoData.planExpiryDate}</div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={3}>
          <div className='calendar-box'>
            <ReactDatePicker
              selected={currentDate}
              onChange={(date: any) => {
                setCurrentDate(date)
                window.open('https://www.stareducationplus.org.uk/upcoming-events', "_blank", "noreferrer");
              }}
              inline
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <SchoolDashboardBroadcastsCard />
        </Col>
        <Col md={6}>
          <SchoolDashboardResourcesCard />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <SchoolDashboardServiceProvidersCard />
        </Col>
        <Col md={6}>
          <SchoolDashboardInvoicesCard />
        </Col>
      </Row>

      {/* <Row className=''>
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
      </Row> */}
      {/* <Row className='dashboard-menu-row'>
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
      </Row> */}
    </BodyWrapper>
  )
}

export default SchoolMetrics