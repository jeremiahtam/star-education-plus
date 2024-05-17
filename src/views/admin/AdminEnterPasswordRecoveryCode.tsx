import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteUserData } from "../../store/actions/user-info";
import axios from "axios";
import { store } from "../../store/root-reducer";
import { Spinner, Image, Form, Col } from "react-bootstrap";
import SEPLogo from "../../images/SEP-Logo-White-Final.png";
import SEPLogo129 from "../../images/logo192.png";
import { useState } from "react";
import OTPInput from "react-otp-input";

const AdminEnterPasswordRecoveryCode = (props: any) => {
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
      ...values,
      ...{ email },
    };
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin-confirm-password-reset-token`,
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
        navigate("/admin-change-password", {
          state: {
            token: values.token,
            email,
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

  const [token, setToken] = useState("");

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
                <div className="form-heading">Enter Code</div>
                <div className="form-sub-heading">Enter recovery code</div>
                <Formik
                  initialValues={{
                    token: "",
                  }}
                  validationSchema={Yup.object({
                    token: Yup.string()
                      .required("Reset code is required")
                      .matches(/^[0-9]+$/, "Must be only digits")
                      .min(6, "Must be exactly 6 digits")
                      .max(6, "Must be exactly 6 digits"),
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    console.log(values);
                    setSubmitting(false);
                    recoverCodeHandler(values, setSubmitting, setErrors);
                  }}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <FormikForm
                      method="POST"
                      id="recover-password-form-school"
                      name="recover-password-form-school"
                    >
                      <div className="form-group">
                        <label htmlFor="email" className="form-labels">
                          Enter Code
                        </label>
                        <OTPInput
                          value={token}
                          onChange={(val) => {
                            setToken(val);
                            setFieldValue("token", val);
                          }}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                          inputStyle={{
                            width: "3em",
                            height: "3em",
                            border: "none",
                            borderBottom: "2px solid #0F1925",
                          }}
                          containerStyle={{
                            justifyContent: "center",
                          }}
                        />

                        <div className="form-error">
                          <ErrorMessage name="token" />
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
                            " Proceed"
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

export default AdminEnterPasswordRecoveryCode;
