import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import CustomModal from './MembershipPlanModal';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeleteMembershipPlanModalPropType {
  modalDataId: number,
  handleClose: any,
  loadMembershipPlan: any
}

function DeleteMembershipPlanModal(props: DeleteMembershipPlanModalPropType) {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deleteMembershipPlanHandler = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/delete-membership-plan/${props.modalDataId}`,
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
      <Modal.Body>Do you want to delete this membership plan?</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <Button className="btn-custom" onClick={() => { deleteMembershipPlanHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteMembershipPlanModal
