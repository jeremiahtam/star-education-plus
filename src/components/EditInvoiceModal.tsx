import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function EditInvoiceModal(props: any) {
  const [invoiceResponse, setInvoiceResponse] = useState<any>(null)
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [selectedInvoice, setSelectedInvoice] = useState<any>()

  useEffect(() => {
    getInvoiceHandler()
  }, [])

  const getInvoiceHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-invoice-by-id`,
        {
          params: {
            id: props.modalDataId
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });

      const resData = res.data;
      console.log(resData.data);
      if (resData.success == false) {

      } else {
        setSelectedInvoice(resData.data)
        props.getInvoicesHandler()
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
      }
    }
  };

  const editInvoiceHandelr = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/edit-invoice/${props.modalDataId}`,
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
      if (resData.success == false) {
        if (resData.errors !== undefined) {
          setErrors(resData.errors);
        } else {
          setInvoiceResponse(resData)
        }
      } else {
        setInvoiceResponse(resData)
        props.getInvoicesHandler()
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setInvoiceResponse({
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
        status: selectedInvoice ? selectedInvoice?.status : '',
      }}
      validationSchema={Yup.object({
        status: Yup.string().required('Select status'),
      })}

      onSubmit={async (values, { setSubmitting, setErrors }) => {
        await editInvoiceHandelr(values, setSubmitting, setErrors)
        setTimeout(() => setInvoiceResponse(null), 5000)
      }}
    >
      {({
        isSubmitting,
        setFieldValue,
        values,
        initialValues
      }) => (
        <FormikForm method="POST" id="add-school" name="add-school">

          <Modal.Header closeButton>
            <Modal.Title>Edit Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {invoiceResponse?.success &&
              <Alert className='form-feedback-message' onClose={() => setInvoiceResponse(null)}
                variant={invoiceResponse?.success == true ? "success" : "danger"}
                dismissible>
                <div>{invoiceResponse.message}</div>
              </Alert>}
            <Row className="align-items-center">
              <Col xs={"12"}>
                <Form.Group className="mb-3" >
                  <Form.Label className='form-labels'>Status*</Form.Label>

                  <Form.Select className='custom-text-input' id='status' name='status'
                    disabled={initialValues.status == 'paid' ? true : false}
                    onChange={(selectedOption: any) =>
                      setFieldValue('status', selectedOption.target.value)
                    }
                    value={values.status}>
                    <option value={''}>-- select status --</option>
                    <option value={'paid'}>Paid</option>
                    <option value="pending">Pending</option>
                  </Form.Select>
                  {values.status == 'paid' && initialValues.status !== 'paid' &&
                    <Form.Text className="text-primary">
                      By selecting 'paid', this invoice payment date will be set to today.
                    </Form.Text>}
                  <div className="form-error">
                    <ErrorMessage name="status" />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-custom-outline" onClick={props.handleClose}>  Close </Button>
            <Button className="btn-custom" type='submit'>Submit</Button>
          </Modal.Footer>

        </FormikForm>
      )}
    </Formik>
  )
}

export default EditInvoiceModal