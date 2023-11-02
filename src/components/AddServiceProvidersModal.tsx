import { useState } from 'react'
import { Button, Modal, Form, Col, Row, InputGroup } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import serviceProvidersList from '../data/serviceProvidersList';

function AddServiceProvidersModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const addServiceProviderHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    values = {
      ...values, ...{
        'schoolId': props.schoolId
      }
    }
    try {
      const res = await axios.post(
        `${baseUrl}/api/add-service-provider`,
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
          companyName: '',
          quantity: '',
          price: '',
          renewDate: null,
        }}
        validationSchema={Yup.object({
          serviceName: Yup.string().required('Enter a service'),
          companyName: Yup.string(),
          quantity: Yup.number().typeError('Enter a number').positive('Enter a positive number'),
          price: Yup.number().typeError('Enter a number').positive('Enter a positive number'),
          renewDate: Yup.string().required('Select an renew date'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          // console.log(values)
          addServiceProviderHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="add-service-providers" name="add-service-providers">
            <Modal.Header closeButton>
              <Modal.Title>Add Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Service Name</Form.Label>

                    <Form.Select className='custom-text-input' name='serviceName'
                      onChange={(selectedOption: any) => {
                        setFieldValue('serviceName', selectedOption.target.value)
                      }}
                      value={values.serviceName}>
                      <option value=''>-- select --</option>
                      {serviceProvidersList.map((item: any, index: number) => {
                        return (
                          <option key={index} value={item.name}>{item.name}</option>
                        )
                      })}
                    </Form.Select>
                    <div className="form-error">
                      <ErrorMessage name="serviceName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Company Name</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Company Name" name='companyName' id='companyName'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="companyName" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Price</Form.Label>
                    <Field className="form-control custom-text-input" type="text" placeholder="Price" name='price' id='price'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="price" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Quantity</Form.Label>
                    <Field className="form-control custom-text-input" type="number" placeholder="Quantity" name='quantity' id='quantity'
                      disabled={isSubmitting} />
                    <div className="form-error">
                      <ErrorMessage name="quantity" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="renewDate">Renew Date</Form.Label>
                    <InputGroup className="mb-2">
                      <DatePicker
                        name="renewDate" disabled={isSubmitting}
                        className="form-control custom-text-input"
                        placeholderText="DD/MM/YYYY, 00:00PM"
                        showTimeSelect
                        selected={values.renewDate}
                        onChange={(date: any) => {
                          setFieldValue('renewDate', date)
                        }}
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                      />
                    </InputGroup>
                    <div className="form-error">
                      <ErrorMessage name="renewDate" />
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
