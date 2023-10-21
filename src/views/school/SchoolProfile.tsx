import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import BodyWrapper from '../../components/BodyWrapper';
import { store } from '../../store/root-reducer';
import { deleteUserData } from '../../store/actions/user-info';
import EditProfilePic from '../../components/EditProfilePic';
import ChangeSchoolPassword from '../../components/ChangeSchoolPassword';
import EditProfile from '../../components/EditProfile';

function SchoolProfile() {
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)

  useEffect(() => {
    if (userInfoData !== null && userInfoData !== undefined) {
      getSchoolHandler()
    }
  }, [userInfoData])

  const getSchoolHandler = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-by-id`,
        {
          params: {
            id: userInfoData.userId
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });

      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        navigate('/error-page')
      } else {
        setSelectedSchool(resData.data)
      }
    } catch (e: any) {
      navigate('/error-page')
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
        setSelectedSchool(null)
      }
    }
  }, []);

  return (
    <BodyWrapper title='School Profile'>
      <Row className='mb-3'>
        <Col md={'12'}>
          <div className='compartment'>
            <EditProfilePic />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={'8'}>
          <div className='compartment'>
            {selectedSchool !== null && <EditProfile selectedSchool={selectedSchool} />}
          </div>
        </Col>
        <Col md={'4'}>
          <Row>
            <Col md={'12'}>
              <div className='compartment'>
                <ChangeSchoolPassword />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </BodyWrapper>
  )
}

export default SchoolProfile