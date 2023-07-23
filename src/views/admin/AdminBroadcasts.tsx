import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import BodyWrapper from '../../components/BodyWrapper'
import { IoMdSearch, IoMdTrash, IoMdCreate } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineClear } from "react-icons/md";
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { stateLoggedInUserType } from '../../../types/type-definitions';
import CustomPagination from '../../components/CustomPagination';
import CustomModal from '../../components/BroadcastModal';

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

  const [broadcasts, setBroadcasts] = useState<any[]>([])

  // Pagination control
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(2)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  // Search 
  const [search, setSearch] = useState<string>('')
  useEffect(() => {
    if (search === '') {
      getBroadcastsHandler()
    }
  }, [search])

  useEffect(() => {
    getBroadcastsHandler()
  }, [userInfoData, page, itemsPerPage])

  const getBroadcastsHandler = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/all-broadcasts`, {
        params: {
          search,
          items_per_page: itemsPerPage,
          page: page
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userInfoData.token}`,
        },
        timeout: 30000,
      });
      const resData = res.data;
      // console.log(resData)
      if (resData.success == true) {
        setBroadcasts(resData.data)
        setTotalPages(resData.pageInfo.totalPages)
      } else {

      }
    } catch (e: any) {
      console.log(e)
      // setShowLoadMoreSpinner(false)
      // setPageLoaded(true)
      if (e.code == "ECONNABORTED") {
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
    <BodyWrapper title='Broadcasts'
      rightHandSide={<button className='btn btn-sm btn-custom'
        onClick={() => {
          setModalType('add-broadcast')
          handleShow()
        }}>Create New <IoIosAdd className='btn-icon' /> </button>}>
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
      {
        broadcasts.length !== 0 &&
        <div className="table-responsive">
          <table className='table table-hover table-sm'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Body</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.body}</td>
                    <td ><IoMdCreate onClick={() => {
                      modalDataHandler(item.id, 'edit-broadcast')
                    }} /></td>
                    <td><IoMdTrash onClick={() => {
                      modalDataHandler(item.id, 'delete-broadcast')
                    }} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      }
      {broadcasts.length !== 0 &&
        <CustomPagination page={page} setPage={setPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />}
      {modalType && <CustomModal show={show} handleClose={handleClose} handleShow={handleShow}
        modalType={modalType} modalDataId={modalDataId} loadBroadcast={getBroadcastsHandler} />
      }
    </BodyWrapper >
  )
}

AdminBroadcasts.propTypes = {}

export default AdminBroadcasts
