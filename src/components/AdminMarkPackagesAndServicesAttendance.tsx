import { useState, useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function AdminMarkPackagesAndServicesAttendance(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [selectedAttendance, setSelectedAttendance] = useState<any>();

  useEffect(() => {
    getAttendanceHandler()
  }, [])

  const getAttendanceHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-packages-and-services-attendance`,
        {
          params: {
            orderedItemsId: props.modalDataId
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });

      const resData = res.data;
      console.log(resData.data);
      if (resData.success == false) {

      } else {
        setSelectedAttendance(resData.data)
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

  const submitAttendance = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/update-packages-and-services-attendance`,
        {
          orderedItemsId: props.modalDataId,
          attendance: values.attendance
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        }
      );

      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {

        }
      } else {
        props.handleClose()
        props.loadSchoolPackagesAndServices()
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {

      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          attendance: selectedAttendance ? Boolean(selectedAttendance?.attendance) : false
        }}
        validationSchema={Yup.object({
          attendance: Yup.boolean().required(),
        })}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          submitAttendance(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="add-packages-and-services" name="add-packages-and-services">
            <Modal.Header closeButton>
              <Modal.Title>Packages and services attendance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3"  >
                <Form.Label className='form-labels'>Attendance</Form.Label>
                <Form.Check
                  type="checkbox"
                  id="custom-switch"
                  label="Mark attendance"
                  name='attendance'
                  checked={values.attendance}
                  onChange={() => {
                    setFieldValue('attendance', !values.attendance)
                  }}
                />
                <div className="form-error">
                  <ErrorMessage name="attendance" />
                </div>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
              <Button className="btn-custom" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AdminMarkPackagesAndServicesAttendance
