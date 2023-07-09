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
import { Spinner } from 'react-bootstrap';

const AdminLogin = (props: any) => {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const navigate = useNavigate();

  const loginHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin-login`,
        values,
        {
          headers: {
            "Accept": "application/json"
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
      <div className='container'>

        <div className='row first-row'>
          <div className='col-lg-4 login-form-box'>
            <div className="form-heading">Login To Admin Account</div>
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
                    <Field name="email" disabled={isSubmitting} className="form-control" type="text" placeholder="Email" />
                    <div className="form-error">
                      <ErrorMessage name="email" />
                    </div>
                  </div>

                  <div className="form-group">
                    <Field name="password" disabled={isSubmitting} className="form-control" type="password" placeholder="Password" />
                    <div className="form-error">
                      <ErrorMessage name="password" />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-block mb-3 form-control" type="submit" disabled={!!isSubmitting}>
                    {isSubmitting ?
                      (
                        <>
                          <Spinner animation="border" size='sm' />
                          <span> Processing..</span>
                        </>
                      ) : (" Login")}

                  </button>

                  {/* <div className=''>
                    <div className='row'><span>Forgotten Password? <Link to={`/admin/retrieve-password`}> Retrieve Password</Link></span></div>
                  </div> */}
                </Form>)}
            </Formik>
          </div>
        </div>

        <div className="row second-row">
          <div className='production-info'>An <a href='http://www.oncliqsupport.com'> oncliqsupport </a> production</div>
        </div>
      </div>
    </div>
  )
}

AdminLogin.propTypes = {}

export default AdminLogin
