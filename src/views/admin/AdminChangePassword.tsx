import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteUserData } from "../../store/actions/user-info";
import axios from "axios";
import { store } from "../../store/root-reducer";
import { Spinner, Image, Form, Col } from "react-bootstrap";
import SEPLogo from "../../images/SEP-Logo-White-Final.png";
import SEPLogo129 from "../../images/logo192.png";

const AdminChangePassword = (props: any) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const token = location.state?.token;

  const changePasswordHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      values = {
        ...values,
        ...{
          email,
          token,
        },
      };
      const res = await axios.post(
        `${baseUrl}/api/admin-reset-password`,
        values,
        {
          headers: {
            Accept: "application/json",
          },
          timeout: 30000,
        }
      );
      const resData = res.data;
      console.log(resData);
      if (resData.success === false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          //output the error message
        }
      } else {
        navigate("/admin-login", {
          state: {
            passwordResetMessage: "Your password was reset successfully. Login.",
          },
        });
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
        setSubmitting(false);
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
        if (errorData.message === "Unauthenticated.") {
          store.dispatch(deleteUserData());
        }
      }
    }
    setSubmitting(false);
  };

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
                <div className="form-heading">Change Password</div>
                <div className="form-sub-heading">Enter your new password</div>
                <Formik
                  initialValues={{
                    password: "",
                    password_confirmation: "",
                  }}
                  validationSchema={Yup.object({
                    password: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .min(8, "Must be more than eight characters")
                      .required("Password cannot be empty"),
                    password_confirmation: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("Password cannot be empty")
                      .test(
                        "passwords-match",
                        "Passwords must match",
                        function (value) {
                          return this.parent.password === value;
                        }
                      ),
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    changePasswordHandler(values, setSubmitting, setErrors);
                  }}
                >
                  {({ isSubmitting }) => (
                    <FormikForm
                      method="POST"
                      id="login-form-school"
                      name="login-form-school"
                    >
                      <div className="form-group">
                        <label htmlFor="password" className="form-labels">
                          Password
                        </label>
                        <Field
                          name="password"
                          disabled={isSubmitting}
                          className="form-control custom-text-input"
                          type="password"
                          placeholder="Password"
                        />
                        <div className="form-error">
                          <ErrorMessage name="password" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="repeat-password"
                          className="form-labels"
                        >
                          Repeat Password
                        </label>
                        <Field
                          name="password_confirmation"
                          disabled={isSubmitting}
                          className="form-control custom-text-input"
                          type="password"
                          placeholder="Repeat Password"
                        />
                        <div className="form-error">
                          <ErrorMessage name="password_confirmation" />
                        </div>
                      </div>
                      <Form.Group>
                        <button
                          className="btn btn-block mb-3 mt-3 form-control btn-custom"
                          type="submit"
                          disabled={!!isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              <span> Processing..</span>
                            </>
                          ) : (
                            " Change Password"
                          )}
                        </button>
                      </Form.Group>
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

export default AdminChangePassword;
