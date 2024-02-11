import { Button, Modal } from 'react-bootstrap';

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
