import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import AddMembershipPlanModal from './AddMembershipPlanModal';
import EditMembershipPlanModal from './EditMembershipPlanModal';
import DeleteMembershipPlanModal from './DeleteMembershipPlanModal';

function MembershipPlanModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-membership-plan' ?
        <AddMembershipPlanModal handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
        props.modalType == 'edit-membership-plan' ?
          <EditMembershipPlanModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
          props.modalType == 'delete-membership-plan' ?
            <DeleteMembershipPlanModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
            ''
      }
    </Modal>
  )
}

export default MembershipPlanModal
