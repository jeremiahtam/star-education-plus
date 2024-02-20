import 'react-calendar/dist/Calendar.css';
import { useState } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { useSelector } from 'react-redux'
import { Card, Col, Row, Image } from 'react-bootstrap'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import personIcon from '../../images/person-icon.png'
import SchoolDashboardBroadcastsCard from '../../components/atoms/SchoolDashboardBroadcastsCard';
import { MdCardMembership, MdGraphicEq } from 'react-icons/md';
import SchoolDashboardInvoicesCard from '../../components/atoms/SchoolDashboardInvoicesCard';
import SchoolDashboardResourcesCard from '../../components/atoms/SchoolDashboardResourcesCard';
import SchoolDashboardServiceProvidersCard from '../../components/atoms/SchoolDashboardServiceProvidersCard';
import ReactDatePicker from 'react-datepicker';

function SchoolMetrics() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const backEndImageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const [currentDate, setCurrentDate] = useState(new Date());

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
    </BodyWrapper>
  )
}

export default SchoolMetrics