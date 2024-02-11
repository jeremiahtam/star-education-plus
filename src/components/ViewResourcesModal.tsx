import { Button, Modal } from 'react-bootstrap';

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
