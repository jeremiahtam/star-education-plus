import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function AdminChangeSchoolPassword(props: any) {
  const [changePasswordResponse, setChangePasswordResponse] = useState<any>(null)
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const changeSchoolPasswordHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin-change-school-password/${props.selectedSchool.id}`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
        });
      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          setChangePasswordResponse(resData)
        }
      } else {
        setChangePasswordResponse(resData)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setChangePasswordResponse({
          success: false,
          message: 'Time out'
        })
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        setErrors(errorData.errors);
      }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        password: '',
      }}
      validationSchema={Yup.object({
        password: Yup.string().required('Enter a password').min(8, 'Enter a minimum of 8 characters'),
      })}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        await changeSchoolPasswordHandler(values, setSubmitting, setErrors)
        resetForm()
        setTimeout(() => setChangePasswordResponse(null), 5000)
      }}
    >
      {({
        isSubmitting
      }) => (
        <FormikForm method="POST" id="admin-change-school-password" name="admin-change-school-password">
          <h6>Change Password</h6>
          {changePasswordResponse?.success &&
            <Alert onClose={() => setChangePasswordResponse(null)}
              variant={changePasswordResponse?.success == true ? "success" : "danger"}
              dismissible>
              <div>{changePasswordResponse.message}</div>
            </Alert>}
          <Row className="align-items-center">
            <Form.Group className="mb-3" >
              <Form.Label htmlFor="inlineFormInputGroup">Password*</Form.Label>
              <Field className="form-control" type="password" placeholder="Password" name='password' id='password'
                disabled={isSubmitting} />
              <div className="form-error">
                <ErrorMessage name="password" />
              </div>
            </Form.Group>
          </Row>
          <div className="d-grid gap-2">
            <Button variant="primary" type='submit' className='btn-block'>Submit</Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export default AdminChangeSchoolPassword