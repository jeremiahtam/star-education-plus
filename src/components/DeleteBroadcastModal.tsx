import { Button, Modal } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

interface DeleteBroadcastModalPropType {
  modalDataId: number,
  handleClose: any,
  loadBroadcast: any
}

function DeleteBroadcastModal(props: DeleteBroadcastModalPropType) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const deleteBroadcastHandler = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/delete-broadcast/${props.modalDataId}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });
      const resData = res.data;
      console.log(resData)
      if (resData.success === true) {
        props.handleClose()
        props.loadBroadcast()
      } else {
      }
    } catch (e: any) {
      console.log(e)
      // setShowLoadMoreSpinner(false)
      // setPageLoaded(true)
      if (e.code === "ECONNABORTED") {
        // showToast("default", "Timeout. Try again.");
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
        if (errorData.message === "Unauthenticated") {
        }
      }
    }
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Broadcast</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this broadcast</Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
        <Button className="btn-custom" onClick={() => { deleteBroadcastHandler() }}>Delete</Button>
      </Modal.Footer>
    </>
  )
}

export default DeleteBroadcastModal
