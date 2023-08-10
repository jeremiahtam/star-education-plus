import { Modal } from 'react-bootstrap';
import AddResourcesModal from './AddResourcesModal';
import EditResourcesModal from './EditResourcesModal';
import DeleteResourcesModal from './DeleteResourcesModal';

function AdminResourcesModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-resources' ?
        <AddResourcesModal handleClose={props.handleClose} loadResources={props.loadResources} /> :
        props.modalType == 'edit-resources' ?
          <EditResourcesModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadResources={props.loadResources} /> :
          props.modalType == 'delete-resources' ?
            <DeleteResourcesModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadResources={props.loadResources} /> :
            ''
      }
    </Modal>
  )
}

export default AdminResourcesModal
