import { useState } from 'react'
import { Button, Form, Row, Alert } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function ChangeSchoolPassword(props: any) {
  const [changePasswordResponse, setChangePasswordResponse] = useState<any>(null)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const changeSchoolPasswordHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any,
    resetForm: any
  ) => {
    try {
      values = {
        ...values,
        email: userInfoData.email
      }
      const res = await axios.put(
        `${baseUrl}/api/change-school-password/${userInfoData.userId}`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });
      const resData = res.data;
      console.log(resData);
      if (resData.success === false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          setChangePasswordResponse(resData)
        }
      } else {
        resetForm()
        setChangePasswordResponse(resData)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code === "ECONNABORTED") {
        setChangePasswordResponse({
          success: false,
          message: 'Time out'
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          setErrors(errorData.errors);
        } else {
          setChangePasswordResponse({
            success: false,
            message: 'Something went wrong'
          })
        }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
      }}
      validationSchema={Yup.object({
        oldPassword: Yup.string().required('Enter your old password')
          .min(8, 'Enter a minimum of 8 characters')
          .max(20, 'Must be 20 characters or less'),
        newPassword: Yup.string().required('Enter new password')
          .min(8, 'Enter a minimum of 8 characters')
          .max(20, 'Must be 20 characters or less'),
        newPasswordConfirmation: Yup.string().required('Repeat new password')
          .min(8, 'Enter a minimum of 8 characters')
          .max(20, 'Must be 20 characters or less')
          .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.newPassword === value;
          }),
      })}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        await changeSchoolPasswordHandler(values, setSubmitting, setErrors, resetForm)
        setTimeout(() => setChangePasswordResponse(null), 5000)
      }}
    >
      {({
        isSubmitting
      }) => (
        <FormikForm method="POST" id="admin-change-school-password" name="admin-change-school-password">
          <h6 className='form-heading'>Change Password</h6>
          {changePasswordResponse?.success &&
            <Alert className='form-feedback-message' onClose={() => setChangePasswordResponse(null)}
              variant={changePasswordResponse?.success == true ? "success" : "danger"}
              dismissible>
              <div>{changePasswordResponse.message}</div>
            </Alert>}
          <Row className="align-items-center">
            <Form.Group className="mb-3" >
              <Form.Label className='form-labels'>Old Password*</Form.Label>
              <Field className="form-control custom-text-input" type="password" placeholder="Old Password" name='oldPassword' id='oldPassword'
                disabled={isSubmitting} />
              <div className="form-error">
                <ErrorMessage name="oldPassword" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label className='form-labels'>New Password*</Form.Label>
              <Field className="form-control custom-text-input" type="password" placeholder="New Password" name='newPassword' id='newPassword'
                disabled={isSubmitting} />
              <div className="form-error">
                <ErrorMessage name="newPassword" />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label className='form-labels'>Repeat New Password*</Form.Label>
              <Field className="form-control custom-text-input" type="password"
                placeholder="Repeat New Password"
                name='newPasswordConfirmation' id='newPasswordConfirmation'
                disabled={isSubmitting} />
              <div className="form-error">
                <ErrorMessage name="newPasswordConfirmation" />
              </div>
            </Form.Group>
          </Row>
          <div className="d-grid gap-2">
            <Button type='submit' className='btn-block btn-custom'>Submit</Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default ChangeSchoolPassword