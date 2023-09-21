import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate, IoIosAdd } from "react-icons/io";
import { Button, Modal, Form, InputGroup, Row, Col } from 'react-bootstrap';
import MembershipPlanModal from './MembershipPlanModal';
import { Formik, Field, Form as FormikForm, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function EditMembershipPlanModal(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const [packagesAndServicesList, setPackagesAndServicesList] = useState<any>()

  useEffect(() => {
    getPackagesAndServicesHandler()
  }, [])
  const getPackagesAndServicesHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/packages-and-services-list`,
        {
          params: {
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
        setPackagesAndServicesList(resData.data)
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
      console.log(resData);
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
          status: selectedMembershipPlan ? selectedMembershipPlan?.status : '',
          freebies: selectedMembershipPlan?.freebies ? selectedMembershipPlan?.freebies : []
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
          freebies: Yup.array().of(
            Yup.object().shape({
              id: Yup.number().typeError('Enter a number'),
              packagesAndServicesId: Yup.number().typeError('Enter a number')
                .required('Required!').positive('Positive number'),
              frequency: Yup.string().required('Required!'),
              freeAttempts: Yup.number().typeError('Enter a number')
                .required('Required!').positive('Positive number'),
            })
          ).max(2, 'Maximum of two freebies!')
        })}

        onSubmit={(values, { setSubmitting, setErrors }) => {
          console.log(values)
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
                <Col xs="auto" md={'4'}>
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
                <Col xs="auto" md={'4'}>
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
                <Col xs="auto" md={'4'}>
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
              <FieldArray
                name="freebies"
                render={(arrayHelpers: any) => (
                  <div>
                    <Row>
                      <Col xs="auto" lg={'12'} className='freebies'>
                      <div>Membership Benefits</div>
                        <div className='pull-right'>
                          <button className='btn btn-custom btn-sm' type="button"
                            onClick={() => arrayHelpers.push({
                              id:'', packagesAndServicesId: '', frequency: '', freeAttempts: ''
                            })}
                          >
                            <IoIosAdd className='btn-icon' />
                          </button>
                        </div>
                      </Col>
                    </Row>
                    {values.freebies.map((freebie: any, index: number) => (
                      <Row className="mb-3 align-items-center" key={index}>
                        {/* Hidden id field */}
                        <Field type="hidden" name={`freebies.${index}.id`} />

                        <Col xs={4} md={4}>
                          <Form.Group className="mb-3"  >
                            <Form.Label className='form-labels'>Package/Service</Form.Label>
                            <Form.Select className='custom-text-input' name={`freebies.${index}.packagesAndServicesId`}
                              onChange={(selectedOption: any) => {
                                setFieldValue(`freebies.${index}.packagesAndServicesId`, selectedOption.target.value)
                              }}
                              value={freebie.packagesAndServicesId}>
                              <option value=''>-- select --</option>
                              {packagesAndServicesList &&
                                packagesAndServicesList.map((item: any, index: number) => {
                                  return (
                                    <option key={index} value={item.id}>{item.name}</option>
                                  )
                                })}
                            </Form.Select>
                            <div className="form-error">
                              <ErrorMessage name={`freebies.${index}.packagesAndServicesId`} />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col xs={4} md={4}>
                          <Form.Group className="mb-3"  >
                            <Form.Label className='form-labels'>Frequency</Form.Label>
                            <Form.Select onChange={(selectedOption: any) =>
                              setFieldValue(`freebies.${index}.frequency`, selectedOption.target.value)
                            }
                              className='custom-text-input' name={`freebies.${index}.frequency`}
                              value={freebie.frequency}>
                              <option value=''>-- select --</option>
                              <option value="per-cycle">Every subscription</option>
                              <option value="per-lifetime">Once in a lifetime</option>
                            </Form.Select>
                            <div className="form-error">
                              <ErrorMessage name={`freebies.${index}.frequency`} />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col xs={2} md={3}>
                          <Form.Group className="mb-3"  >
                            <Form.Label className='form-labels'>Atempts</Form.Label>
                            <Field className="form-control custom-text-input" type="text" placeholder="Eg. 2"
                              name={`freebies.${index}.freeAttempts`} disabled={isSubmitting} />
                            <div className="form-error">
                              <ErrorMessage name={`freebies.${index}.freeAttempts`} />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col xs="auto">
                          <Form.Group className="mb-3"  >
                            <button className='btn btn-custom btn-sm' type="button"
                              onClick={() => arrayHelpers.remove(index)}>
                              -
                            </button>
                          </Form.Group>
                        </Col>

                      </Row>
                    ))}
                  </div>
                )}
              />

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