import { Modal } from 'react-bootstrap';
import AddMembershipPlanModal from './AddMembershipPlanModal';
import EditMembershipPlanModal from './EditMembershipPlanModal';
import DeleteMembershipPlanModal from './DeleteMembershipPlanModal';
import ViewMembershipPlanModal from './ViewMembershipPlanModal';

function MembershipPlanModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}
      size={props.modalType == 'delete-membership-plan' ? undefined : 'lg'}>
      {props.modalType == 'add-membership-plan' ?
        <AddMembershipPlanModal handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
        props.modalType == 'edit-membership-plan' ?
          <EditMembershipPlanModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
          props.modalType == 'delete-membership-plan' ?
            <DeleteMembershipPlanModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadMembershipPlan={props.loadMembershipPlan} /> :
            props.modalType == 'view-membership-plan' ?
              <ViewMembershipPlanModal modalDataContent={props.modalDataContent}
                handleClose={props.handleClose} /> :
              ''
      }
    </Modal>
  )
}

export default MembershipPlanModal
