import React, { useEffect, useState, useRef } from 'react'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
// import { insertUserData } from '../../store/actions/user-info';
// import axios from 'axios'
// import { store } from '../../store/root-reducer';
// import { stateLoggedInUserType } from '../../../types/type-definitions';
// import { loadUserData } from '../../store/actions/user-info';
import { Col, Spinner, Image, Form, Container, Row } from 'react-bootstrap';
import SEPLogo from '../../images/SEP-Logo-White-Final.png'
// import SEPLogo129 from '../../images/logo192.png'
import OtpInput from 'react-otp-input';

function SchoolEnterPasswordRecoveryCode() {

  const [otp, setOtp] = useState('');

  return (
    <Container fluid className='school-login'>
      <Container>
        <div className='row school-login-row'>
          <div className='col-lg-4 col-md-5 school-login-form-box'>
            <div className='logo'>
              <Image src={SEPLogo} height={30} />
            </div>
            <div className='main-login-box'>
              <div className="form-heading">Enter Code</div>
              <div className="form-sub-heading">Please enter the code sent to your email address </div>
              <Formik
                initialValues={{
                  otp: '',
                }}
                validationSchema={Yup.object({
                  otp: Yup.string().required("Reset code is required")
                    .matches(/^[0-9]+$/, "Must be only digits")
                    .min(5, "Must be exactly 5 digits")
                    .max(5, "Must be exactly 5 digits"),
                })}

                onSubmit={(values, { setSubmitting, setErrors }) => {
                  // console.log(values)
                  // setSubmitting(false)
                  // recoverPasswordHandler(values, setSubmitting, setErrors)
                }}
              >
                {({
                  isSubmitting,
                  setFieldValue
                }) => (
                  <FormikForm method="POST" id="recover-password-form-school" name="recover-password-form-school">
                    <div className="form-group">
                      <label htmlFor="email" className='form-labels'>Enter Code</label>
                      <OtpInput
                        value={otp}
                        onChange={(val) => {
                          setOtp(val)
                          setFieldValue('otp', val)
                        }}
                        numInputs={5}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                          width: '3em',
                          height: '3em',
                          border: 'none',
                          borderBottom: "2px solid #0F1925",
                        }}
                        containerStyle={{
                          justifyContent: 'center'
                        }}
                      />

                      <div className="form-error">
                        <ErrorMessage name="otp" />
                      </div>
                    </div>
                    <Form.Group>
                      <button className="btn btn-block mb-3 mt-3 form-control btn-custom" type="submit" disabled={!!isSubmitting}>
                        {isSubmitting ?
                          (<>
                            <Spinner animation="border" size='sm' />
                            <span> Processing..</span>
                          </>) : (" Proceed")}
                      </button>
                    </Form.Group>
                  </FormikForm>)}
              </Formik>
            </div>

          </div>
        </div>
      </Container>
    </Container>
  )
}

export default SchoolEnterPasswordRecoveryCode