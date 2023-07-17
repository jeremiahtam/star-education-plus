import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function AddSchoolModal(props: any) {
  const [phoneNumber, setPhoneNumber] = useState()
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const addSchoolHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/create-school`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
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
          headTeacherName: Yup.string(),
          chairOfTrusteesName: Yup.string(),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          addSchoolHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue
        }) => (
          <FormikForm method="POST" id="add-school" name="add-school">
            <Modal.Header closeButton>
              <Modal.Title>Add School</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="align-items-center">
                <Col xs="auto" lg={'12'}>The fields marked * are compulsory</Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'12'}>
                  <Form.Group className="mb-3"  >
                    <Form.Label>School Name*</Form.Label>
                    <Field className="form-control" type="text" placeholder="Enter school name" name='schoolName' id='schoolName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="schoolName" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Adddress*</Form.Label>
                <Field className="form-control" type="text" placeholder="Enter school address" name='address' id='address'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="address" />
                </div>
              </Form.Group>
              <Row className="align-items-center">
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label>Email*</Form.Label>
                    <Field className="form-control" type="email" placeholder="Email" name='email' id='email'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="email" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inlineFormInputGroup">Password*</Form.Label>
                    <Field className="form-control" type="password" placeholder="Password" name='password' id='password'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="password" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'4'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inlineFormInputGroup">Status*</Form.Label>
                    <Form.Select
                      onChange={(selectedOption: any) =>
                        setFieldValue(
                          'status',
                          selectedOption.target.value,
                        )}
                      aria-label="Default select example" id='status' name='status'>
                      <option value={''}>-- select status --</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                    <div className="form-error">
                      <ErrorMessage name="status" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label>Full Name*</Form.Label>
                    <Field className="form-control" type="text" placeholder="Enter school admin name" name='fullName' id='fullName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="fullName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inlineFormInputGroup">Phone Number*</Form.Label>
                    {/* <PhoneInput
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={() => setPhoneNumber}
                      className="form-control"
                      name='phoneNumber' id='phoneNumber'
                      disabled={isSubmitting} /> */}
                    <Field className="form-control" type="text" placeholder="Phone number" name='phoneNumber' id='phoneNumber'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="phoneNumber" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label>Number of Pupils*</Form.Label>
                    <Field className="form-control" type="text" placeholder="Number of pupils" name='numberOfPupils' id='numberOfPupils'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="numberOfPupils" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="inlineFormInputGroup">Number of Staff*</Form.Label>
                    <Field className="form-control" type="text" placeholder="Numer of staff" name='numberOfStaff' id='numberOfStaff'
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
                    <Form.Label>Chair of Trustees Name</Form.Label>
                    <Field className="form-control" type="text" placeholder="Chair of trustees name" name='chairOfTrusteesName' id='chairOfTrusteesName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="chairOfTrusteesName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label>Head Teacher Name</Form.Label>
                    <Field className="form-control" type="text" placeholder="Head teacher's name" name='headTeacherName' id='headTeacherName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="headTeacherName" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleClose}>  Close </Button>
              <Button variant="primary" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AddSchoolModal
