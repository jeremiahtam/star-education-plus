import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Table, Button, Pagination, Modal } from 'react-bootstrap';
import CustomModal from './BroadcastModal';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface ViewBroadcastModalPropType {
  modalDataContent: {
    id: number,
    body: string,
    title: string,
  },
  handleClose: any,
  loadBroadcast: any
}

function ViewBroadcastModal(props: ViewBroadcastModalPropType) {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDataContent.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.modalDataContent.body}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline float-end" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}

export default ViewBroadcastModal
