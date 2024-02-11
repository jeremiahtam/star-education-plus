import { useEffect } from 'react'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { deleteUserData, insertUserData } from '../../store/actions/user-info';
import axios from 'axios'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { loadUserData } from '../../store/actions/user-info';
import { Spinner, Image, Form, Container } from 'react-bootstrap';
import SEPLogo from '../../images/SEP-Logo-White-Final.png'

const SchoolLogin = (props: any) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const navigate = useNavigate();

  const loginHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(`${baseUrl}/api/school-login`,
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
        store.dispatch(insertUserData(resData.data.token));
        navigate('/dashboard')
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setSubmitting(false);
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
        if (errorData.message == "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    store.dispatch(loadUserData())
  }, [])

  useEffect(() => {
    if (userInfoData !== null && userInfoData !== undefined) {
      if (userInfoData.userType == 'school') {
        navigate('/dashboard')
      }
    }
  }, [userInfoData])

  return (
    <Container fluid className='school-login'>
      <Container>
        <div className='row school-login-row'>
          <div className='col-lg-4 col-md-5 school-login-form-box'>
            <div className='logo'>
              <Image src={SEPLogo} height={30} />
            </div>
            <div className='main-login-box'>
              <div className="form-heading">Welcome</div>
              <div className="form-sub-heading">Enter your details to access your dashboard</div>
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
                  <FormikForm method="POST" id="login-form-school" name="login-form-school">
                    <div className="form-group">
                      <label htmlFor="email" className='form-labels'>Email address</label>
                      <Field name="email" disabled={isSubmitting} className="form-control custom-text-input" type="text" placeholder="Email" />
                      <div className="form-error">
                        <ErrorMessage name="email" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className='form-labels'>Password</label>
                      <Field name="password" disabled={isSubmitting} className="form-control custom-text-input" type="password" placeholder="Password" />
                      <div className="form-error">
                        <ErrorMessage name="password" />
                      </div>
                    </div>
                    <Form.Group>
                      <Form.Text className='float-end'>
                        <Link to={'/recover-password'}>Forgot Password?</Link>
                      </Form.Text>
                    </Form.Group>
                    <Form.Group>
                      <button className="btn btn-block mb-3 mt-3 form-control btn-custom" type="submit" disabled={!!isSubmitting}>
                        {isSubmitting ?
                          (<>
                            <Spinner animation="border" size='sm' />
                            <span> Processing..</span>
                          </>) : (" Login")}
                      </button>
                    </Form.Group>
                    <Form.Group>
                      <Form.Text className=''>
                        Don't have an account? <Link to={'/signup'}>Signup</Link>
                      </Form.Text>
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

SchoolLogin.propTypes = {}

export default SchoolLogin