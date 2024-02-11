import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { deleteUserData } from '../../store/actions/user-info';
import axios from 'axios'
import { store } from '../../store/root-reducer';
import { Spinner, Image, Form, Container } from 'react-bootstrap';
import SEPLogo from '../../images/SEP-Logo-White-Final.png'

const SchoolRecoverPassword = (props: any) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const recoverPasswordHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(`${baseUrl}/api/recover-password`,
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
        navigate('/enter-recovery-code', {
          state: {
            email: values.email
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

  return (
    <Container fluid className='school-login'>
      <Container>
        <div className='row school-login-row'>
          <div className='col-lg-4 col-md-5 school-login-form-box'>
            <div className='logo'>
              <Image src={SEPLogo} height={30} />
            </div>
            <div className='main-login-box'>
              <div className="form-heading">Forgot Password</div>
              <div className="form-sub-heading">Please enter your email address to receive a verification code</div>
              <Formik
                initialValues={{
                  email: '',

                }}
                validationSchema={Yup.object({
                  email: Yup.string().email('Invalid email address').required('Email cannot be empty!'),
                })}

                onSubmit={(values, { setSubmitting, setErrors }) => {
                  recoverPasswordHandler(values, setSubmitting, setErrors)
                }}
              >
                {({
                  isSubmitting,
                }) => (
                  <FormikForm method="POST" id="recover-password-form-school" name="recover-password-form-school">
                    <div className="form-group">
                      <label htmlFor="email" className='form-labels'>Email address</label>
                      <Field name="email" disabled={isSubmitting} className="form-control custom-text-input" type="text" placeholder="Email" />
                      <div className="form-error">
                        <ErrorMessage name="email" />
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

export default SchoolRecoverPassword