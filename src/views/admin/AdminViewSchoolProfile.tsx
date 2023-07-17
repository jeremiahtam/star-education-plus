import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import BodyWrapper from '../../components/BodyWrapper';
import EditSchoolProfile from '../../components/EditSchoolProfile';
import AdminChangeSchoolPassword from '../../components/AdminChangeSchoolPassword';

function AdminViewSchoolProfile() {
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)

  const getSchoolHandler = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/get-school-by-id`,
        {
          params: {
            id: schoolId
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 10000,
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
      <Row>
        <Col md={'8'}>
          {selectedSchool !== null && <EditSchoolProfile selectedSchool={selectedSchool} />}
        </Col>
        <Col md={'4'}>
          <Row>
            {selectedSchool !== null && <AdminChangeSchoolPassword selectedSchool={selectedSchool} />}
          </Row>
          <Row>
          </Row>
        </Col>
      </Row>
    </BodyWrapper>
  )
}

AdminViewSchoolProfile.propTypes = {}

export default AdminViewSchoolProfile
