import { useState } from 'react'
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from "react-router-dom";
import { deleteUserData } from '../../store/actions/user-info';
import axios from 'axios'
import { store } from '../../store/root-reducer';
import { Spinner, Image, Form, Container } from 'react-bootstrap';
import SEPLogo from '../../images/SEP-Logo-White-Final.png'
import OtpInput from 'react-otp-input';

function SchoolEnterPasswordRecoveryCode() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  const recoverCodeHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    values = {
      ...values, ...{ email }
    }
    try {
      const res = await axios.post(`${baseUrl}/api/confirm-password-reset-token`,
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
        navigate('/change-password', {
          state: {
            token: values.token,
            email
          }
        })
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


  const [token, setToken] = useState('');

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
                  token: '',
                }}
                validationSchema={Yup.object({
                  token: Yup.string().required("Reset code is required")
                    .matches(/^[0-9]+$/, "Must be only digits")
                    .min(5, "Must be exactly 5 digits")
                    .max(5, "Must be exactly 5 digits"),
                })}

                onSubmit={(values, { setSubmitting, setErrors }) => {
                  console.log(values)
                  setSubmitting(false)
                  recoverCodeHandler(values, setSubmitting, setErrors)
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
                        value={token}
                        onChange={(val) => {
                          setToken(val)
                          setFieldValue('token', val)
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
                        <ErrorMessage name="token" />
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