import { useState, useEffect } from 'react'
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../types/type-definitions';

function ViewPackagesAndServicesAttendance(props: any) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)

  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

  useEffect(() => {
    getAttendanceHandler()
  }, [])

  const getAttendanceHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-packages-and-services-attendance`,
        {
          params: {
            orderedItemsId: props.modalDataId
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userInfoData.token}`,
          },
          timeout: 30000,
        });

      const resData = res.data;
      console.log(resData.data);
      if (resData.success == false) {

      } else {
        setSelectedAttendance(resData.data)
      }
    } catch (e: any) {
      console.log(e);
      if (e.code == "ECONNABORTED") {
      }
      if (e?.response?.data !== undefined) {
        const errorData = e.response.data;
      }
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Packages and services Attendance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedAttendance !== null && <Alert className='form-feedback-message'
          variant={!!selectedAttendance.attendance ? 'success' : "warning"}>
          <div>{!!selectedAttendance.attendance ?
            "You were marked present"
            :
            'You have not been marked present'
          }</div>
        </Alert>}

      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-custom-outline" onClick={props.handleClose}>Close</Button>
      </Modal.Footer>
    </>
  )
}

export default ViewPackagesAndServicesAttendance
