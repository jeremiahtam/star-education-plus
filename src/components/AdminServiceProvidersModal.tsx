import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import AddServiceProvidersModal from './AddServiceProvidersModal';
import EditMembershipPlanModal from './EditMembershipPlanModal';
import DeleteMembershipPlanModal from './DeleteMembershipPlanModal';

function AdminServiceProvidersModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-service-providers' ?
        <AddServiceProvidersModal handleClose={props.handleClose} loadServiceProviders={props.loadServiceProviders} /> :
        props.modalType == 'edit-service-providers' ?
          <EditMembershipPlanModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadServiceProviders={props.loadServiceProviders} /> :
          // props.modalType == 'delete-service-providers' ?
          //   <DeleteMembershipPlanModal modalDataId={props.modalDataId}
          //     handleClose={props.handleClose} loadServiceProviders={props.loadServiceProviders} /> :
            'Hellloiojiopiom'
      }
    </Modal>
  )
}

export default AdminServiceProvidersModal
