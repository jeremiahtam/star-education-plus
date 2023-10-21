import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import BodyWrapper from '../../components/BodyWrapper'
import { useSelector } from 'react-redux'
import { Alert, Badge, Form, Button, Card, Col, Row, InputGroup } from 'react-bootstrap'
import { FaOpencart } from 'react-icons/fa'
import { BiPackage } from 'react-icons/bi'
import { LuSubtitles } from 'react-icons/lu'
import { store } from '../../store/root-reducer';
import { stateLoggedInUserType } from '../../../types/type-definitions';
import { deleteUserData } from '../../store/actions/user-info';
import { IoMdSearch } from 'react-icons/io';
import { MdOutlineClear } from 'react-icons/md';
import CustomPagination from '../../components/CustomPagination';
import BroadcastModal from '../../components/BroadcastModal';
import { Link } from 'react-router-dom';

function SchoolMetrics() {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
    <BodyWrapper title='Dashboard'>
      <Row className='card-items-row'>
        <Col lg={7} md={6} className='mb-3'>
          {broadcasts?.success === false && !broadcasts?.data &&
            <Alert className='form-feedback-message' variant={"danger"} dismissible>
              <div>{broadcasts?.message}</div>
            </Alert>}

          {broadcasts?.data && <>
            <Card className='dashboard-broadcasts-card'>
              <Card.Header>Broadcasts</Card.Header>
              <Card.Body>

                {broadcasts.data?.length !== 0 &&
                  <>
                    {broadcasts.data.map((item: any, index: number) => {
                      return (
                        <div className='broadcast-item' key={index}
                          onClick={() => {
                            modalDataHandler(item, 'view-broadcast')
                          }}>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>
                            {item.excerpt}
                          </Card.Text>
                        </div>
                      )
                    })}

                  </>}

                {broadcasts.data?.length == 0 &&
                  <Alert className='form-feedback-message' variant={"info"} dismissible>
                    <div>{broadcasts?.message}</div>
                  </Alert>}
              </Card.Body>

              {broadcasts.data?.length !== 0 &&
                <Card.Footer>
                  <Link to={'/broadcasts'}>
                    See all broadcasts
                  </Link>
                </Card.Footer>
              }
            </Card>
          </>}
          {modalType && <BroadcastModal show={show} handleClose={handleClose} handleShow={handleShow}
            modalType={modalType} modalDataContent={modalDataContent} />}
        </Col>
      </Row>

    </BodyWrapper>
  )
}

export default SchoolMetrics