import { Modal } from 'react-bootstrap';
import AdminMarkPackagesAndServicesAttendance from './AdminMarkPackagesAndServicesAttendance';
import ViewPackagesAndServicesAttendance from './ViewPackagesAndServicesAttendance';

function AdminViewSchoolPackagesAndServicesModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'mark-packages-and-services-attendance' ?
        <AdminMarkPackagesAndServicesAttendance handleClose={props.handleClose} modalDataId={props.modalDataId}
          loadSchoolPackagesAndServices={props.loadSchoolPackagesAndServices}
        /> :
        props.modalType == 'view-packages-and-services-attendance' ?
          <ViewPackagesAndServicesAttendance handleClose={props.handleClose} modalDataId={props.modalDataId} />
          :
          ''
      }
    </Modal>
  )
}

export default AdminViewSchoolPackagesAndServicesModal
