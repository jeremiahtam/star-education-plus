import { Modal } from 'react-bootstrap';
import AdminMarkPackagesAndServicesAttendance from './AdminMarkPackagesAndServicesAttendance';

function AdminViewSchoolPackagesAndServicesModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'mark-packages-and-services-attendance' ?
        <AdminMarkPackagesAndServicesAttendance handleClose={props.handleClose} modalDataId={props.modalDataId}
          loadSchoolPackagesAndServices={props.loadSchoolPackagesAndServices}
        /> :
        ''
      }
    </Modal>
  )
}

export default AdminViewSchoolPackagesAndServicesModal
