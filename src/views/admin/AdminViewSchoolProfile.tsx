import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import BodyWrapper from '../../components/BodyWrapper';
import EditSchoolProfile from '../../components/EditSchoolProfile';
import AdminChangeSchoolPassword from '../../components/AdminChangeSchoolPassword';
import EditSchoolProfilePic from '../../components/EditSchoolProfilePic';

function AdminViewSchoolProfile() {
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)

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
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
      }
    }
  };

  useEffect(() => {
    if (userInfoData !== null) {
      getSchoolHandler()
    }
  }, [userInfoData])

  return (
    <BodyWrapper title='School Profile'>
      <Row className='mb-3'>
        {selectedSchool !== null && <EditSchoolProfilePic selectedSchool={selectedSchool} />}
      </Row>
      <Row>
        <Col md={'8'}>
          {selectedSchool !== null && <EditSchoolProfile selectedSchool={selectedSchool} />}
        </Col>
        <Col md={'4'}>
          <Row>
            <Col md={'12'}>
              {selectedSchool !== null && <AdminChangeSchoolPassword selectedSchool={selectedSchool} />}
            </Col>
          </Row>
        </Col>
      </Row>
    </BodyWrapper>
  )
}

export default AdminViewSchoolProfile