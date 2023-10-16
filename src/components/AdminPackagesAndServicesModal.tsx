import { Modal } from 'react-bootstrap';
import AddPackagesAndServicesModal from './AddPackagesAndServicesModal';
import EditPackagesAndServicesModal from './EditPackagesAndServicesModal';
import DeletePackagesAndServicesModal from './DeletePackagesAndServicesModal';
import ViewPackagesAndServicesModal from './ViewPackagesAndServicesModal';

function AdminPackagesAndServicesModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-packages-and-services' ?
        <AddPackagesAndServicesModal handleClose={props.handleClose} loadPackagesAndServices={props.loadPackagesAndServices} /> :
        props.modalType == 'edit-packages-and-services' ?
          <EditPackagesAndServicesModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadPackagesAndServices={props.loadPackagesAndServices} /> :
          props.modalType == 'delete-packages-and-services' ?
            <DeletePackagesAndServicesModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadPackagesAndServices={props.loadPackagesAndServices} /> :
            props.modalType == 'view-packages-and-services' ?
              <ViewPackagesAndServicesModal modalDataContent={props.modalDataContent}
                handleClose={props.handleClose} /> :
              ''
      }
    </Modal>
  )
}

export default AdminPackagesAndServicesModal
