import { useEffect, useState } from "react";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteUserData, insertUserData } from "../../store/actions/user-info";
import axios from "axios";
import { store } from "../../store/root-reducer";
import { stateLoggedInUserType } from "../../../types/type-definitions";
import { loadUserData } from "../../store/actions/user-info";
import { Col, Spinner, Image, Form } from "react-bootstrap";
import SEPLogo from "../../images/SEP-Logo-White-Final.png";
import SEPLogo129 from "../../images/logo192.png";

const AdminLogin = (props: any) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector(
    (state: stateLoggedInUserType) => state.userInfo.loggedInUserData
  );
  const navigate = useNavigate();
  const location = useLocation();
  const passwordResetMessage = location.state?.passwordResetMessage;

  const [loginFeedback, setLoginFeedback] = useState<null | string>(null);

  const loginHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(`${baseUrl}/api/admin-login`, values, {
        headers: {
          Accept: "application/json",
        },
        timeout: 30000,
      });

      const resData = res.data;
      // delete existing user data
      store.dispatch(deleteUserData());
      // console.log(resData);
      if (resData.success === false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          //output the error message
        }
        setLoginFeedback(resData.message);
      } else {
        store.dispatch(insertUserData(resData.data.token));
        navigate("/dashboard");
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
      }
    }
    setSubmitting(false);
  };

  useEffect(() => {
    store.dispatch(loadUserData());
  }, []);

  useEffect(() => {
    if (userInfoData !== null && userInfoData !== undefined) {
      if (userInfoData.userType === "admin") {
        navigate("/dashboard");
      }
    }
  }, [userInfoData]);

  return (
    <div className="container-box">
      <div className="row">
        <Col md={"4"} className="left-column d-none d-md-block d-lg-block">
          <div className="left-logo">
            <Image src={SEPLogo} height={35} />
          </div>
        </Col>

        <Col md={"8"} sm={"12"} xs={"12"} className="right-column">
          <div className="container">
            <div className="row first-row">
              <div className="col-lg-5 login-form-box">
                <div className="right-logo">
                  <Image src={SEPLogo129} height={30} />
                </div>
                <div className="form-heading">Welcome Back</div>
                <div className="text-info">{passwordResetMessage}</div>
                <div className="form-sub-heading">
                  Enter your details to access the admin panel
                </div>
                {loginFeedback !== null && (
                  <div className="form-error">{loginFeedback}</div>
                )}
                <Formik
                  initialValues={{
                    _email: "",
                    _password: "",
                  }}
                  validationSchema={Yup.object({
                    _email: Yup.string()
                      .email("Invalid email address")
                      .required("Email cannot be empty!"),
                    _password: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .min(8, "Must be more than eight characters")
                      .required("Password cannot be empty"),
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    loginHandler(values, setSubmitting, setErrors);
                  }}
                >
                  {({ isSubmitting }) => (
                    <FormikForm
                      method="POST"
                      id="login-form-school"
                      name="login-form-school"
                    >
                      <div className="form-group">
                        <label htmlFor="_email" className="form-labels">
                          Email address
                        </label>
                        <Field
                          name="_email"
                          disabled={isSubmitting}
                          className="form-control custom-text-input"
                          type="text"
                          placeholder="Email"
                        />
                        <div className="form-error">
                          <ErrorMessage name="_email" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="_password" className="form-labels">
                          Password
                        </label>
                        <Field
                          name="_password"
                          disabled={isSubmitting}
                          className="form-control custom-text-input"
                          type="password"
                          placeholder="Password"
                        />
                        <div className="form-error">
                          <ErrorMessage name="_password" />
                        </div>
                      </div>
                      <Form.Group>
                        <Form.Text className="float-end">
                          <Link to={"/admin-recover-password"}>
                            Forgot Password?
                          </Link>
                        </Form.Text>
                      </Form.Group>
                      <button
                        className="btn btn-block mb-3 form-control btn-custom"
                        type="submit"
                        disabled={!!isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" />
                            <span> Processing..</span>
                          </>
                        ) : (
                          " Login"
                        )}
                      </button>
                    </FormikForm>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </div>
  );
};

AdminLogin.propTypes = {};

export default AdminLogin;
