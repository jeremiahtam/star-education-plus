import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import BodyWrapper from '../../components/BodyWrapper';
import EditSchoolProfile from '../../components/EditSchoolProfile';
import AdminChangeSchoolPassword from '../../components/AdminChangeSchoolPassword';
import EditSchoolProfilePic from '../../components/EditSchoolProfilePic';
import { store } from '../../store/root-reducer';
import { deleteUserData } from '../../store/actions/user-info';

function AdminViewSchoolProfile() {
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  console.log(selectedSchool)

  const getSchoolHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-school-by-id`,
        {
          params: {
            id: schoolId
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
  };

  useEffect(() => {
    if (userInfoData !== null && userInfoData !== undefined) {
      getSchoolHandler()
    }
  }, [userInfoData])

  return (
    <BodyWrapper title='School Profile'>
      <Row className='mb-3'>
        <Col md={'12'}>
          <div className='compartment'>
            {selectedSchool !== null && <EditSchoolProfilePic selectedSchool={selectedSchool} />}
          </div>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col md={'12'}>
          {selectedSchool !== null &&
            <div className="profile-links">
              <Link to={`/schools/${selectedSchool.id}/packages-and-services`}>Packages and Services</Link>
              <Link to={`/schools/${selectedSchool.id}/service-providers`}>Service Provicers</Link>
            </div>
          }
        </Col>
      </Row>
      <Row>
        <Col md={'8'}>
          <div className='compartment'>
            {selectedSchool !== null && <EditSchoolProfile selectedSchool={selectedSchool} />}
          </div>
        </Col>
        <Col md={'4'}>
          <Row>
            <Col md={'12'}>
              <div className='compartment'>
                {selectedSchool !== null && <AdminChangeSchoolPassword selectedSchool={selectedSchool} />}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </BodyWrapper>
  )
}

export default AdminViewSchoolProfile