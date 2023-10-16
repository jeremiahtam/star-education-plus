import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface ViewResourcesModalPropType {
  modalDataContent:{
    id: number,
    amount: number,
    duration: string,
    resourcesContent: string,
    name: string,
    status: string,
    },
  handleClose: any,
  loadResources?: any
}

function ViewResourcesModal(props: ViewResourcesModalPropType) {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDataContent.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.modalDataContent.resourcesContent}</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}

export default ViewResourcesModal
