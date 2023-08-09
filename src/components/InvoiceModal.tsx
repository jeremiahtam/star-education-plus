import { Modal } from 'react-bootstrap';
import ViewInvoiceModal from './ViewInvoiceModal';

function InvoiceModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'view-invoice' ?
        <ViewInvoiceModal show={props.show} handleClose={props.handleClose} handleShow={props.handleShow}
          modalType={props.modalType} modalDataContent={props.modalDataContent} /> :
        ''
      }
    </Modal>
  )
}

export default InvoiceModal
