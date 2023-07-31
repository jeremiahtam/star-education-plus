import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
// import CustomModal from './AdminPackagesAndServicesModal';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeletePackagesAndServicesModalPropType {
  modalDataId: number,
  handleClose: any,
  loadPackagesAndServices: any
}

function DeletePackagesAndServicesModal(props: DeletePackagesAndServicesModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deletePackagesAndServicesHandler = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/delete-packages-and-services/${props.modalDataId}`,
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
        props.loadPackagesAndServices()
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
        <Modal.Title>Delete Package/Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this package/service?</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <Button className="btn-custom" onClick={() => { deletePackagesAndServicesHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeletePackagesAndServicesModal
