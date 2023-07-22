import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import CustomModal from './SchoolModal';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeleteSchoolModalPropType {
  modalDataId: number,
  handleClose: any,
  loadSchool: any
}

function DeleteSchoolModal(props: DeleteSchoolModalPropType) {

  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deleteSchoolHandler = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/api/delete-school/${props.modalDataId}`,
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
        props.loadSchool()
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
        <Modal.Title>Delete School</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this school</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>Close</Button>
        <Button variant="primary" onClick={() => { deleteSchoolHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteSchoolModal
