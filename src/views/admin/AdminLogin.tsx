import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate} from "react-router-dom";
import PropTypes from 'prop-types'

const AdminLogin = (props: any) => {

  const navigate = useNavigate();

  const loginHandler = () => {
    console.log('redirection')
    return navigate("/admin-dashboard")
  }
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

              onSubmit={(values, { setSubmitting }) => {
                loginHandler()
                setTimeout(() => {
                  setSubmitting(false);
                  // alert(JSON.stringify(values, null, 2));
                }, 400);
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
                          <span className="spinner-border spinner-border" role="status" aria-hidden="true"></span>
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
