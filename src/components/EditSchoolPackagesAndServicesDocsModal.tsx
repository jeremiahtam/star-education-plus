import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, Col, Row, InputGroup, Alert, Spinner } from 'react-bootstrap';
import CustomModal from './MembershipPlanModal';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function ViewSchoolPackagesAndServicesDocsModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [selectedDocument, setSelectedDocument] = useState<any>()

  const [uploadDocumentResponse, setUploadDocumentResponse] = useState<any>(null)

  useEffect(() => {
    getDocumentHandler()
  }, [])

  const getDocumentHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-document`,
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
        setSelectedDocument(resData.data)
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

  const editFileHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any,
    resetForm: any
  ) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/edit-document/${props.modalDataId}`,
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
        }
      } else {
        props.handleClose()
        props.loadSchoolDocs()
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
        enableReinitialize
        initialValues={{
          documentName: selectedDocument ? selectedDocument?.documentName : '',
        }}
        validationSchema={Yup.object({
          documentName: Yup.string()
            .min(3, "Must be more than five characters")
            .max(25, 'Cannot be more than 25 characters')
            .required('Document name cannot be empty'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          // console.log(values)
          // var formData = new FormData();
          // formData.append("documentName", values.documentName)
          editFileHandler(values, setSubmitting, setErrors, resetForm)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="upload-document" name="upload-document">
            <Modal.Header closeButton>
              <Modal.Title>Edit Document</Modal.Title>
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
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}
                disabled={!!isSubmitting}>Close</Button>
              <Button className="btn-custom" type='submit' disabled={!!isSubmitting}>
                {isSubmitting ?
                  <>
                    <Spinner animation="border" size='sm' />
                    <span> Processing..</span>
                  </>
                  : " Edit"}
              </Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default ViewSchoolPackagesAndServicesDocsModal
