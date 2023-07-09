import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import CustomModal from './BroadcastModal';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeleteBroadcastModalPropType {
  modalDataId: number,
  handleClose: any,
  loadBroadcast: any
}

function DeleteBroadcastModal(props: DeleteBroadcastModalPropType) {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deleteBroadcastHandler = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/delete-broadcast/${props.modalDataId}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
        });
      const resData = res.data;
      console.log(resData)
      if (resData.success == true) {
        props.handleClose()
        props.loadBroadcast()
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
        <Modal.Title>Delete Broadcast</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this broadcast</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>Close</Button>
        <Button variant="primary" onClick={() => { deleteBroadcastHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteBroadcastModal
