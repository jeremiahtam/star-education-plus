import React, { useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { insertUserData } from '../../store/actions/user-info';
import axios from 'axios'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { loadUserData } from '../../store/actions/user-info';
import { Col, Spinner, Image } from 'react-bootstrap';
import SEPLogo from '../../images/SEP-Logo-White-Final.png'
import SEPLogo129 from '../../images/logo192.png'

const AdminLogin = (props: any) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const navigate = useNavigate();

  const loginHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin-login`,
        values,
        {
          headers: {
            "Accept": "application/json"
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
          //output the error message
        }
      } else {
        store.dispatch(insertUserData(resData.data));
        navigate('/dashboard')
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

  useEffect(() => {
    store.dispatch(loadUserData())
  }, [])

  useEffect(() => {
    if (userInfoData !== null) {
      if (userInfoData.userType == 'admin') {
        navigate('/dashboard')
      }
    }
  }, [userInfoData])

  return (
    <div className='container-box'>
      <div className='row'>
        <Col md={'4'} className='left-column d-none d-md-block d-lg-block'>
          <div className='left-logo'>
            <Image src={SEPLogo} height={35} />
          </div>

        </Col>

        <Col md={'8'} sm={'12'} xs={'12'} className='right-column'>
          <div className='container'>
            <div className='row first-row'>
              <div className='col-lg-5 login-form-box'>
                <div className='right-logo'>
                  <Image src={SEPLogo129} height={30} />
                </div>
                <div className="form-heading">Welcome Back</div>
                <div className="form-sub-heading">Enter your details to access the admin panel</div>
                <Formik
                  initialValues={{
                    email: '',
                    password: ''
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Email cannot be empty!'),
                    password: Yup.string()
                      .max(20, 'Must be 20 characters or less')
                      .min(8, "Must be more than eight characters")
                      .required('Password cannot be empty'),
                  })}

                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    loginHandler(values, setSubmitting, setErrors)
                  }}
                >
                  {({
                    isSubmitting,
                  }) => (
                    <Form method="POST" id="login-form-school" name="login-form-school">
                      <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <Field name="email" disabled={isSubmitting} className="form-control custom-text" type="text" placeholder="Email" />
                        <div className="form-error">
                          <ErrorMessage name="email" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field name="password" disabled={isSubmitting} className="form-control custom-input-input" type="password" placeholder="Password" />
                        <div className="form-error">
                          <ErrorMessage name="password" />
                        </div>
                      </div>
                      <button className="btn btn-block mb-3 form-control" type="submit" disabled={!!isSubmitting}>
                        {isSubmitting ?
                          (
                            <>
                              <Spinner animation="border" size='sm' />
                              <span> Processing..</span>
                            </>
                          ) : (" Login")}
                      </button>
                    </Form>)}
                </Formik>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </div>
  )
}

AdminLogin.propTypes = {}

export default AdminLogin
