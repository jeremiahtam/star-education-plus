import { useState } from 'react'
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function EditProfile(props: any) {
  const [updateProfileResponse, setUpdateProfileResponse] = useState<any>(null)
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const updateProfileHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/edit-school-profile/${props.selectedSchool.id}`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });
      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          setUpdateProfileResponse(resData)
        }
      } else {
        setUpdateProfileResponse(resData)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setUpdateProfileResponse({
          success: false,
          message: 'Time out'
        })
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
      }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        schoolName: props.selectedSchool.school_name,
        address: props.selectedSchool.address,
        email: props.selectedSchool.email,
        // status: props.selectedSchool.status,
        fullName: props.selectedSchool.fullname,
        phoneNumber: props.selectedSchool.phone_number,
        numberOfStaff: props.selectedSchool.number_of_staff,
        numberOfPupils: props.selectedSchool.number_of_pupils,
        chairOfTrusteesName: props.selectedSchool.chair_of_trustees_name,
        headTeacherName: props.selectedSchool.head_teacher_name,
      }}
      validationSchema={Yup.object({
        schoolName: Yup.string().required('Cannot be empty!'),
        address: Yup.string().required('Enter an address'),
        email: Yup.string().required('Enter an email').email('Email is invalid'),
        // status: Yup.string().required('Select status'),
        fullName: Yup.string().required('Enter a name'),
        phoneNumber: Yup.string().required('Enter phone number'),
        numberOfStaff: Yup.number().typeError('Enter a number')
          .required('Cannot be empty').integer('Enter a whole number')
          .positive('Enter a positive number'),
        numberOfPupils: Yup.number().typeError('Enter a number')
          .required('Cannot be empty').integer('Enter a whole number')
          .positive('Enter a positive number'),
        chairOfTrusteesName: Yup.string().nullable(),
        headTeacherName: Yup.string().nullable(),
      })}

      onSubmit={async (values, { setSubmitting, setErrors }) => {
        await updateProfileHandler(values, setSubmitting, setErrors)
        setTimeout(() => setUpdateProfileResponse(null), 5000)
      }}
    >
      {({
        isSubmitting
      }) => (
        <FormikForm method="POST" id="add-school" name="add-school">
          <h6 className='form-heading'>Profile</h6>
          {updateProfileResponse?.success &&
            <Alert className='form-feedback-message' onClose={() => setUpdateProfileResponse(null)}
              variant={updateProfileResponse?.success == true ? "success" : "danger"}
              dismissible>
              <div>{updateProfileResponse.message}</div>
            </Alert>}
          <Row className="align-items-center">
            <Col xs={"12"} lg={'12'} className='form-instructions'>The fields marked * are compulsory</Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={"12"} lg={'12'}>
              <Form.Group className="mb-3"  >
                <Form.Label className='form-labels'>School Name*</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Enter school name" name='schoolName' id='schoolName'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="schoolName" />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className='form-labels'>Adddress*</Form.Label>
            <Field className="form-control custom-text-input" type="text" placeholder="Enter school address" name='address' id='address'
              disabled={isSubmitting} />
            <div className="form-error">
              <ErrorMessage name="address" />
            </div>
          </Form.Group>
          <Row className="align-items-center">
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Email*</Form.Label>
                <Field className="form-control custom-text-input" type="email" placeholder="Email" name='email' id='email'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="email" />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Full Name*</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Enter school admin name" name='fullName' id='fullName'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="fullName" />
                </div>
              </Form.Group>
            </Col>
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Phone Number*</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Phone number" name='phoneNumber' id='phoneNumber'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="phoneNumber" />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Number of Pupils*</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Number of pupils" name='numberOfPupils' id='numberOfPupils'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="numberOfPupils" />
                </div>
              </Form.Group>
            </Col>
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Number of Staff*</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Numer of staff" name='numberOfStaff' id='numberOfStaff'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="numberOfStaff" />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Chair of Trustees Name</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Chair of trustees name" name='chairOfTrusteesName' id='chairOfTrusteesName'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="chairOfTrusteesName" />
                </div>
              </Form.Group>
            </Col>
            <Col xs={"12"} lg={'6'}>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Head Teacher Name</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Head teacher's name" name='headTeacherName' id='headTeacherName'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="headTeacherName" />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Button className='btn btn-custom' type='submit'>Submit</Button>
        </FormikForm>
      )}
    </Formik>
  )
}

export default EditProfile