import { Modal } from 'react-bootstrap';
import ViewInvoiceModal from './ViewInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';

function InvoiceModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      {props.modalType == 'view-invoice' ?
        <ViewInvoiceModal show={props.show} handleClose={props.handleClose} modalDataContent={props.modalDataContent} /> :
        props.modalType == 'edit-invoice' ?
          <EditInvoiceModal modalDataId={props.modalDataContent} handleClose={props.handleClose}
           loadInvoice={props.getInvoicesHandler} /> :
          ''
      }
    </Modal>
  )
}

export default InvoiceModal
