import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Col, Row, InputGroup } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddServiceProvidersModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [expiryDate, setExpiryDate] = useState()

  const addServiceProviderHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/create-service-providers`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
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

        }
      } else {
        props.handleClose()
        props.loadServiceProviders()
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

  return (
    <>
      <Formik
        initialValues={{
          serviceName: '',
          expiryDate: null,
        }}
        validationSchema={Yup.object({
          serviceName: Yup.string().required('Enter a service'),
          expiryDate: Yup.string().required('Select an expiry date'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          console.log(values)
          // addServiceProviderHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="add-service-providers" name="add-service-providers">
            <Modal.Header closeButton>
              <Modal.Title>Add Membership Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Service Name</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Service Name" name='serviceName' id='serviceName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="serviceName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="expiryDate">Expiry Date</Form.Label>
                    <InputGroup className="mb-2">
                      <DatePicker
                        name="expiryDate" disabled={isSubmitting}
                        className="form-control custom-text-input"
                        placeholderText="DD/MM/YYYY, 00:00PM"
                        showTimeSelect
                        selected={values.expiryDate}
                        onChange={(date: any) => {
                          setFieldValue('expiryDate', date)
                        }}
                        dateFormat="Pp"
                      />
                    </InputGroup>
                    <div className="form-error">
                      <ErrorMessage name="expiryDate" />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
              <Button className="btn-custom" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AddServiceProvidersModal
