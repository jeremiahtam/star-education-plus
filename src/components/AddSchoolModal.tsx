import { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import 'react-phone-number-input/style.css'

function AddSchoolModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [membershipPlansList, setMembershipPlansList] = useState<any>()

  useEffect(() => {
    getMembershipPlansHandler()
  }, [])
  const getMembershipPlansHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/membership-plans-list`,
        {
          params: {
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });

      const resData = res.data;
      // console.log(resData.data);
      if (resData.success == false) {

      } else {
        setMembershipPlansList(resData.data)
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

  const addSchoolHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/create-school`,
        values,
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
        props.loadSchool()
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
        initialValues={{
          schoolName: '',
          address: '',
          email: '',
          password: '',
          status: '',
          fullName: '',
          phoneNumber: '',
          numberOfStaff: '',
          numberOfPupils: '',
          chairOfTrusteesName: '',
          headTeacherName: '',

          membershipPlanId: '',

          // schoolImprovementPartner: '',
          consultantAppointed: '',
          consultantContact: '',
        }}
        validationSchema={Yup.object({
          schoolName: Yup.string().required('Cannot be empty!'),
          address: Yup.string().required('Enter an address'),
          email: Yup.string().required('Enter an email').email('Email is invalid'),
          password: Yup.string().required('Enter a password').min(8, 'Enter a minimum of 8 characters'),
          status: Yup.string().required('Select status'),
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

          membershipPlanId: Yup.number().typeError('Enter a number')
            .required('Cannot be empty').integer('Select plan')
            .positive('Enter a positive number'),

          // schoolImprovementPartner: Yup.string().required('Enter a partner'),
          consultantAppointed: Yup.string().required('Enter a consultant'),
          consultantContact: Yup.string().required('Enter contact'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          addSchoolHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="add-school" name="add-school">
            <Modal.Header closeButton>
              <Modal.Title>Add School</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="align-items-center">
                <Col xs="auto" lg={'12'} className='form-instructions'>The fields marked * are compulsory</Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'12'}>
                  <Form.Group className="mb-3"  >
                    <Form.Label className=''>School Name*</Form.Label>
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
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Email*</Form.Label>
                    <Field className="form-control custom-text-input" type="email" placeholder="Email" name='email' id='email'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="email" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="password">Password*</Form.Label>
                    <Field className="form-control custom-text-input" type="password" placeholder="Password" name='password' id='password'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="password" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="status">Status*</Form.Label>
                    <Form.Select onChange={(selectedOption: any) =>
                      setFieldValue(
                        'status',
                        selectedOption.target.value,
                      )} aria-label="Default select example" id='status' name='status' className='custom-text-input'>
                      <option value={''}>-- select status --</option>
                      <option value="pending review">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="suspended">Suspended</option>
                    </Form.Select>
                    <div className="form-error">
                      <ErrorMessage name="status" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Full Name*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Enter school admin name" name='fullName' id='fullName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="fullName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={4}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inlineFormInputGroup">Phone Number*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Phone number" name='phoneNumber' id='phoneNumber'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="phoneNumber" />
                    </div>
                  </Form.Group>
                </Col>

                <Col xs='auto' lg={4}>
                  <Form.Group className="mb-3"  >
                    <Form.Label className='form-labels'>Membership Plan</Form.Label>
                    <Form.Select className='custom-text-input' name={`membershipPlanId`}
                      onChange={(selectedOption: any) => {
                        setFieldValue(`membershipPlanId`, selectedOption.target.value)
                      }}
                      value={values.membershipPlanId}>
                      <option value=''>-- select --</option>
                      {membershipPlansList &&
                        membershipPlansList.map((item: any, index: number) => {
                          return (
                            <option key={index} value={item.id}>{item.name}</option>
                          )
                        })}
                    </Form.Select>
                    <div className="form-error">
                      <ErrorMessage name={`membershipPlanId`} />
                    </div>
                  </Form.Group>
                </Col>

              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Number of Pupils*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Number of pupils" name='numberOfPupils' id='numberOfPupils'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="numberOfPupils" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="numberOfStaff">Number of Staff*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Numer of staff" name='numberOfStaff' id='numberOfStaff'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="numberOfStaff" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Chair of Trustees Name</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Chair of trustees name" name='chairOfTrusteesName' id='chairOfTrusteesName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="chairOfTrusteesName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
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

              <Row className="align-items-center">
                {/* <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>School Improvement Partner*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="School Improvement Partner" name='schoolImprovementPartner' id='schoolImprovementPartner'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="schoolImprovementPartner" />
                    </div>
                  </Form.Group>
                </Col> */}
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="consultantAppointed">Consultant Appointed*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Consultant Appointed" name='consultantAppointed' id='consultantAppointed'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="consultantAppointed" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="consultantContact">Consultant Contact*</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Consultant Contact" name='consultantContact' id='consultantContact'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="consultantContact" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}>  Close </Button>
              <Button className="btn-custom" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AddSchoolModal
