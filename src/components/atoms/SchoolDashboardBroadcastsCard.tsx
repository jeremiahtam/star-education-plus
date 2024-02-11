import { useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux'
import { Alert, Badge, Card } from 'react-bootstrap'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import { useNavigate } from 'react-router-dom';
import BroadcastModal from '../BroadcastModal';

export default function SchoolDashboardBroadcastsCard() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalType, setModalType] = useState<string | null>(null);
  const [modalDataContent, setModalDataContent] = useState<number | null>(null) /* modal dataId */

  const modalDataHandler = useCallback((_dataId: number, _modalType: string) => {
    handleShow()
    setModalDataContent(_dataId)
    setModalType(_modalType)
    console.log(`${_dataId} ${_modalType}`)
  }, [setModalType, setModalDataContent])

  const [broadcasts, setBroadcasts] = useState<any>()

  useEffect(() => {
    getBroadcastsHandler()
  }, [userInfoData])

  const getBroadcastsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-broadcasts`, {
        params: {
          search: '',
          itemsPerPage: 7,
          page: 1
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      console.log(resData)
      if (resData.success == false) {
        return setBroadcasts(resData)
      } else {
        setBroadcasts(resData)
        // setTotalPages(resData.pageInfo.totalPages)
      }
    } catch (e: any) {
      console.log(e)
      if (e.code == "ECONNABORTED") {
        return setBroadcasts({
          "success": false,
          "message": "Request timed out.",
        })
      } else
        if (e?.response?.data !== undefined) {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setBroadcasts({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        } else {
          const errorData = e.response.data;
          if (errorData.message == "Unauthenticated.") {
            store.dispatch(deleteUserData());
          }
          return setBroadcasts({
            "success": false,
            "message": "Error. Something went wrong.",
          })
        }
    }
  }

  return (
    <>
      {broadcasts?.success === false && !broadcasts?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{broadcasts?.message}</div>
        </Alert>}

      {broadcasts?.data && <>
        <Card className='school-dashboard-card mb-3'>
          <Card.Header>
            <Card.Title>Broadcasts</Card.Title>
            <span className='view-all' style={{ cursor: 'pointer' }}
              onClick={() => navigate('/broadcasts')}>
              View all
            </span>
          </Card.Header>
          <Card.Body>
            {broadcasts.data?.length !== 0 &&
              <div className="table-responsive">
                <table className='table table-hover table-sm'>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Details</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcasts.data.map((item: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{item.sn}</td>
                          <td>
                            <b>{item.title}</b>
                            <br />
                            {item.excerpt}
                          </td>
                          <td>
                            {item.date}
                            <br />
                            {item.time}
                          </td>
                          <td onClick={() => {
                            modalDataHandler(item, 'view-broadcast')
                          }}>
                            <Badge bg='success' style={{ cursor: 'pointer' }}>View</Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>}
          </Card.Body>
        </Card>
      </>}

      {modalType && <BroadcastModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataContent={modalDataContent} />}
    </>
  )
}
