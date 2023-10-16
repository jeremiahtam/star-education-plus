import { Button, Modal } from 'react-bootstrap'

interface ViewPackagesAndServicesModalPropType {
  modalDataContent: {
    id: number,
    amount: number,
    duration: string,
    packagesAndServicesContent: string,
    name: string,
    status: string,
  },
  handleClose: any,
  loadResources?: any
}
export default function ViewPackagesAndServicesModal(props: ViewPackagesAndServicesModalPropType) {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalDataContent.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.modalDataContent.packagesAndServicesContent}</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}
