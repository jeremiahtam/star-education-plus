import { Modal } from 'react-bootstrap';
import EditSchoolPackagesAndServicesDocsModal from './EditSchoolPackagesAndServicesDocsModal';
import AddSchoolPackagesAndServicesDocsModal from './AddSchoolPackagesAndServicesDocsModal';
import DeleteSchoolPackagesAndServicesDocsModal from './DeleteSchoolPackagesAndServicesDocsModal';

function AdminSchoolDocsModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'add-school-packages-and-services-docs' ?
        <AddSchoolPackagesAndServicesDocsModal modalDataId={props.modalDataId}
          handleClose={props.handleClose} loadSchoolDocs={props.loadSchoolDocs}
          orderedItemsId={props.orderedItemsId}
        /> :
        props.modalType == 'edit-school-packages-and-services-docs' ?
          <EditSchoolPackagesAndServicesDocsModal modalDataId={props.modalDataId} handleClose={props.handleClose}
            loadSchoolDocs={props.loadSchoolDocs}
          /> :
          props.modalType == 'delete-school-packages-and-services-docs' ?
            <DeleteSchoolPackagesAndServicesDocsModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadSchoolDocs={props.loadSchoolDocs}
            /> :
            ''
      }
    </Modal>
  )
}

export default AdminSchoolDocsModal
