import { Modal } from 'react-bootstrap';
import EditResourcesDocsModal from './EditResourcesDocsModal';
import AddResourcesDocsModal from './AddResourcesDocsModal';
import DeleteResourcesDocsModal from './DeleteResourcesDocsModal';
import ViewResourcesDocsModal from './ViewResourcesDocsModal';

function AdminResourcesDocsModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}
      size={props.modalType == 'view-resources-docs' ? 'lg' : undefined}>
      {props.modalType == 'add-resources-docs' ?
        <AddResourcesDocsModal modalDataId={props.modalDataId} handleClose={props.handleClose}
          resourcesId={props.resourcesId} loadResourcesDocs={props.loadResourcesDocs}
        /> :
        props.modalType == 'edit-resources-docs' ?
          <EditResourcesDocsModal modalDataId={props.modalDataId} handleClose={props.handleClose}
            resourcesId={props.resourcesId} loadResourcesDocs={props.loadResourcesDocs}
          /> :
          props.modalType == 'delete-resources-docs' ?
            <DeleteResourcesDocsModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadResourcesDocs={props.loadResourcesDocs}
            /> :
            props.modalType == 'view-resources-docs' ?
              <ViewResourcesDocsModal modalDataContent={props.modalDataContent} handleClose={props.handleClose} /> :
              ''
      }
    </Modal>
  )
}

export default AdminResourcesDocsModal
