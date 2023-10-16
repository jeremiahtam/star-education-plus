import { Toast, ToastContainer } from 'react-bootstrap'

interface ToastPropType {
  title: string,
  body: string,
  delay?: number,
  onClose: any,
  show: boolean,
  autohide?: boolean,
}
export default function ToastComponent(props: ToastPropType) {
  return (
    <ToastContainer
      className="p-3"
      position={'middle-center'}
      style={{ zIndex: 1 }}
    >
      <Toast onClose={props.onClose} show={props.show}
        delay={props.delay ? props.delay : undefined} autohide={props.autohide}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{props.title}</strong>
        </Toast.Header>
        <Toast.Body>{props.body}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}
