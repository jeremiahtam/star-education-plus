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

function SchoolBroadcastss() {
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

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(10)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  // Search 
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (broadcasts !== null) {
      if (search === '') {
        getBroadcastsHandler()
      }
    }
  }, [search])

  useEffect(() => {
    if (broadcasts !== null) {
      getBroadcastsHandler()
    }
  }, [userInfoData, page, itemsPerPage])

  useEffect(() => {
    getBroadcastsHandler()
  }, [userInfoData])

  const getBroadcastsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-broadcasts`, {
        params: {
          search,
          itemsPerPage: itemsPerPage,
          page: page
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
        setTotalPages(resData.pageInfo.totalPages)
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
    <BodyWrapper title='My Broadcasts'>
      {broadcasts?.success === false && !broadcasts?.data &&
        <Alert className='form-feedback-message' variant={"danger"} dismissible>
          <div>{broadcasts?.message}</div>
        </Alert>}

      {broadcasts?.data && <>
        <div className='search-area mb-3'>
          <Form>
            <Row className="justify-content-end">
              <Col md={4} sm={10} className="my-1 search-bar">
                <Form.Label htmlFor="search" visuallyHidden>
                  Search
                </Form.Label>
                <InputGroup className=''>
                  <InputGroup.Text><IoMdSearch size={24} /></InputGroup.Text>
                  <Form.Control id="search" placeholder="Search"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSearch(e.target.value)
                    }} value={search} />
                  {search !== '' &&
                    <InputGroup.Text onClick={(e: any) => {
                      e.preventDefault()
                      setPage(1)
                      setSearch('')
                    }} className='cancel-button' >
                      <MdOutlineClear size={24} />
                    </InputGroup.Text>}
                  <Button type="submit" onClick={(e: any) => {
                    e.preventDefault()
                    setPage(1)
                    getBroadcastsHandler()
                  }} hidden>Search</Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </div>

        {broadcasts.data.length !== 0 &&
          <Row className='card-items-row'>
            {broadcasts.data.map((item: any, index: number) => {
              return (
                <Col lg={3} md={4} className='mb-3' key={index}>
                  <Card className='broadcast-card'>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 broadcast-card-sub-title">
                        <LuSubtitles /> {item.title}
                      </Card.Subtitle>
                      <div className='broadcast-card-border mb-3 mt-3'></div>
                      <Card.Text className='broadcast-card-text'>
                        {item.excerpt}
                        <Card.Link
                          onClick={() => {
                            modalDataHandler(item, 'view-broadcast')
                          }}> Read more.
                        </Card.Link>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>)
            })}
          </Row>}

        {broadcasts.data.length == 0 &&
          <Alert className='form-feedback-message' variant={"info"} dismissible>
            <div>{broadcasts?.message}</div>
          </Alert>}

        {broadcasts.data.length !== 0 &&
          <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
        {modalType && <BroadcastModal show={show} handleClose={handleClose} handleShow={handleShow}
          modalType={modalType} modalDataContent={modalDataContent} />}

      </>}
    </BodyWrapper>
  )
}

export default SchoolBroadcastss