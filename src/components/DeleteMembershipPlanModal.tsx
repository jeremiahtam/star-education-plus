import { Button, Modal } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import { useEffect, useState } from 'react';

interface DeleteMembershipPlanModalPropType {
  modalDataId: number,
  handleClose: any,
  loadMembershipPlan: any
}

function DeleteMembershipPlanModal(props: DeleteMembershipPlanModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [deletePossibility, setDeletePossibility] = useState<boolean>(false)

  useEffect(() => {
    checkDeletePossibilityHandler()
  }, [])

  const checkDeletePossibilityHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/used-membership-plans`,
        {
          params: {
            membershipPlanId: props.modalDataId
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
        if (resData.data === 0) {
          setDeletePossibility(true)
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
      }
    }
  }

  const deleteMembershipPlanHandler = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/delete-membership-plan/${props.modalDataId}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });
      const resData = res.data;
      console.log(resData)
      if (resData.success == true) {
        props.handleClose()
        props.loadMembershipPlan()
      } else {
      }
    } catch (e: any) {
      console.log(e)
      // setShowLoadMoreSpinner(false)
      // setPageLoaded(true)
      if (e.code == "ECONNABORTED") {
        // showToast("default", "Timeout. Try again.");
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated") {
        }
      }
    }
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Membership Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Do you want to delete this membership plan?</div>
        {!deletePossibility && <div className='text-danger'>There are records making use of this membership plan, do not delete</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <Button className="btn-custom" disabled={!deletePossibility}
          onClick={() => {
            if (deletePossibility) {
              deleteMembershipPlanHandler()
            }
          }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteMembershipPlanModal
