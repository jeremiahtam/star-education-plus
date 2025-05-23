import { useState, useEffect  } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function EditBroadcastModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [selectedBroadcast, setSelectedBroadcast] = useState<any>()

  useEffect(() => {
    getBroadcastHandler()
  }, [])

  const getBroadcastHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-broadcast`,
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
      // console.log(resData.data);
      if (resData.success == false) {

      } else {
        setSelectedBroadcast(resData.data)
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

  const editBroadcastHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/edit-broadcast/${props.modalDataId}`,
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
        enableReinitialize
        initialValues={{
          title: selectedBroadcast ? selectedBroadcast?.title : '',
          body: selectedBroadcast ? selectedBroadcast?.body : ''
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Title cannot be empty!'),
          body: Yup.string()
            .min(8, "Must be more than eight characters")
            .required('Body content cannot be empty'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          editBroadcastHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,

        }) => (
          <FormikForm method="POST" id="edit-broadcast" name="edit-broadcast">
            <Modal.Header closeButton>
              <Modal.Title>Edit Broadcast</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3"  >
                <Form.Label className='form-labels'>Title</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Enter a title" name='title' id='title'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="title" />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Body</Form.Label>
                <Field className="form-control custom-text-input" placeholder='Enter the message' as="textarea" rows={3} name='body' id='body' disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="body" />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose}>  Close </Button>
              <Button className="btn-custom" type='submit'>Submit</Button>
            </Modal.Footer>
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default EditBroadcastModal