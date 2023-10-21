import { useState, useCallback } from 'react'
import { Image, Row, Alert, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import personIcon from '../images/person-icon.png'
import ChangeProfilePicModal from './ChangeProfilePicModal';
import { BsPencilFill } from 'react-icons/bs';
import { store } from '../store/root-reducer';
import { updateProfilePic } from '../store/actions/user-info';

function EditProfilePic(props: any) {
  const backEndImageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [deleteProfilePicResponse, setDeleteProfilePicResponse] = useState<any>(null)
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  //Modal COntrol
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataId, setModalDataId] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataId: number, _modalType: string) => {
    handleShow()
    setModalDataId(_dataId)
    setModalType(_modalType)
    console.log(`${_dataId} ${_modalType}`)
  }, [setModalType, setModalDataId])

  const deleteProfilePicHandler = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/delete-school-profile-pic/${userInfoData.userId}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });
      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
        } else {
          setDeleteProfilePicResponse(resData)
        }
      } else {
        store.dispatch(updateProfilePic(null))
        setDeleteProfilePicResponse(resData)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
        setDeleteProfilePicResponse({
          success: false,
          message: 'Time out'
        })
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
      }
    }
  };

  return (
    <div className='profile-pic-section'>
      <h6 className='form-heading'>Profile Picture</h6>
      <Row className="align-items-center">
        {deleteProfilePicResponse?.success &&
          <Alert className='form-feedback-message' onClose={() => setDeleteProfilePicResponse(null)}
            variant={deleteProfilePicResponse?.success == true ? "success" : "danger"}
            dismissible>
            <div>{deleteProfilePicResponse.message}</div>
          </Alert>}
        <div className='image-outter-box'>
          <div className='image-box'>
            <Image src={userInfoData.userProfilePic == null || "" ?
              personIcon : `${backEndImageBaseUrl}/${userInfoData.userProfilePic}`
            } width={150} />
          </div>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              <BsPencilFill />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#"
                disabled={userInfoData.userProfilePic == null || "" ? true : false}
                onClick={() => deleteProfilePicHandler()}
              >Delete</Dropdown.Item>
              <Dropdown.Item href="#"
                onClick={() => {
                  modalDataHandler(userInfoData.userId, 'upload-profile-pic')
                }}>Edit</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Row>
      {modalType && <ChangeProfilePicModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataId={modalDataId} />}
    </div>
  )
}

export default EditProfilePic