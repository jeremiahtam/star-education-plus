import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form } from 'react-bootstrap';
import CustomModal from './BroadcastModal';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function AddBroadcastModal(props: any) {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const addBroadcastHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/create-broadcast`,
        values,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
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
        props.loadBroadcast()
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
          title: '',
          body: ''
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Title cannot be empty!'),
          body: Yup.string()
            .min(8, "Must be more than eight characters")
            .required('Body content cannot be empty'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          addBroadcastHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,

        }) => (
          <FormikForm method="POST" id="add-broadcast" name="add-broadcast">
            <Modal.Header closeButton>
              <Modal.Title>Add Broadcast</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3"  >
                <Form.Label>Title</Form.Label>
                <Field className="form-control" type="text" placeholder="Enter a title" name='title' id='title'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="title" />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label>Body</Form.Label>
                <Field className="form-control" placeholder='Enter the message' as="textarea" rows={3} name='body' id='body' disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="body" />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleClose}>  Close </Button>
              <Button variant="primary" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AddBroadcastModal
