import { Button, Modal } from 'react-bootstrap';

interface ViewMembershipPlanModalPropType {
  modalDataContent: {
    id: number,
    membershipPlanContent: string,
    name: string,
  },
  handleClose: any,
}

function ViewMembershipPlanModal(props: ViewMembershipPlanModalPropType) {

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDataContent.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.modalDataContent.membershipPlanContent}
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline float-end" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}

export default ViewMembershipPlanModal
