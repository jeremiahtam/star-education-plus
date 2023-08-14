import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Col, Row, InputGroup, Alert, Spinner } from 'react-bootstrap';
import CustomModal from './MembershipPlanModal';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function AddResourcesDocsModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [uploadDocumentResponse, setUploadDocumentResponse] = useState<any>(null)

  const FILE_SIZE = 20000 * 1024;//
  const SUPPORTED_FORMATS = [
    // "image/jpg",
    // "image/jpeg",
    // "image/png",
    "application/pdf",
    "application/msword"
  ];
  const uploadFileHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any,
    resetForm: any
  ) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/upload-resources-document`,
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
          setUploadDocumentResponse(resData)
          props.loadResourcesDocs()
        }
      } else {
        // resetForm()
        setUploadDocumentResponse(resData)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setUploadDocumentResponse({
          success: false,
          message: 'Time out'
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          setErrors(errorData.errors);
        } else {
          setUploadDocumentResponse({
            success: false,
            message: 'Something went wrong'
          })
        }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          document: '',
          documentName: '',
        }}
        validationSchema={Yup.object({
          documentName: Yup.string()
            .min(3, "Must be more than five characters")
            .max(25, 'Cannot be more than 25 characters')
            .required('Document name cannot be empty'),
          document: Yup
            .mixed()
            .required("A file is required")
            .test(
              "fileSize",
              "Max allowed size is 20MB",
              (value: any) => value && value.size <= FILE_SIZE
            )
            .test(
              "fileFormat",
              "Unsupported file format",
              (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
            )
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          // console.log(values)
          var formData = new FormData();
          formData.append("document", values.document)
          formData.append("documentName", values.documentName)
          formData.append("resourcesId", props.resourcesId)
          uploadFileHandler(formData, setSubmitting, setErrors, resetForm)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="upload-document" name="upload-document">
            <Modal.Header closeButton>
              <Modal.Title>Upload Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {uploadDocumentResponse?.success &&
                <Alert className='form-feedback-message' onClose={() => setUploadDocumentResponse(null)}
                  variant={uploadDocumentResponse?.success == true ? "success" : "danger"}
                  dismissible>
                  <div>{uploadDocumentResponse.message}</div>
                </Alert>}

              <Form.Group className="mb-3"  >
                <Form.Label className='form-labels'>Document Name</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Name of document" name='documentName' id='documentName'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="documentName" />
                </div>
              </Form.Group>

              <Form.Group className="mb-3"  >
                <Form.Label>Select a document</Form.Label>
                <input className="form-control" type="file"
                  disabled={isSubmitting}
                  onChange={(event: any) => {
                    setFieldValue("document", event.target.files[0]);
                  }} />
                <div className="form-error">
                  <ErrorMessage name="document" />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
              <Button className="btn-custom" type='submit' disabled={!!isSubmitting}>
                {isSubmitting ?
                  <>
                    <Spinner animation="border" size='sm' />
                    <span> Processing..</span>
                  </>
                  : " Submit"}
              </Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default AddResourcesDocsModal
