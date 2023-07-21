import { useState, useCallback } from 'react'
import { Image, Button, Row, ButtonToolbar, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';
import personIcon from '../images/person-icon.png'
import ChangeProfilePicModal from './ChangeProfilePicModal';

function EditSchoolProfilePic(props: any) {
  const backEndImageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [profilePic, setProfilePic] = useState<string | null>(props.selectedSchool.profile_pic)

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
        `${baseUrl}/api/delete-school-profile-pic/${props.selectedSchool.id}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 5000,
        });
      const resData = res.data;
      console.log(resData);
      if (resData.success == false) {
        if (resData.errors !== undefined) {
        } else {
          setDeleteProfilePicResponse(resData)
        }
      } else {
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
      <h6>Profile Picture</h6>
      <Row className="align-items-center">
        {deleteProfilePicResponse?.success &&
          <Alert onClose={() => setDeleteProfilePicResponse(null)}
            variant={deleteProfilePicResponse?.success == true ? "success" : "danger"}
            dismissible>
            <div>{deleteProfilePicResponse.message}</div>
          </Alert>}
        <div className='image-box'>
          <Image src={profilePic == null || "" ? personIcon : `${backEndImageBaseUrl}/${profilePic}`
          } width={150} />
        </div>
      </Row>
      <ButtonToolbar className='gap-2'>
        <Button type='button' className='mr-3'
          disabled={props.selectedSchool.profile_pic == null || "" ? true : false}
          onClick={() => deleteProfilePicHandler()}
          variant="outline-danger">Delete</Button>
        <Button variant="primary" type='button' onClick={() => {
          modalDataHandler(props.selectedSchool.id, 'upload-profile-pic')
        }} >Upload</Button>
      </ButtonToolbar>
      {modalType && <ChangeProfilePicModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataId={modalDataId} setProfilePic={(pic: string) => setProfilePic(pic)} />}
    </div>
  )
}

export default EditSchoolProfilePic