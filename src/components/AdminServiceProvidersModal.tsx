import { Modal } from 'react-bootstrap';
import AddServiceProvidersModal from './AddServiceProvidersModal';
import EditServiceProvidersModalModal from './EditServiceProvidersModal';
import DeleteServiceProvidersModalModal from './DeleteServiceProvidersModal';

function AdminServiceProvidersModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType === 'add-service-providers' ?
        <AddServiceProvidersModal handleClose={props.handleClose} schoolId={props.schoolId}
          loadServiceProviders={props.loadServiceProviders} /> :
        props.modalType === 'edit-service-providers' ?
          <EditServiceProvidersModalModal modalDataId={props.modalDataId}
            handleClose={props.handleClose} loadServiceProviders={props.loadServiceProviders} /> :
          props.modalType === 'delete-service-providers' ?
            <DeleteServiceProvidersModalModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadServiceProviders={props.loadServiceProviders} />
            :
            ''
      }
    </Modal>
  )
}

export default AdminServiceProvidersModal
