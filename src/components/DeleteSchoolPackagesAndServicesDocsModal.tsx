import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeleteSchoolPackagesAndServicesDocsModalPropType {
  modalDataId: number,
  handleClose: any,
  loadSchoolDocs: any
}

function DeleteSchoolPackagesAndServicesDocsModal(props: DeleteSchoolPackagesAndServicesDocsModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deleteSchoolPackagesAndServicesDocsHandler = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/delete-document/${props.modalDataId}`,
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
        props.loadSchoolDocs()
      } else {
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
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
        <Modal.Title>Delete Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this document</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <Button className="btn-custom" onClick={() => { deleteSchoolPackagesAndServicesDocsHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteSchoolPackagesAndServicesDocsModal
