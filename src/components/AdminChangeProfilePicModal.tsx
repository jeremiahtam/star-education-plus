import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function AdminChangeProfilePicModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const FILE_SIZE = 3000 * 1024;//
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ];
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const changeProfilePicHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/upload-school-profile-pic`,
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
        props.setProfilePic(resData.data.profilePicName)
        props.handleClose()
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
  }
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Formik
        enableReinitialize
        initialValues={{
          profilePic: ''
        }}
        validationSchema={Yup.object({
          profilePic: Yup
            .mixed()
            .required("A file is required")
            .test(
              "fileSize",
              "Max allowed size is 3MB",
              (value: any) => value && value.size <= FILE_SIZE
            )
            .test(
              "fileFormat",
              "Unsupported Image Format",
              (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
            )
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          // console.log(values)
          var formData = new FormData();
          formData.append("profilePic", values.profilePic)
          formData.append("id", props.modalDataId)
          await changeProfilePicHandler(formData, setSubmitting, setErrors)
          resetForm()
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="edit-profile-pic" name="edit-profile-pic">
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3"  >
                <Form.Label>Select a profile picture</Form.Label>
                <input className="form-control" type="file"
                  disabled={isSubmitting}
                  onChange={(event: any) => {
                    setFieldValue("profilePic", event.target.files[0]);
                  }} />
                <div className="form-error">
                  <ErrorMessage name="profilePic" />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-custom-outline" onClick={props.handleClose} disabled={isSubmitting}>
                Close
              </Button>
              <Button className="btn-custom" type='submit' disabled={isSubmitting}>
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
    </Modal>
  )
}

export default AdminChangeProfilePicModal