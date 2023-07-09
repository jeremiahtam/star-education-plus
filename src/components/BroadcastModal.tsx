import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import AddBroadcastModal from './AddBroadcastModal';
import EditBroadcastModal from './EditBroadcastModal';
import DeleteBroadcastModal from './DeleteBroadcastModal';

function BroadcastModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-broadcast' ?
        <AddBroadcastModal handleClose={props.handleClose} loadBroadcast={props.loadBroadcast} /> :
        props.modalType == 'edit-broadcast' ?
          <EditBroadcastModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadBroadcast={props.loadBroadcast} /> :
          props.modalType == 'delete-broadcast' ?
            <DeleteBroadcastModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadBroadcast={props.loadBroadcast} /> :
            ''
      }
    </Modal>
  )
}

export default BroadcastModal
