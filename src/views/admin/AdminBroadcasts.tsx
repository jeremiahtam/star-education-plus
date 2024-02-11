import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdCreate } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import { Button, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import BroadcastModal from '../../components/BroadcastModal';
import { HiTrash } from 'react-icons/hi';
import { deleteUserData } from '../../store/actions/user-info';
import { store } from '../../store/root-reducer';
import { useNavigate } from 'react-router';

function AdminBroadcasts(props: any) {
  const userInfoData = useSelector((state: stateLoggedInUserType) => state.userInfo.loggedInUserData)
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
    <BodyWrapper title='Broadcasts'
      rightHandSide={broadcasts?.data && <button className='btn btn-sm btn-custom'
        onClick={() => {
          setModalType('add-broadcast')
          handleShow()
        }}>Create New <IoIosAdd className='btn-icon' /> </button>}>

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
          <div className="table-responsive">
            <table className='table table-hover table-sm'>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {broadcasts.data.map((item: any, index: number) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.sn}</td>
                      <td>{item.title}</td>
                      <td>{item.body}</td>
                      <td ><IoMdCreate onClick={() => {
                        modalDataHandler(item.id, 'edit-broadcast')
                      }} /></td>
                      <td><HiTrash onClick={() => {
                        modalDataHandler(item.id, 'delete-broadcast')
                      }} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>}
        
        {broadcasts.data.length == 0 &&
          <Alert className='form-feedback-message' variant={"info"} dismissible>
            <div>{broadcasts?.message}</div>
          </Alert>}

        {broadcasts.data.length !== 0 &&
          <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
        {modalType && <BroadcastModal show={show} handleClose={handleClose} handleShow={handleShow}
          modalType={modalType} modalDataId={modalDataId} loadBroadcast={getBroadcastsHandler} />}
      </>}
    </BodyWrapper >
  )
}

export default AdminBroadcasts