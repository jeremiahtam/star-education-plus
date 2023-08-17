import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Button, Modal, Form, InputGroup, Row, Col } from 'react-bootstrap';
import MembershipPlanModal from './MembershipPlanModal';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function EditMembershipPlanModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [selectedMembershipPlan, setSelectedMembershipPlan] = useState<any>({})

  useEffect(() => {
    getMembershipPlanHandler()
  }, [])

  const getMembershipPlanHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-membership-plan`,
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
        setSelectedMembershipPlan(resData.data)
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

  const editMembershipPlanHandler = async (
    values: any,
    setSubmitting: any,
    setErrors: any
  ) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/edit-membership-plan/${props.modalDataId}`,
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
        props.loadMembershipPlan()
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
          name: selectedMembershipPlan ? selectedMembershipPlan?.name : '',
          membershipPlanContent: selectedMembershipPlan ? selectedMembershipPlan?.membershipPlanContent : '',//?.replace(/\n/g, "<br>"),
          duration: selectedMembershipPlan ? selectedMembershipPlan?.duration : '',
          amount: selectedMembershipPlan ? selectedMembershipPlan?.amount : '',
          status: selectedMembershipPlan ? selectedMembershipPlan?.status : ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Enter a name'),
          membershipPlanContent: Yup.string()
            .min(8, "Must be more than eight characters")
            .required('Membership plan ontent cannot be empty'),
          duration: Yup.number().typeError('Enter a number')
            // .required('Duration cannot be empty!')
            .integer('Please enter a whole number')
            .positive('Enter a positive number').min(1, 'Please enter at least a digit'),
          amount: Yup.number().typeError('Enter a number')
            .required('Amount cannot be empty!').positive('Enter a positive number')
            .test(
              "maxDigitsAfterDecimal",
              "Amount cannot have more than 2 digits after decimal",
              (amount: any) => /^\d+(\.\d{1,2})?$/.test(amount)
            ),
          status: Yup.string().required('Select status'),
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          editMembershipPlanHandler(values, setSubmitting, setErrors)
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
          values
        }) => (
          <FormikForm method="POST" id="edit-membership-plan" name="edit-membership-plan">
            <Modal.Header closeButton>
              <Modal.Title>Edit Membership Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3"  >
                <Form.Label className='form-labels'>Name</Form.Label>
                <Field className="form-control custom-text-input" type="text" placeholder="Name of plan" name='name' id='name'
                  disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="name" />
                </div>
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label className='form-labels'>Content</Form.Label>
                <Field className="form-control custom-text-input" placeholder='Full details of membership plan' as="textarea" rows={4}
                  style={{ whiteSpace: "pre-wrap" }} name='membershipPlanContent' id='membershipPlanContent' disabled={isSubmitting} />
                <div className="form-error">
                  <ErrorMessage name="membershipPlanContent" />
                </div>
              </Form.Group>
              <Row className="align-items-center">
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Duration (Days)</Form.Label>
                    <Field className="form-control custom-text-input" type="number" placeholder="Duration (Days)" name='duration' id='duration'
                      disabled={isSubmitting} />
                    <Form.Text className='text-muted'>Leave empty if no limit</Form.Text>
                    <div className="form-error">
                      <ErrorMessage name="duration" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="amount">Amount</Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>£</InputGroup.Text>
                      <Field className="form-control custom-text-input" type="number" step=".01" placeholder="00.00" name='amount' id='amount'
                        disabled={isSubmitting} />
                    </InputGroup>
                    <div className="form-error">
                      <ErrorMessage name="amount" />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs="auto" lg={'6'}>
                  <Form.Group className="mb-3" >
                    <Form.Label className='form-labels'>Status</Form.Label>
                    <Form.Select className='custom-text-input'
                      onChange={(selectedOption: any) =>
                        setFieldValue('status', selectedOption.target.value)
                      } id='status' name='status' value={values.status}>
                      <option value={''}>-- select status --</option>
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                    </Form.Select>
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
          </FormikForm>)}
      </Formik>
    </>
  )
}

export default EditMembershipPlanModal