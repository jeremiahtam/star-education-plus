import { Modal } from 'react-bootstrap';
import AddSchoolModal from './AddSchoolModal';
import DeleteSchoolModal from './DeleteSchoolModal';

function SchoolModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose} size='xl'>
      {props.modalType == 'add-school' ?
        <AddSchoolModal handleClose={props.handleClose} loadSchool={props.loadSchool} /> :
          props.modalType == 'delete-school' ?
            <DeleteSchoolModal modalDataId={props.modalDataId}
              handleClose={props.handleClose} loadSchool={props.loadSchool} /> :
            ''
      }
    </Modal>
  )
}

export default SchoolModal
